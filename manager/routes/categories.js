var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Categories = require('../models/categories');

var categories = require('./misc/categories');

var categoriesRouter = express.Router();
categoriesRouter.use(bodyParser.json());

categoriesRouter.route('/')
// List of categories
    .get(Verify.verifyUser, function (req, res, next) {
        Categories.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

// New category {name: name}
    .post(Verify.verifyUser, function (req, res, next) {
        console.log(req.body);
        Categories.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });

// Change product's category
categoriesRouter.route('/change')
.put(Verify.verifyUser, function (req, res, next) {
    categories.removeFromCategories(req.body.product, function(err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        categories.addToCategory(req.body.product, req.body.newCategory, function(err, result) {
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

categoriesRouter.route('/:id')
// Get products list of category {product, order}
    .get(Verify.verifyUser, function (req, res, next) {
        Categories.findById(req.params.id)
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

// Update category
    .put(Verify.verifyUser, function (req, res, next) {
        Categories.findByIdAndUpdate(req.params.id,
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

// Delete category
    .delete(Verify.verifyUser, function (req, res, next) {
        Categories.findById(req.params.id, 'items', function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result.items.length == 0) {
                Categories.findByIdAndRemove(req.params.id, function (err, response) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    console.log(response);
                    res.json(response);
                });
            } else {
                let err = new Error ('Category is not empty.');
                console.log(err);
                err.status = 500;
                return next(err);
            }
        });
    })

// Add product to category
    .post(Verify.verifyUser, function (req, res, next) {
        categories.addToCategory(req.body.product_id, req.params.id,
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

// Delete product from category
categoriesRouter.route('/:id/:product_id')
    .delete(Verify.verifyUser, function (req, res, next) {
        categories.removeFromCategories(req.params.product_id, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });



module.exports = categoriesRouter;