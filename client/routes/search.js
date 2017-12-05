var express = require('express');
var mongoose = require('mongoose');
var async = require('async');

var Products = require('../models/products');
var Categories = require('../models/categories');
var Brands = require('../models/brands');
var Shops = require('../models/shops');

var searchRouter = express.Router();

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
                        if(result[i].title.indexOf(req.params.text) > 0) {
                            searchResult.products.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.indexOf(req.params.text) > 0) {
                            searchResult.products.push(result[i]);
                            continue;
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
                        if(result[i].name.indexOf(req.params.text) > 0) {
                            searchResult.categories.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.indexOf(req.params.text) > 0) {
                            searchResult.categories.push(result[i]);
                            continue;
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
                        if(result[i].name.indexOf(req.params.text) > 0) {
                            searchResult.brands.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.indexOf(req.params.text) > 0) {
                            searchResult.brands.push(result[i]);
                            continue;
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
                        if(result[i].name.indexOf(req.params.text) > 0) {
                            searchResult.shops.push(result[i]);
                            continue;
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].description.indexOf(req.params.text) > 0) {
                            searchResult.shops.push(result[i]);
                            continue;
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