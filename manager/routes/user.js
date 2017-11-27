var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

router.post('/login', function (req, res, next) {
    User.find({}, (err, result) => {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        if (result.length != 0) {
            passport.authenticate('local', function (err, user, info) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                if (!user) {
                    let err = new Error(info);
                    console.log(info);
                    err.status = 401;
                    return next(err);
                }
                req.logIn(user, function (err) {
                        if(err){
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        }
        
                    var token = Verify.getToken(user);
                    res.status(200).json({
                        status: 'Login successful!',
                        success: true,
                        token: token
                    });
                });
            })(req, res, next);
        } else {
            User.register(new User({ username: 'admin' }),
            'qqq', function (err, user) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                passport.authenticate('local', function (err, user, info) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    if (!user) {
                        let err = new Error(info);
                        console.log(info);
                        err.status = 401;
                        return next(err);
                    }
                    req.logIn(user, function (err) {
                            if(err){
                                console.log(err);
                                err.status = 500;
                                return next(err);
                            }
            
                        var token = Verify.getToken(user);
                        res.status(200).json({
                            status: 'Login successful!',
                            success: true,
                            token: token
                        });
                    });
                })(req, res, next);
            });
        }
    });
});

router.post('/changepassword', function (req, res, next) {

    User.findByUsername('admin')
    .then(function(user){
        if (user){
            user.changePassword(req.body.old, req.body.new, function(err){
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log('ok');
                res.json({message: 'Password changed'});
                
            });
        } else {
            let err = new Error('This user does not exist');
            err.status = 500;
            return next(err);
        }
    })
});
    

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;