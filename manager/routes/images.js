var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var config = require('../config');

var images = require('./misc/images');

var Verify = require('./verify');

var imagesRouter = express.Router();
imagesRouter.use(bodyParser.json());


imagesRouter.route('/:id')
    .get(function (req, res, next) {

        mongodb.MongoClient.connect(config.mongoUrl, function(error, db) {

            var bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'images'
              });
            //console.log(req.params.id);
            var output = bucket.openDownloadStream(new ObjectId(req.params.id));

            output.on("error", function(err){
                console.log(err);
                res.status(500);
                var error = new Error(err);
                return next(error);
            });


            output.pipe(res);
            });

    })
// Delete image
    .delete(Verify.verifyUser, function (req, res, next) {
        images.deleteFile(req.params.id, function(err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(req.params.id, ' ', result);
            res.json(result);
    });
});

module.exports = imagesRouter;