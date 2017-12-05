var express = require('express');
var mongoose = require('mongoose');

var Brands = require('../models/brands');

var brandsRouter = express.Router();

brandsRouter.route('/:id')
// Get products of brand
    .get(function (req, res, next) {
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
    });



module.exports = brandsRouter;