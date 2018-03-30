var request = require('request');
var express = require('express');
var config = require('../../config');

var Verify = require('./verify');

const priceCheckerUrl = "http://localhost:" + config.portPriceChecker + '/prices/';
const exchangeRateUrl = "http://localhost:" + config.portExchangeRate + '/exchange/';

var pricesRouter = express.Router();

pricesRouter.route('/:_id')
// Get product price
.get(Verify.verifyClient, function (req, res, next) {
    const options = {
        json:true
    };
    request(priceCheckerUrl + req.params._id, options, (err, priceResponse, priceAnswer) => {
        if (err) {
            console.log(err);
            err.status = 500;
            return next(err);
        }
        if (priceResponse.statusCode === 200) {
            console.log(priceAnswer);
            request(exchangeRateUrl + priceAnswer.curr, options, (err, exchangeResponse, exchangeAnswer) => {
                if (err) {
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                if (exchangeResponse.statusCode === 200) {
                    console.log(exchangeAnswer);
                    if (priceAnswer.price) {
                        const answer = {
                            val: parseInt(priceAnswer.price * exchangeAnswer.value),
                            disc: priceAnswer.disc ? parseInt(priceAnswer.disc * exchangeAnswer.value) : null
                        };
                        console.log(answer);
                        res.json(answer);
                    } else {
                        res.json(null);
                    }
                } else {
                    res.json(null);
                }
            });
        } else {
            res.json(null);
        }
    })
});

module.exports = pricesRouter;