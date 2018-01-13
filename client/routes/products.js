var express = require('express');
var mongoose = require('mongoose');

var Products = require('../models/products');
var products = require('./misc/products');

var Verify = require('./verify');

var productsRouter = express.Router();

/*productsRouter.route('/preview/:id')
// Get selected product by id
.get(function (req, res, next) {
    Products.findById(req.params.id)
    .populate('badges')
    .lean()
    .exec(function (err, result) {
        if (err) {
            console.log(err);
            err.status = 500;
            return next(err);
        }
        let promises = [];
        promises.push(products.getProductBrand(result._id)
            .then(
            (brand) => {
                if (brand == null) {
                    brand = {name: '', _id: ''};
                }
                result.brand = brand;
            },
            (err) => {
                return Promise.reject(err);
            }));

        promises.push(products.getProductCategory(result._id)
            .then(
            (category) => {
                result.category = category;
            },
            (err) => {
                return Promise.reject(err);
            }));

        promises.push(products.getProductShop(result._id)
            .then(
            (shop) => {
                if (shop == null) {
                    shop = {name: '', _id: ''};
                }
                result.shop = shop;
            },
            (err) => {
                return Promise.reject(err);
            }));

        promises.push(products.getProductTags(result._id)
            .then(
            (tags) => {
                result.tags = tags;
            },
            (err) => {
                return Promise.reject(err);
            }));
        
        
        Promise.all(promises)
        .then(() => {
            console.log(result);
            res.json(result);
        },
        (err) => {
            console.log(err);
            err.status = 500;
            return next(err);
        });
    });
});*/

productsRouter.route('/:promoLink')
// Get selected product by promoLink
.get(Verify.verifyClient, function (req, res, next) {
    console.log(req.params.promoLink);
    Products.findOne({'promoLink': req.params.promoLink})
    .populate('badges')
    .lean()
    .exec(function (err, result) {
        if (err) {
            console.log(err);
            err.status = 500;
            return next(err);
        }
        let promises = [];
        if(result) {
            promises.push(products.getProductBrand(result._id)
            .then(
            (brand) => {
                if (brand == null) {
                    brand = {name: '', _id: ''};
                }
                result.brand = brand;
            },
            (err) => {
                return Promise.reject(err);
            }));

        promises.push(products.getProductCategory(result._id)
            .then(
            (category) => {
                result.category = category;
            },
            (err) => {
                return Promise.reject(err);
            }));

        promises.push(products.getProductShop(result._id)
            .then(
            (shop) => {
                if (shop == null) {
                    shop = {name: '', _id: ''};
                }
                result.shop = shop;
            },
            (err) => {
                return Promise.reject(err);
            }));

        promises.push(products.getProductTags(result._id)
            .then(
            (tags) => {
                result.tags = tags;
            },
            (err) => {
                return Promise.reject(err);
            }));
        
        Promise.all(promises)
        .then(() => {
            //console.log(result);
            res.json(result);
        },
        (err) => {
            console.log(err);
            err.status = 500;
            return next(err);
        });
        } else {
            //console.log(result);
            res.json(result);
        }
        
    });
});

module.exports = productsRouter;