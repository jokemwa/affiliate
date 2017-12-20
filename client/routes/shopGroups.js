var express = require('express');
var mongoose = require('mongoose');

var ShopGroups = require('../models/shopGroups');


var shopGroupsRouter = express.Router();

shopGroupsRouter.route('/')
// List of shop groups
    .get(function (req, res, next) {
        ShopGroups.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    });


shopGroupsRouter.route('/:id')
// Get shops list of shop group
        .get(function (req, res, next) {
            ShopGroups.findById(req.params.id)
            .populate('items.shop')
            .exec(function (err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
            });
        });    

module.exports = shopGroupsRouter;