var express = require('express');
var mongoose = require('mongoose');

var TopNavigationBrandLists = require('../models/topNavigation/topNavigationBrandLists');

var topNavigationMenusRouter = express.Router();


topNavigationMenusRouter.route('/brands-menu')
// Get top navigation brands menu list
    .get(function (req, res, next) {
        TopNavigationBrandLists.findOne({"version": 0})
        .populate({
            path:     'items.brand',			
            populate: { path:  'brand'}
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
                TopNavigationBrandLists.create({"version": 0}, function (err, result) {
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

module.exports = topNavigationMenusRouter;