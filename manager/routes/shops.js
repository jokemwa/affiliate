var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Shops = require('../models/shops');
var Marketplaces = require('../models/marketplaces');

var shops = require('./misc/shops');
var shopGroups = require('./misc/shopGroups');
var images = require('./misc/images');

var shopsRouter = express.Router();
shopsRouter.use(bodyParser.json());

shopsRouter.route('/')
// Add new shop
    .post(Verify.verifyUser, function (req, res, next) {
        Shops.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
})
// Get shops list
.get(Verify.verifyUser, function (req, res, next) {
    Shops.find({})
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

// Change product's shop
shopsRouter.route('/change')
.put(Verify.verifyUser, function (req, res, next) {
    shops.removeFromShops(req.body.product, function(err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        shops.addToShop(req.body.product, req.body.new, function(err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });
});

shopsRouter.route('/:id/marketplace')
// Get shop's marketplace
    .get(Verify.verifyUser, function (req, res, next) {
        Marketplaces.findOne({'shops': req.params.id},
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

shopsRouter.route('/:id')
// Get products list of shop
    .get(Verify.verifyUser, function (req, res, next) {
        Shops.findById(req.params.id)
        .populate('items.product')
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

// Update shop
    .put(Verify.verifyUser, function (req, res, next) {
        Shops.findById(req.params.id, function(err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if(result.logo != req.body.logo && result.logo != '') {
                images.deleteFile(result.logo, function(err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    Shops.findByIdAndUpdate(req.params.id, {
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
                Shops.findByIdAndUpdate(req.params.id, {
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

// Delete shop
    .delete(Verify.verifyUser, function (req, res, next) {
        Shops.findById(req.params.id, 'items', function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result.items.length == 0) {
                Shops.findByIdAndRemove(req.params.id, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    shopGroups.removeShopFromShopGroups(req.params.id)
                    .then((result) => {
                        Marketplaces.findOne({'shops': req.params.id}, function (err, result) {
                            if(err){
                                console.log(err);
                                err.status = 500;
                                return next(err);
                            }
                            if (result.hasShops == false) {
                                Marketplaces.findByIdAndRemove(result._id, function (err, result) {
                                    if(err){
                                        console.log(err);
                                        err.status = 500;
                                        return next(err);
                                    }
                                    console.log(result);
                                    res.json(result);
                                });
                            } else {
                                Marketplaces.findByIdAndUpdate(result._id,
                                    { $pull: { 'shops': req.params.id } },
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
                            }
                        });
                    },
                    (err) => {
                        console.log(err);
                        err.status = 500;
                        return next(err); 
                    }
                    );
                });
            } else {
                let err = new Error ('Shop is not empty.');
                console.log(err);
                err.status = 500;
                return next(err);
            }

        });
    })

// Add product to shop
    .post(Verify.verifyUser, function (req, res, next) {
        shops.addToShop(req.body.product_id, req.params.id,
            function(err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
    });
});

// Delete product from shop
shopsRouter.route('/:id/:product_id')
.delete(Verify.verifyUser, function (req, res, next) {
    shops.removeFromShops(req.params.product_id, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});


module.exports = shopsRouter;