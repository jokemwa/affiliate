var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Verify = require('./verify');

var Brands = require('../models/brands');

var brands = require('./misc/brands');

var brandsRouter = express.Router();
brandsRouter.use(bodyParser.json());

brandsRouter.route('/')
// Get all brands
    .get(Verify.verifyUser, function (req, res, next) {
        Brands.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
    });
})
// Create new brand
    .post(Verify.verifyUser, function (req, res, next) {
        Brands.create(req.body, function (err, result) {
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
brandsRouter.route('/change')
.put(Verify.verifyUser, function (req, res, next) {
    brands.removeFromBrands(req.body.product, function(err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        brands.addToBrand(req.body.product, req.body.new, function(err, result) {
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

brandsRouter.route('/:id')
// Get products of brand
    .get(Verify.verifyUser, function (req, res, next) {
        Brands.findById(req.params.id)
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
// Update brand
    .put(Verify.verifyUser, function (req, res, next) {
        Brands.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                res.json(result);
            });
    })
// Delete brand
    .delete(Verify.verifyUser, function (req, res, next) {
        Brands.findById(req.params.id, 'items', function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result.items.length == 0) {
                Brands.findByIdAndRemove(req.params.id, function (err, response) {
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

// Add product to brand
    .post(Verify.verifyUser, function (req, res, next) {
        console.log(req.body.product_id, req.params.id);
        brands.addToBrand(req.body.product_id, req.params.id,
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
brandsRouter.route('/:id/:product_id')
    .delete(Verify.verifyUser, function (req, res, next) {
        brands.removeFromBrands(req.params.product_id, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });



module.exports = brandsRouter;