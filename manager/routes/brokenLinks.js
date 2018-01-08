var express = require('express');
var mongoose = require('mongoose');
var Verify = require('./verify');

var BrokenLinks = require('../models/brokenLinks');

var brokenLinksRouter = express.Router();

brokenLinksRouter.route('/')
    .get(Verify.verifyUser, function (req, res, next) {
        BrokenLinks.find({})
        .populate('product')
        .exec((err, result) => {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});

brokenLinksRouter.route('/:id')
    .delete(Verify.verifyUser, function (req, res, next) {
        BrokenLinks.findByIdAndRemove(req.params.id, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});

module.exports = brokenLinksRouter;