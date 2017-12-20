var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var NewsletterSubscribers = require('../models/newsletterSubscribers');

var newsletterSubscribersRouter = express.Router();
newsletterSubscribersRouter.use(bodyParser.json());

newsletterSubscribersRouter.route('/')
    .get(Verify.verifyUser, function (req, res, next) {
        NewsletterSubscribers.find({}, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});

newsletterSubscribersRouter.route('/:id')
    .delete(Verify.verifyUser, function (req, res, next) {
        NewsletterSubscribers.findByIdAndRemove(req.params.id, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});

module.exports = newsletterSubscribersRouter;