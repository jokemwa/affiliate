var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Tags = require('../models/tags');

var tags = require('./misc/tags');

var tagsRouter = express.Router();
tagsRouter.use(bodyParser.json());

tagsRouter.route('/')
// Get all tags
    .get(function (req, res, next) {
        Tags.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
        res.json(results);
    });
    })
// Create new tag
    .post(function (req, res, next) {
        Tags.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
        res.json(result);
        });
    });

tagsRouter.route('/:id')
// Get products by tag
    .get(function (req, res, next) {
        Tags.findById(req.params.id)
        .populate('items.product')
        .exec(function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(result);
        });
    })
// Update tag
    .put(function (req, res, next) {
        Tags.findByIdAndUpdate(req.params.id,
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
// Delete tag
    .delete(function (req, res, next) {
        Tags.findByIdAndRemove(req.params.id, function (err, response) {
            if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(response);
                res.json(response);
        })
    })
// Add product to tag
    .post(function (req, res, next) {
        tags.addToTag(req.body.product_id, req.params.id,
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

// Delete product from tags
tagsRouter.route('/:id/:product_id')
.delete(function (req, res, next) {
    tags.removeFromTags(req.params.product_id, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});




module.exports = tagsRouter;