var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Shops = require('../models/shops');

var shops = require('./misc/shops');

var shopsRouter = express.Router();
shopsRouter.use(bodyParser.json());

shopsRouter.route('/')
// Add new shop
    .post(function (req, res, next) {
        Shops.create(req.body, function (err, result) {
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
.put(function (req, res, next) {
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

shopsRouter.route('/:id')
// Get products list of shop
    .get(function (req, res, next) {
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
    .put(function (req, res, next) {
        Shops.findByIdAndUpdate(req.params.id,
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

// Delete shop
    .delete(function (req, res, next) {
        Shops.findById(req.params.id, 'items', function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result.items.length == 0) {
                Shops.findByIdAndRemove(req.params.id, function (err, response) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    console.log(response);
                    res.json(response);
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
    .post(function (req, res, next) {
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
.delete(function (req, res, next) {
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