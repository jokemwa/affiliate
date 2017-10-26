var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var startPageCategories = require('../models/startPage/startPageCategories');
var startPageTops = require('../models/startPage/startPageTops');

var startPageRouter = express.Router();
startPageRouter.use(bodyParser.urlencoded({extended: true}));


startPageRouter.route('/categories')
    .get(function (req, res, next) {
        startPageCategories.find({})
        .populate("product")
        .exec(function(err, results){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

    .post(function (req, res, next) {
        startPageCategories.create(req.body, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
        res.json(result);
        });
        
    });

startPageRouter.route('/categories/:id')
    .get(function (req, res, next) {
        Categories.findById(req.params.id)
        .populate('product')
        .exec(function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            res.json(result);
        });
    })

    .post(function (req, res, next) {
        startPageCategories.findById(req.params.id, 'items')
        .sort('order')
        .exec(function (err, items) {
            let item = {
                "product": req.body.product_id,
                "order": (items[items.length-1].order + 1)
            }
            startPageCategories.findByIdAndUpdate(req.params.id,
                {
                $push: { "items": item }
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
    })

    .delete(function (req, res, next) {
        startPageCategories.findByIdAndUpdate(req.params.id, {
            $pull: { "items": { "product": req.body.product_id } }
        }, {
            new: true
        }, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            startPageCategories.findById(req.params.id, 'items')
            .sort('order')
            .exec(function (err, items) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                for(let i = 0; i < items.length; i++){
                    items.order = i;
                }
                startPageCategories.findByIdAndUpdate(req.params.id,
                    {
                        $set: { "items": items }
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
                });
        });
    })

    .put(function (req, res, next) {
        startPageCategories.findByIdAndUpdate(req.params.id, {
            $set: { "items": req.body }
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

startPageRouter.route('/tops')
    .get(function (req, res, next) {
        startPageTops.find({'ref': req.body.ref}, 'items', function(err, items){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(items);
            res.json(items);
        });
    })

    .post(function (req, res, next) {
        startPageTops.create(req.body, function(err, results){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

    .delete(function (req, res, next) {
        startPageTops.remove({'ref': req.body.ref}, function(err, results){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

    .put(function (req, res, next) {
        startPageTops.update({'ref': req.body.ref},
        {
            $set: { "items": req.body.items }
        }, {
            new: true
        },
        function(err, results){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

startPageRouter.route('/tops/:id')
    .post(function (req, res, next) {
        startPageTops.find({'ref': req.body.ref}, 'items')
        .sort('order')
        .exec(function(err, items){
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            let item = {
                "product": req.body.product_id,
                "order": (items[items.length-1].order + 1)
            }
            startPageTops.update({'ref': req.body.ref},
                {
                $push: { "items": item }
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
        });
    })
    .delete(function (req, res, next) {
        startPageTops.update({'ref': req.body.ref},
        {
        $pull: { "items": {"product": req.body.product} }
        }, {
        new: true
        }, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            startPageTops.find({'ref': req.body.ref}, 'items')
            .sort('order')
            .exec(function (err, items) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                for(let i = 0; i < items.length; i++){
                    items.order = i;
                }
                startPageTops.update({'ref': req.body.ref},
                    {
                        $set: { "items": items }
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
                });
        });
    });


module.exports = startPageRouter;