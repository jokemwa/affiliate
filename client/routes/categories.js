var express = require('express');
var mongoose = require('mongoose');

var Categories = require('../models/categories');

var categoriesRouter = express.Router();

categoriesRouter.route('/')
// List of categories
    .get(function (req, res, next) {
        Categories.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
});

categoriesRouter.route('/:id')
// Get products list of category {product, order}
    .get(function (req, res, next) {
        Categories.findById(req.params.id)
        .populate('items.product')
        .populate({
            path:     'items.product',			
            populate: { path:  'badges'}
          })
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


module.exports = categoriesRouter;