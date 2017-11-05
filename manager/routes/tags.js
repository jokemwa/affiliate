var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Tags = require('../models/tags');

var tags = require('./misc/tags');

var tagsRouter = express.Router();
tagsRouter.use(bodyParser.json());

tagsRouter.route('/')
// Get all tags
    .get(Verify.verifyUser, function (req, res, next) {
        Tags.find({}, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
    });
    })
// Create new tag
    .post(Verify.verifyUser, function (req, res, next) {
        Tags.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    });

tagsRouter.route('/products/:id')
// Delete product from all tags
.delete(Verify.verifyUser, function (req, res, next) {
    tags.removeFromTags(req.params.id, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});


tagsRouter.route('/:id')
// Get products by tag
    .get(Verify.verifyUser, function (req, res, next) {
        Tags.findById(req.params.id)
        .populate('items')
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
// Update tag
    .put(Verify.verifyUser, function (req, res, next) {
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
    .delete(Verify.verifyUser, function (req, res, next) {
        Tags.findByIdAndRemove(req.params.id, function (err, result) {
            if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
        })
    })
// Add product to tag
    .post(Verify.verifyUser, function (req, res, next) {
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


tagsRouter.route('/:id/:product_id')
// Delete product from tag
.delete(Verify.verifyUser, function (req, res, next) {
    tags.removeFromTag(req.params.id, req.params.product_id, function (err, result) {
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