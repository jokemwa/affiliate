var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Badges = require('../models/badges');

var badgesRouter = express.Router();
badgesRouter.use(bodyParser.json());

badgesRouter.route('/')
    .get(function (req, res, next) {
    Badges.find({}, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
})

    .post(function (req, res, next) {
    Badges.create(req.body, function (err, result) {
        if (err) throw err;
        res.json(result);
        });
})

badgesRouter.route('/:id')
    .get(function (req, res, next) {
    Badges.findById(req.params.id, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })

    .put(function (req, res, next) {
    Badges.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
    Badges.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            res.json(response);
        });
    });



module.exports = badgesRouter;