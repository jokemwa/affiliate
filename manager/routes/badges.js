var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Verify = require('./verify');

var Badges = require('../models/badges');

var badges = require('./misc/badges');

var badgesRouter = express.Router();
badgesRouter.use(bodyParser.json());

badgesRouter.route('/')
// Get badges list
    .get(Verify.verifyUser, function (req, res, next) {
    Badges.find({}, function (err, results) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        res.json(results);
        });
    })
// Create new badge
    .post(Verify.verifyUser, function (req, res, next) {
    Badges.create(req.body, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        res.json(result);
        });
    });
    
badgesRouter.route('/products')
    // Get badges list with products
        .get(Verify.verifyUser, function (req, res, next) {
        Badges.find({})
        .lean()
        .exec(function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result) {
                var promises = [];
                result.forEach(function(element, i){
                    promises.push(badges.getAllProducts(element._id)
                    .then(function(productsArray){
                        //console.log(productsArray);
                        result[i]['products'] = productsArray;
                    },
                    function(err){
                        return Promise.reject(err);
                    }));
                });
                Promise.all(promises)
                .then(function(){
                    console.log(result);
                    res.json(result);
                },
            function(err){
                console.log(err);
                err.status = 500;
                return next(err);
            });
            } else {
                console.log(result);
                res.json(result);
            }
            
        });
    });

// Get badge data
badgesRouter.route('/:id')
    .get(Verify.verifyUser, function (req, res, next) {
    Badges.findById(req.params.id)
    .lean()
    .exec(function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        if(result){
            badges.getAllProducts(req.params.id)
            .then(function(productsArray){
                result['products'] = productsArray;
                //console.log(productsArray);
                console.log(result);
                res.json(result);
            },
            function(err){
                console.log(err);
                err.status = 500;
                return next(err);
            });
        } else {
            console.log(result);
            res.json(result);
        }
        });
    })
// Update badge
    .put(Verify.verifyUser, function (req, res, next) {
    Badges.findByIdAndUpdate(req.params.id, {
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
// Delete badge
    .delete(Verify.verifyUser, function (req, res, next) {
    Badges.findByIdAndRemove(req.params.id, function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        badges.removeFromProducts(req.params.id, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(result);
        });
        
    });
});


module.exports = badgesRouter;