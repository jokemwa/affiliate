var express = require('express');
var multiparty = require('multiparty');
var mongodb = require('mongodb');
var fs = require('fs');

var config = require('../../config');

var Verify = require('./verify');


var fileRouter = express.Router();

fileRouter.route('/')
// Upload file
    .post(Verify.verifyUser, function (req, res, next) {
        var form = new multiparty.Form();
        var tmpFile = './tmp/' + Math.random();
 
        form.on('error', function(err){
            fs.exists(tmpFile, function(exists){
                if (exists) {
                    fs.unlink(tmpFile);
                }
            });
            console.log(err);
            err.status = 500;
            return next(err);
        });
        
        form.on('part', function(part) {

            part.pipe(fs.createWriteStream(tmpFile))
            .on("error", function(err){
                fs.exists(tmpFile, function(exists){
                    if (exists) {
                        fs.unlink(tmpFile);
                    }
                });
                console.log(err);
                err.status = 500;
                return next(err);
            })
            .once("close", function(){
                mongodb.MongoClient.connect(config.mongoUrl, function(err, db) {
                    if(err){
                        fs.exists(tmpFile, function(exists){
                            if (exists) {
                                fs.unlink(tmpFile);
                            }
                        });
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }                
                    var bucket = new mongodb.GridFSBucket(db, {
                        bucketName: 'images'
                    });
                    var input = bucket.openUploadStream();
                    var file = fs.createReadStream(tmpFile);
                    file.on("error", function(err){
                        fs.exists(tmpFile, function(exists){
                            if (exists) {
                                fs.unlink(tmpFile);
                            }
                        });
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    })
                    file.pipe(input)
                    .on("error", function(err){
                        fs.exists(tmpFile, function(exists){
                            if (exists) {
                                fs.unlink(tmpFile);
                            }
                        });
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    })
                    .once("finish", function(){
                        console.log(input.id);
                        fs.unlink(tmpFile, function(err){
                            console.log(err);
                        });
                        db.close();
                        res.json({'_id': input.id});
                    });
                });

            });
  
        });
        
        form.parse(req);
});


module.exports = fileRouter;