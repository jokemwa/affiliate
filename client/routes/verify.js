var mongoose = require('mongoose');

var clientDevices = require('../models/clientDevices');
var clientSessions = require('../models/clientSessions');

exports.verifyClient = function (req, res, next) {
    var deviceId = req.headers['x-device-id'];
    var sessionId = req.headers['x-session-id'];
    console.log(req.headers);

    if (deviceId && sessionId) {
        clientDevices.findById(deviceId, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            if (result != null) {
                clientSessions.findById(sessionId, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    if (result != null) {
                        // It's our client
                        next();
                    } else {
                        var err = new Error('Access to API is restricted. Use official client.');
                        err.status = 403;
                        return next(err);
                    }
                });
            } else {
                var err = new Error('Access to API is restricted. Use official client.');
                err.status = 403;
                return next(err);
            }
        });
    } else {
        var err = new Error('Access to API is restricted. Use official client.');
        err.status = 403;
        return next(err);
    }
};