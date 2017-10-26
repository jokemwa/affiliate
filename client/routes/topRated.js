var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var topRatedItems = require('../models/topRatedItems');

var topRatedRouter = express.Router();
topRatedRouter.use(bodyParser.urlencoded({extended: true}));


topRatedRouter.route('/')
    .get(function (req, res, next) {
        topRatedItems.find({})
        .populate("product")
        .exec(function(err, results){
            if (err) {
                var error = new Error(err);
                err.status = 500;
                return next(err);
            }
            console.log(results);
            res.json(results);
        });
    })

    .post(function (req, res, next) {
        mongoose.connection.db.dropCollection('toprateditems').then(function(){
        for(let i=0; i < req.body.length; i++){
            topRatedItems.create(req.body[i], function (err, result) {
                if (err) {
                    let error = new Error(err);
                    err.status = 500;
                    return next(err);
                }
                if(i == (req.body.length-1)){ res.json({status:'ok'})}
                });
        }
    });
        
    });

module.exports = topRatedRouter;