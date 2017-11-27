var express = require('express');
var mongoose = require('mongoose');

var StartPageCategoriesLists = require('../models/startPage/startPageCategoriesLists');
var StartPageCategories = require('../models/startPage/startPageCategories');
var StartPageTops = require('../models/startPage/startPageTops');
var Badges = require('../models/badges');

var startPageRouter = express.Router();

startPageRouter.route('/categories-list')
// Get start page's categories list
    .get(function (req, res, next) {
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
        .get(function (req, res, next) {
            StartPageTops.findOne({"version": 0})
            .populate("items.product")
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

module.exports = startPageRouter;