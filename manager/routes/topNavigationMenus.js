var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var TopNavigationBrandLists = require('../models/topNavigation/topNavigationBrandLists');

var topNavigationMenus = require('./misc/topNavigationMenus');

var topNavigationMenusRouter = express.Router();
topNavigationMenusRouter.use(bodyParser.json());


topNavigationMenusRouter.route('/brands-menu')
// Get top navigation brands menu list
    .get(Verify.verifyUser, function (req, res, next) {
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

// Update top navigation brands menu list
    .put(Verify.verifyUser, function (req, res, next) {
        TopNavigationBrandLists.findOneAndUpdate({"version": 0},
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

topNavigationMenusRouter.route('/brands-menu/add')
// Add brand to menu
    .post(Verify.verifyUser, function (req, res, next) {
        topNavigationMenus.addBrandToMenu(req.body.brand_id,
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

topNavigationMenusRouter.route('/brands-menu/:brand_id')
// Remove brand from menu
    .delete(Verify.verifyUser, function (req, res, next) {
        topNavigationMenus.removeBrandFromMenu(req.params.brand_id,
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

module.exports = topNavigationMenusRouter;