var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var NewsletterSubscribers = require('../models/newsletterSubscribers');

var newsletterSubscribersRouter = express.Router();
newsletterSubscribersRouter.use(bodyParser.json());

newsletterSubscribersRouter.route('/')
    .post(Verify.verifyClient, function (req, res, next) {
        NewsletterSubscribers.findOne(req.body,
        function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result) {
                console.log(result);
                res.json({message: 'alreadySubscribed'});
            } else {
                NewsletterSubscribers.create(req.body, (err, result) => {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    //console.log(result);
                    res.json({message: 'success'});
                });
            }
    });
});

module.exports = newsletterSubscribersRouter;