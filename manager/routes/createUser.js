var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

router.post('/', function (req, res) {
    User.register(new User({ username: req.body.username }),
        req.body.password, function (err, user) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            passport.authenticate('local')(req, res, function () {
                return res.json({ status: 'Registration Successful!' });
            });
        });
});

module.exports = router;