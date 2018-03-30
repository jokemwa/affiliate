var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var config = require('../../../config');


exports.deleteProductImages = function (images, callback) {
    var tasks = [];
    images.forEach(function(element){
        tasks.push(
            (callback) => {exports.deleteFile(element.hiRes, callback)
            }
        );
        tasks.push(
            (callback) => {exports.deleteFile(element.thumb, callback)
            }
        );
    });
    async.parallel(tasks, (err, result) => {
        if(err){
            return callback(err, null);
        }
        callback(null, 'ok');
    });
}


exports.deleteFile = function (file_Id, callback) {
    mongodb.MongoClient.connect(config.mongoUrl, function(err, db) {
        if(err){
            callback(err, null);
            return;
        }
        var bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'images'
        });
        bucket.find(new ObjectId(file_Id)).toArray((err, docs) => {
            if(err){
                callback(err, null);
                return;
            }
            if(docs.length == 0 ) {
                callback(null, 'Not found.');
                return;
            } else {
                bucket.delete(new ObjectId(file_Id), function(err) {
                    if(err){
                        callback(err, null);
                        return;
                    }
                    callback(null, 'Deleted.');
                    return;
                });
            }
        });
    });
}