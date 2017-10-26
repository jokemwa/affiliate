var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Categories = require('../models/categories');

var categoriesRouter = express.Router();
categoriesRouter.use(bodyParser.json());

categoriesRouter.route('/')
    .get(function (req, res, next) {
        Categories.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
        Categories.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

categoriesRouter.route('/:id')
    .get(function (req, res, next) {
        Categories.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        Categories.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        Categories.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = categoriesRouter;