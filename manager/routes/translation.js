var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Translations = require('../models/translations');

var translationsRouter = express.Router();
translationsRouter.use(bodyParser.json());

translationsRouter.route('/')
    .get(Verify.verifyUser, function (req, res, next) {
        Translations.findOne({lang: 'hebrew'}, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        if(result){
            console.log(result);
            res.json(result);
        } else {
            Translations.create({lang: 'hebrew'}, function (err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
                });
        }
        });
    })

    .put(Verify.verifyUser, function (req, res, next) {
        Translations.findOneAndUpdate({lang: 'hebrew'}, {
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

module.exports = translationsRouter;