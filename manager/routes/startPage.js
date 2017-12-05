var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var StartPageCategoriesLists = require('../models/startPage/startPageCategoriesLists');
var StartPageCategories = require('../models/startPage/startPageCategories');
var StartPageTops = require('../models/startPage/startPageTops');
var StartPageMarketingMessages = require('../models/startPage/startPageMarketingMessages');

var startPage = require('./misc/startPage');

var startPageRouter = express.Router();
startPageRouter.use(bodyParser.json());


startPageRouter.route('/categories-list')
// Get start page's categories list
    .get(Verify.verifyUser, function (req, res, next) {
        StartPageCategoriesLists.findOne({"version": 0})
        .populate({
            path:     'items.category',			
            populate: { path:  'category'}
          })
        .populate({
            path:     'items.category',			
            populate: { path:  'items.product'}
          })
        .exec(function(err, result){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result) {
                console.log(result);
                res.json(result);
            } else {
                // Create new list
                StartPageCategoriesLists.create({"version": 0}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    console.log(result);
                    res.json(result);
                });
            }
            
        });
    })

// Update list
    .put(Verify.verifyUser, function (req, res, next) {
        StartPageCategoriesLists.findOneAndUpdate({"version": 0},
        req.body,
        { new: true }, 
        function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
});

startPageRouter.route('/categories-list/add')
// Add category to list
    .post(Verify.verifyUser, function (req, res, next) {
        startPage.addCategoryToList(req.body.category_id,
            (err, result) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
        });
});

startPageRouter.route('/categories-list/categories/:category_id/:product_id')
// Remove product from category
    .delete(Verify.verifyUser, function (req, res, next) {
        startPage.removeProductFromCategory(req.params.category_id, req.params.product_id,
        (err, result) => {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });

startPageRouter.route('/categories-list/categories/:category_id')
// Add product to category
    .post(Verify.verifyUser, function (req, res, next) {
        startPage.addProductToCategory(req.params.category_id, req.body.product_id,
        (err, result) => {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    })
// Update products order in category
    .put(Verify.verifyUser, function (req, res, next) {
        StartPageCategories.findByIdAndUpdate(req.params.category_id,
        req.body,
        { new: true },
        (err, result) => {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    })
// Delete category from list
    .delete(Verify.verifyUser, function (req, res, next) {
        startPage.removeCategoryFromList(req.params.category_id,
            (err, result) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
        });
});

startPageRouter.route('/tops')
// Get start page's top products list
    .get(Verify.verifyUser, function (req, res, next) {
        StartPageTops.findOne({"version": 0})
        .populate("items.product")
        .exec(function(err, result){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result) {
                console.log(result);
                res.json(result);
            } else {
                // Create new list
                StartPageTops.create({"version": 0}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    console.log(result);
                    res.json(result);
                });
            }
        });
    })
    // Update list
    .put(Verify.verifyUser, function (req, res, next) {
        StartPageTops.findOneAndUpdate({"version": 0},
        req.body,
        { new: true }, 
        function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
});

startPageRouter.route('/tops/add')
// Add product to tops
    .post(Verify.verifyUser, function (req, res, next) {
        startPage.addProductToTops(req.body.product_id,
            (err, result) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
        });
});

startPageRouter.route('/tops/:product_id')
// Delete product from tops
    .delete(Verify.verifyUser, function (req, res, next) {
        startPage.removeProductFromTops(req.params.product_id,
            (err, result) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
        });
});

startPageRouter.route('/marketing-message')
// Get start page's marketing message
    .get(Verify.verifyUser, function (req, res, next) {
        StartPageMarketingMessages.findOne({"version": 0})
        .exec(function(err, result){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result) {
                console.log(result);
                res.json(result);
            } else {
                // Create new list
                StartPageMarketingMessages.create({"version": 0}, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    console.log(result);
                    res.json(result);
                });
            }
        });
    })
    .put(Verify.verifyUser, function (req, res, next) {
        StartPageMarketingMessages.findOneAndUpdate({"version": 0}, 
        req.body,
        { new: true }, 
        function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });

module.exports = startPageRouter;