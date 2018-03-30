var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Products = require('../models/products');
var Marketplaces = require('../models/marketplaces');

var saver = require('../../manager/routes/misc/saver');

var pricesRouter = express.Router();
pricesRouter.use(bodyParser.json());

var prices = [];

var parseStrings = function (strings) {
    try {
        let price = parseFloat(strings['priceString'].match(/[-]?[0-9]+([.]?[,]?[0-9]+)?/gi)[0].replace(/,/g, '.'), 10);
        let curr = '';
        if (strings['priceString'].match(/£/gi) || strings['priceString'].match(/GBP/gi)) curr = 'gbp';
        if (strings['priceString'].match(/€/gi) || strings['priceString'].match(/EUR/gi)) curr = 'eur';
        if (strings['priceString'].match(/\$/gi) || strings['priceString'].match(/USD/gi)) curr = 'usd';
        let disc = null;
        if (strings['discString'] && strings['discString'].length > 0) {
            let res = parseFloat(strings['discString'].match(/[-]?[0-9]+([.]?[,]?[0-9]+)?/gi)[0].replace(/,/g, '.'), 10);
            if (res > 0) disc = res;
        }
        return {price: price, disc: disc, curr: curr};
   
    } catch (err) {
        return null;
    }
}

// Get price
pricesRouter.route('/:_id')
    .get(function (req, res, next) {
        let fromCache = false;
        let now = new Date();
        var ONE_HOUR = 60 * 60 * 1000;
        for (let i = 0; i < prices.length; i++) {
            if (prices[i]._id === req.params._id) {
                // console.log(prices[i]);
                if ((now - prices[i].updated) < ONE_HOUR) {
                    fromCache = true;
                    console.log('From cache: ', prices[i].answer);
                    res.json(prices[i].answer);
                } else {
                    prices = prices.splice(i, 1);
                }
                break;
            }        
        }
        if (!fromCache) {
            Products.findById(req.params._id)
            .populate('marketplace')
            .exec((err, product) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                if(product){
                    const parser = require('../../manager/parsers/' + product.marketplace.parser);
                    if (parser.hasAPI) {
                        parser.parsePrice(product.link)
                        .then(strings => {
                            let answer = parseStrings(strings);
                            if (answer) {
                                prices.push({
                                    _id: req.params._id,
                                    updated: new Date(),
                                    answer: answer
                                });
                                console.log('Fresh answer: ', answer);
                                res.json(answer);
                            } else {
                                res.status(400);
                                res.json(null);
                            }
                        })
                        .catch (err => {
                            console.log(err);
                            res.status(400);
                            res.json(null);
                        });
                    } else {
                        saver.download(product.link)
                        .then(page => {
                            parser.parsePrice(product.link, page)
                            .then(strings => {
                                let answer = parseStrings(strings);
                                if (answer) {
                                    prices.push({
                                        _id: req.params._id,
                                        updated: new Date(),
                                        answer: answer
                                    });
                                    console.log('Fresh answer: ', answer);
                                    res.json(answer);
                                } else {
                                    res.status(400);
                                    res.json(null);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400);
                                res.json(null);
                            });
                        })
                        .catch (err => {
                            console.log(err);
                            res.status(400);
                            res.json(null);
                        });
                    }
            } else {
                console.log('Product not found');
                res.status(400);
                res.json(null);
            }
        });
    }
});


module.exports = pricesRouter;