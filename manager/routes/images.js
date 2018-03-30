var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var config = require('../../config');

var images = require('./misc/images');

var Verify = require('./verify');

var imagesRouter = express.Router();
imagesRouter.use(bodyParser.json());


imagesRouter.route('/:id')
    .get(function (req, res, next) {
        let imageId;
        try {
            imageId = new ObjectId(req.params.id);
        } catch (err) {
            console.log(err);
            err.status = 500;
            return next(err);
        }
        mongodb.MongoClient.connect(config.mongoUrl, function(err, db) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            var bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'images'
              });
            var output = bucket.openDownloadStream(imageId);

            output.on("error", function(err){
                console.log(err);
                res.status(500);
                var error = new Error(err);
                return next(error);
            });
            output.on("end", () => {
                db.close();
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