var express = require('express');
var mongoose = require('mongoose');
var Verify = require('./verify');

var ClientDevices = require('../models/clientDevices');
var ClientSessions = require('../models/clientSessions');
var clientActions = require('../models/clientActions');


var trackingRouter = express.Router();

trackingRouter.route('/sessions')
// Get sessions list
.get(Verify.verifyUser, function (req, res, next) {
    ClientSessions.find({})
    .exec(function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});


trackingRouter.route('/sessions/:id')
// Get session details
    .get(Verify.verifyUser, function (req, res, next) {
        ClientSessions.findById(req.params.id)
        .populate('events')
        .exec((err, result) => {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
});

trackingRouter.route('/devices')
// Get devices list
.get(Verify.verifyUser, function (req, res, next) {
    ClientDevices.find({})
    .exec(function (err, result) {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});


trackingRouter.route('/devices/:id')
// Get device details
    .get(Verify.verifyUser, function (req, res, next) {
        ClientDevices.findById(req.params.id)
        .populate('sessions')
        .exec((err, result) => {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
});


module.exports = trackingRouter;