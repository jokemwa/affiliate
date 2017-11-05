var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var ShopGroups = require('../models/shopGroups');

var shopGroups = require('./misc/shopGroups');


var shopGroupsRouter = express.Router();
shopGroupsRouter.use(bodyParser.json());

shopGroupsRouter.route('/')
// List of shop groups
    .get(Verify.verifyUser, function (req, res, next) {
        ShopGroups.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

// New shop group {name: name}
    .post(Verify.verifyUser, function (req, res, next) {
        ShopGroups.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });

shopGroupsRouter.route('/shop')
// Update shop's shop groups
    .put(Verify.verifyUser, function (req, res, next) {
        shopGroups.removeShopFromShopGroups(req.body.shop_id)
        .then(() => {
            let promises = [];
            req.body.shopGroups.forEach((element, i) => {
                promises.push(shopGroups.addToShopGroup(element._id, req.body.shop_id));
            });
            Promise.all(promises)
            .then((result) => {
                console.log(result);
                res.json(result);
            },
            (err) => {
                console.log(err);
                err.status = 500;
                return next(err);
            });
        },
        (err => {
            console.log(err);
            err.status = 500;
            return next(err);
        })
        );
    });

shopGroupsRouter.route('/shop/:id')
// Get shop's shop groups
    .get(Verify.verifyUser, function (req, res, next) {
        ShopGroups.find({ "items": {$elemMatch: {"shop": req.params.id} } },
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

shopGroupsRouter.route('/:id')
// Get shops list of shop group
        .get(Verify.verifyUser, function (req, res, next) {
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
        })
    
// Update shop group
        .put(Verify.verifyUser, function (req, res, next) {
            ShopGroups.findByIdAndUpdate(req.params.id,
                { $set: req.body },
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
        })

// Delete shop group
        .delete(Verify.verifyUser, function (req, res, next) {
            ShopGroups.findByIdAndRemove(req.params.id,
                function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    console.log(result);
                    res.json(result);
                });
        })

// Add shop from shop group
        .post(Verify.verifyUser, function (req, res, next) {
            shopGroups.addToShopGroup(req.params.id, req.body.shop_id)
            .then((result) => {
                console.log(result);
                res.json(result);
            },
            (err) => {
                console.log(err);
                err.status = 500;
                return next(err);
            });
        });

// Delete shop from shop group
shopGroupsRouter.route('/:id/:shop_id')
        .delete(Verify.verifyUser, function (req, res, next) {
            shopGroups.removeFromShopGroup(req.params.id, req.params.shop_id)
            .then(
                (result) => {
                    console.log(result);
                    res.json(result);
                },
                (err) => {
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
            );
    });
    

module.exports = shopGroupsRouter;