var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var clientRouter = express.Router();
clientRouter.use(bodyParser.json());

var clientDevices = require('../models/clientDevices');
var clientSessions = require('../models/clientSessions');
var clientActions = require('../models/clientActions');

var Verify = require('./verify');

clientRouter.route('/')
// Open new session
    .post(function (req, res, next) {
        const client = {
            deviceId: '',
            sessionId: ''
        };
        if (req.body.deviceId == '') {
            //New client
            clientDevices.create({}, (err, result) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                client.deviceId = result._id;
                clientSessions.create({}, (err, result) => {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    client.sessionId =  result._id;
                    clientDevices.findByIdAndUpdate(client.deviceId,
                        {$push: {'sessions': client.sessionId}},
                        (err, result) => {
                            if(err){
                                console.log(err);
                                err.status = 500;
                                return next(err);
                            }
                            console.log('NEW CLIENT');
                            console.log(client);
                            res.json(client);
                        });
                });
            });
        } else {
            clientDevices.findById(req.body.deviceId, (err, result) => {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                if (result != null) {
                    // Existed client
                    client.deviceId = result._id;
                    clientSessions.create({}, (err, result) => {
                        if(err){
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        }
                        client.sessionId =  result._id;
                        clientDevices.findByIdAndUpdate(client.deviceId,
                            {$push: {'sessions': client.sessionId}},
                            (err, result) => {
                                if(err){
                                    console.log(err);
                                    err.status = 500;
                                    return next(err);
                                }
                                console.log('NEW SESSION');
                                console.log(client);
                                res.json(client);
                            });
                    });
                } else {
                    // Wrond deviceId, create new
                    clientDevices.create({}, (err, result) => {
                        if(err){
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        }
                        client.deviceId = result._id;
                        clientSessions.create({}, (err, result) => {
                            if(err){
                                console.log(err);
                                err.status = 500;
                                return next(err);
                            }
                            client.sessionId =  result._id;
                            clientDevices.findByIdAndUpdate(client.deviceId,
                                {$push: {'sessions': client.sessionId}},
                                (err, result) => {
                                    if(err){
                                        console.log(err);
                                        err.status = 500;
                                        return next(err);
                                    }
                                    console.log('WRONG DEV ID, CREATE NEW');
                                    console.log(client);
                                    res.json(client);
                                });
                        });
                    });
                }
            });
        }
});

clientRouter.route('/action')
    .post(Verify.verifyClient, function (req, res, next) {
        const sessionId = req.headers['x-session-id'];
        clientActions.create(req.body, (err, result) => {
            if(err){
                console.log(err);
                res.json(null);
            }
            if (result) {
                let eventId = result._id;
                console.log(result);
                clientSessions.findByIdAndUpdate(sessionId,
                    {$push: {'events': eventId}},
                    {'new': true},
                    (err, result) => {
                        if(err){
                            console.log(err);
                            res.json(null);
                        }
                        if (result) {
                            //console.log(result);
                            res.json(null);
                        }
                    });
            }
        });
});

module.exports = clientRouter;