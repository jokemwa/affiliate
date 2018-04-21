var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var convert = require('xml-js');

var exchangeRouter = express.Router();
exchangeRouter.use(bodyParser.json());

const bank = 'http://www.boi.org.il/currency.xml?curr=';
const currCodes = {
    usd: '01',
    eur: '27',
    gbp: '02'
};

var ACTUAL_RATES = {
    usd: {
        rate: null,
        updated: null
    },
    eur: {
        rate: null,
        updated: null
    },
    gbp: {
        rate: null,
        updated: null
    }
};

var getRate = function(curr) {
    return new Promise((resolve, reject) => {
        var actualRate = {
            value: null,
            updated: null
        };
        if (!currCodes.hasOwnProperty(curr)) reject('Currency code not supported.')
        else {
            request.get(bank + currCodes[curr], {maxRedirects: 99, followAllRedirects: true}, (err, resp, data) => {
                if (err) {
                    reject('Request to bank failed.');
                }
                try {
                    let rate = convert.xml2js(data);
                    let now = new Date();
                    now.setHours(0,0,0,0);
                    actualRate.updated = now;

                    if (rate.elements[0].elements[1].elements[4].elements[0].text) {
                        actualRate.value = parseFloat(rate.elements[0].elements[1].elements[4].elements[0].text, 10);
                    } else reject('Unrecognized bank response.');

                    resolve(actualRate);

                } catch (err) {
                    reject('Unrecognized bank response.');
                }
            });
        }
    });
}

// Get currency exchange rate
exchangeRouter.route('/:curr')
    .get(function (req, res, next) {
        let curr = req.params.curr;
        if (!curr || !currCodes.hasOwnProperty(curr)) {
            let err = new Error('Currency not supported.');
            err.status = 500;
            return next(err);
        } else {
            let now = new Date();
            now.setHours(0,0,0,0);
            now.setDate(now.getDate() - 1);
            console.log(ACTUAL_RATES[curr].updated);
            console.log(now);
            if (!ACTUAL_RATES[curr].updated || now > ACTUAL_RATES[curr].updated) {
                console.log('Got from server');
                getRate(curr)
                .then((rate) => {
                    ACTUAL_RATES[curr] = rate;
                    let result = ACTUAL_RATES[curr];
                    console.log(result);
                    res.json(result);
                })
                .catch (err => {
                    return next(err);
                });
            } else {
                console.log('Got from cache');
                let result = ACTUAL_RATES[curr];
                console.log(result);
                res.json(result);
            }

        }
});

module.exports = exchangeRouter;