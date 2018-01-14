var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;


var config = require('../config');

var imagesRouter = express.Router();



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
            return next(err);
        });
        output.on("end", () => {
            db.close();
        });

        output.pipe(res);
        });

});

module.exports = imagesRouter;