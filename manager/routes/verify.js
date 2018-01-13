var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../_secrets');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 4 * 60 * 60
    });
};

exports.verifyUser = function (req, res, next) {
    var token = req.headers['x-access-token'];
    //console.log(req.headers);
    //console.log(token);
    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};