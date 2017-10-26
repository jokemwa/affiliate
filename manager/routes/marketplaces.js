var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Verify = require('./verify');

var Marketplaces = require('../models/marketplaces');
var Shops = require('../models/shops');

var marketplacesRouter = express.Router();
marketplacesRouter.use(bodyParser.json());

marketplacesRouter.route('/')
    .get(function (req, res, next) {
        Marketplaces.find({}, function (err, results) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(results);
    });
})

    .post(function (req, res, next) {
        Marketplaces.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(result);
        });
})

marketplacesRouter.route('/:id')
    .get(function (req, res, next) {
        Marketplaces.findById(req.params.id)
        .populate('shops')
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

    .put(function (req, res, next) {
        Marketplaces.findByIdAndUpdate(req.params.id, {
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

    .delete(function (req, res, next) {
        Marketplaces.findByIdAndRemove(req.params.id, function (err, response) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(response);
        });
    });

    marketplacesRouter.route('/:id/shops')
    .post(function (req, res, next) {
       console.log(req.params.id);
        console.log(req.body);
        Shops.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            var newShopId = result._id;
            Marketplaces.findByIdAndUpdate(req.params.id,  {
                $push: {"shops": newShopId}
            }, {
                    new: true
                }, function (err, result) {
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

module.exports = marketplacesRouter;