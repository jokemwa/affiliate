var express = require('express');
var mongoose = require('mongoose');

var Brands = require('../models/brands');

var products = require('./misc/products');

var Verify = require('./verify');

var brandsRouter = express.Router();

brandsRouter.route('/')
// List of categories
    .get(Verify.verifyClient, function (req, res, next) {
        Brands.find({}, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            //console.log(result);
            res.json(result);
        });
});


brandsRouter.route('/:id')
// Get products of brand
    .get(Verify.verifyClient, function (req, res, next) {
        Brands.findById(req.params.id)
        .populate('items.product')
        .populate({
            path:     'items.product',			
            populate: { path:  'badges'}
          })
        .lean()
        .exec(function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if(result){
                let promises = [];
                result.items.forEach(element => {
                    promises.push(products.getProductTags(element.product._id)
                    .then(
                    (tags) => {
                        element.product.tags = tags;
                    },
                    (err) => {
                        return Promise.reject(err);
                    }));
                });
    
                Promise.all(promises)
                .then(() => {
                    //console.log(result);
                    res.json(result);
                },
                (err) => {
                    console.log(err);
                    err.status = 500;
                    return next(err);
                });
            } else {
                //console.log(result);
                res.json(result);
            }
        });
    });



module.exports = brandsRouter;