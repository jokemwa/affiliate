var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Brands = require('../models/brands');

var brandsRouter = express.Router();
brandsRouter.use(bodyParser.json());

brandsRouter.route('/')
    .get(function (req, res, next) {
        Brands.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
        Brands.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

brandsRouter.route('/:id')
    .get(function (req, res, next) {
        Brands.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        Brands.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        Brands.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = brandsRouter;