var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Shops = require('../models/shops');

var shopsRouter = express.Router();
shopsRouter.use(bodyParser.json());

shopsRouter.route('/')
    .get(function (req, res, next) {
        Shops.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
        Shops.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

shopsRouter.route('/:id')
    .get(function (req, res, next) {
        Shops.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        Shops.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        Shops.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = shopsRouter;