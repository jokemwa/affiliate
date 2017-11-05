var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Marketplaces = require('../models/marketplaces');
var Shops = require('../models/shops');

var marketplaces = require('./misc/marketplaces');
var shopGroups = require('./misc/shopGroups');
var images = require('./misc/images');

var marketplacesRouter = express.Router();
marketplacesRouter.use(bodyParser.json());

marketplacesRouter.route('/')
// Get all marketplaces
    .get(Verify.verifyUser, function (req, res, next) {
        Marketplaces.find({})
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
// Create new marketplace
    .post(Verify.verifyUser, function (req, res, next) {
        Marketplaces.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(result);
        });
})

marketplacesRouter.route('/products')
// Get all marketplaces with products
.get(Verify.verifyUser, function (req, res, next) {
    Marketplaces.find({})
    .lean()
    .exec(function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        if (result) {
            var promises = [];
            result.forEach(function(element, i){
                promises.push(marketplaces.getAllProducts(element._id)
                .then(function(productsArray){
                    result[i]['products'] = productsArray;
                },
                function(err){
                    return Promise.reject(err);
                }));
            });
            Promise.all(promises)
            .then(function(){
                console.log(result);
                res.json(result);
            },
        function(err){
            console.log(err);
            err.status = 500;
            return next(err);
        });
        } else {
            console.log(result);
            res.json(result);
        }
    });
});



marketplacesRouter.route('/:id/shops')
// Get marketplace with shops
    .get(Verify.verifyUser, function (req, res, next) {
        Marketplaces.findById(req.params.id)
        .populate('shops')
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

// Add shop to marketplace
    .post(Verify.verifyUser, function (req, res, next) {
            Marketplaces.findByIdAndUpdate(req.params.id,  {
                $push: {"shops": req.body.shop_id}
            }, {
                    new: true
                }, function (err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
            });
    });

marketplacesRouter.route('/:id/products')
// Get marketplace with products
    .get(Verify.verifyUser, function (req, res, next) {
        Marketplaces.findById(req.params.id)
        .lean()
        .exec(function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            marketplaces.getAllProducts(req.params.id)
            .then((productsArray) => {
                    result['products'] = productsArray;
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
    });
    
marketplacesRouter.route('/:id')
    // Get marketplace
        .get(Verify.verifyUser, function (req, res, next) {
            Marketplaces.findById(req.params.id, function (err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                res.json(result);
            });
        })
    // Update marketplace
        .put(Verify.verifyUser, function (req, res, next) {
            Marketplaces.findById(req.params.id, function(err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                if(result.logo != req.body.logo && result.logo != '') {
                    images.deleteFile(result.logo, function(err, result_file) {
                        if(err){
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        }
                        console.log(result.logo, ' ', result_file);
                        Marketplaces.findByIdAndUpdate(req.params.id, {
                            $set: req.body
                        }, {
                                new: true
                            }, function (err, result) {
                                if(err){
                                    console.log(err);
                                    err.status = 500;
                                    return next(err);
                                }
                                console.log(result);
                                res.json(result);
                        });
                    });
                } else {
                    Marketplaces.findByIdAndUpdate(req.params.id, {
                        $set: req.body
                    }, {
                            new: true
                        }, function (err, result) {
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
    
    // Delete marketplace
        .delete(Verify.verifyUser, function (req, res, next) {
            marketplaces.getAllProducts(req.params.id)
            .then((productsArray) => {
                    if (productsArray.length == 0) {
                        Marketplaces.findById(req.params.id, function (err, result) {
                            if(err){
                                console.log(err);
                                err.status = 500;
                                return next(err);
                            }
                            var promises = [];
                            result.shops.forEach((element, i) => {
                                promises.push(Shops.findByIdAndRemove(result.shops[i]));
                                promises.push(shopGroups.removeShopFromShopGroups(result.shops[i]));
                            });
                            Promise.all(promises)
                            .then(
                                () => {
                                    if (result.logo != '') {
                                        images.deleteFile(result.logo, function(err, result){
                                            if(err){
                                                console.log(err);
                                                err.status = 500;
                                                return next(err);
                                            }
                                            console.log('Logo ' + result);
                                            Marketplaces.findByIdAndRemove(req.params.id, function (err, result) {
                                                if(err){
                                                    console.log(err);
                                                    err.status = 500;
                                                    return next(err);
                                                }
                                                console.log(result);
                                                res.json(result);
                                            });
                                        });
                                    } else {
                                        Marketplaces.findByIdAndRemove(req.params.id, function (err, result) {
                                            if(err){
                                                console.log(err);
                                                err.status = 500;
                                                return next(err);
                                            }
                                            console.log(result);
                                            res.json(result);
                                        });
                                    }
                                },
                                (err) => {
                                    console.log(err);
                                    err.status = 500;
                                    return next(err);
                                }
                            );
                        });
                    } else {
                        let err = new Error ('Marketplace has products.');
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
            },
            (err) => {
                console.log(err);
                err.status = 500;
                return next(err);
                }
            );
        });    

module.exports = marketplacesRouter;