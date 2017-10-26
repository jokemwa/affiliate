var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Marketplaces = require('../models/marketplaces');

var marketplacesRouter = express.Router();
marketplacesRouter.use(bodyParser.json());

marketplacesRouter.route('/')
    .get(function (req, res, next) {
        Marketplaces.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
        Marketplaces.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

marketplacesRouter.route('/:id')
    .get(function (req, res, next) {
        Marketplaces.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        Marketplaces.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        Marketplaces.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = marketplacesRouter;