var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var config = require('../../config');

var deleteImage = function(bucket, file) {
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
            promises.push(deleteImage(bucket, element.hiRes));
            promises.push(deleteImage(bucket, element.thumb));
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