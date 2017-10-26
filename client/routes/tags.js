var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Tags = require('../models/tags');

var tagsRouter = express.Router();
tagsRouter.use(bodyParser.json());

tagsRouter.route('/')
    .get(function (req, res, next) {
        Tags.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
        Tags.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

tagsRouter.route('/:id')
    .get(function (req, res, next) {
        Tags.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        Tags.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        Tags.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = tagsRouter;