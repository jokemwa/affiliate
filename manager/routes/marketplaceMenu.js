var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var marketplaceMenuItems = require('../models/marketplaceMenuItems');

var marketplaceMenuRouter = express.Router();
marketplaceMenuRouter.use(bodyParser.json());

marketplaceMenuRouter.route('/')
    .get(function (req, res, next) {
        marketplaceMenuItems.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
        marketplaceMenuItems.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

marketplaceMenuRouter.route('/:id')
    .get(function (req, res, next) {
        marketplaceMenuItems.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        marketplaceMenuItems.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        marketplaceMenuItems.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = marketplaceMenuRouter;