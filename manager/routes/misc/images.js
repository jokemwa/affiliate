var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var config = require('../../config');

var deleteGridFSFile = function(bucket, file) {
    return new Promise(function(resolve, reject){
        bucket.delete(new ObjectId(file), function(err) {
            if(err){
                reject(err);
            }
            resolve('Deleted');
        });
    });
}

exports.deleteProductImages = function (images, callback) {
    mongodb.MongoClient.connect(config.mongoUrl, function(err, db) {
        if(err){
            callback(err, null);
            return;
        }
        var bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'images'
        });
        var promises = [];
        images.forEach(function(element){
            promises.push(deleteGridFSFile(bucket, element.hiRes));
            promises.push(deleteGridFSFile(bucket, element.thumb));
        });
        Promise.all(promises)
            .then(
                function(){
                    callback(null, 'ok');
                    return;
                },
                function(err){
                    callback(err, null);
                    return;
                }
            );
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