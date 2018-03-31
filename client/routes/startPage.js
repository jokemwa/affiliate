var express = require('express');
var mongoose = require('mongoose');

var StartPageCategoriesLists = require('../models/startPage/startPageCategoriesLists');
var StartPageCategories = require('../models/startPage/startPageCategories');
var StartPageTops = require('../models/startPage/startPageTops');
var Badges = require('../models/badges');
var Marketplaces = require('../models/marketplaces');
var StartPageMarketingMessages = require('../models/startPage/startPageMarketingMessages');

var products = require('./misc/products');
var Verify = require('./verify');

var startPageRouter = express.Router();

startPageRouter.route('/categories-list')
// Get start page's categories list
    .get(Verify.verifyClient, function (req, res, next) {
        StartPageCategoriesLists.findOne({"version": 0})
        .populate({
            path:     'items.category',			
            populate: { path:  'category'}
          })
        .populate({
            path:     'items.category',			
            populate: { path:  'items.product',
                        populate: { path:  'badges' }
                    }
          })
        .populate({
            path:     'items.category',			
            populate: { path:  'items.product',
                        populate: { path:  'marketplace' }
                    }
          })
        .exec(function(err, result){
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
        .get(Verify.verifyClient, function (req, res, next) {
            StartPageTops.findOne({"version": 0})
            .populate("items.product")
            .populate({
                path:     'items.product',			
                populate: { path:  'badges' } 
              })
            .lean()
            .populate({
                path:  'items.product',
                populate: { path:  'marketplace' }
              })
            .exec(function(err, result){
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                if (result) {
                    let promises = [];
                    
                    result.items.forEach(element => {
                        promises.push(products.getProductTags(element.product._id)
                        .then(
                        (tags) => {
                            element.product.tags = tags;
                        },
                        (err) => {
                            return Promise.reject(err);
                        }));
                    });

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

startPageRouter.route('/marketing-message')
// Get start page's top products list
    .get(Verify.verifyClient, function (req, res, next) {
        StartPageMarketingMessages.findOne({"version": 0})
        .exec(function(err, result){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            //console.log(result);
            res.json(result);
        });
});

module.exports = startPageRouter;