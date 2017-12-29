var express = require('express');
var mongoose = require('mongoose');
var async = require('async');

var Products = require('../models/products');
var Categories = require('../models/categories');
var Brands = require('../models/brands');
var Shops = require('../models/shops');

var searchRouter = express.Router();

searchRouter.route('/')
    .get(function (req, res, next) {
        res.json(null);
    });


searchRouter.route('/:text')
// Searching
    .get(function (req, res, next) {
        let searchResult = {
            products: [],
            categories: [],
            brands: [],
            shops: []
        };
        var tasks = [];
        tasks.push(
            (callback) => {
                Products.find({}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].title.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            searchResult.products.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            let existed = false;
                            for (let j = 0; j < searchResult.products.length; j++) {
                                if (searchResult.products[j]._id === result[i]._id) {
                                    existed = true;
                                    break;
                                }
                            }
                            if (!existed) {
                                searchResult.products.push(result[i]);
                                continue;
                            }
                        }
                    }
                    callback(null);
                });
            }
        );
        tasks.push(
            (callback) => {
                Categories.find({}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].name.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            searchResult.categories.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            let existed = false;
                            for (let j = 0; j < searchResult.categories.length; j++) {
                                if (searchResult.categories[j]._id === result[i]._id) {
                                    existed = true;
                                    break;
                                }
                            }
                            if (!existed) {
                                searchResult.categories.push(result[i]);
                                continue;
                            }
                        }
                    }
                    callback(null);
                });
            }
        );
        tasks.push(
            (callback) => {
                Brands.find({}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].name.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            searchResult.brands.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            let existed = false;
                            for (let j = 0; j < searchResult.brands.length; j++) {
                                if (searchResult.brands[j]._id === result[i]._id) {
                                    existed = true;
                                    break;
                                }
                            }
                            if (!existed) {
                                searchResult.brands.push(result[i]);
                                continue;
                            }
                        }
                    }
                    callback(null);
                });
            }
        );
        tasks.push(
            (callback) => {
                Shops.find({}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].name.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            searchResult.shops.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.toLowerCase().indexOf(req.params.text.toLowerCase()) >= 0) {
                            let existed = false;
                            for (let j = 0; j < searchResult.shops.length; j++) {
                                if (searchResult.shops[j]._id === result[i]._id) {
                                    existed = true;
                                    break;
                                }
                            }
                            if (!existed) {
                                searchResult.shops.push(result[i]);
                                continue;
                            }
                        }
                    }
                    callback(null);
                });
            }
        );
        async.parallel(tasks, (err) => {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(searchResult);
            res.json(searchResult);
        });
});

module.exports = searchRouter;