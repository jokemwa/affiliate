var request = require('request');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var fs = require('fs');

var config = require('../../config');

var Products = require('../../models/products');

exports.cutLink = function (link){
    
        let domain = link.substring((link.indexOf('//')+2));
        domain = domain.substring(0, domain.indexOf('/'));
        domain = domain.toLowerCase();

        return domain;
};

exports.download = function (link){

        let options = {
                uri: link,
                method:'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
                }
        };

        return new Promise (function(resolve, reject){
                request(options, function (err, result, page) {
                        if (err) {
                                reject(err);
                        }
                        resolve(page);
                });
        });
};

var prepareURL = function (URL){
        
            for (let i = 0; i < URL.length; i++){
                if(URL[i] != " " && URL[i] != "\n" && URL[i] != "\t"){
                    URL = URL.substring(i);
                    break;
                }
            }
            for (let i = (URL.length-1); i >= 0; i--){
                if(URL[i] != " " && URL[i] != "\n" && URL[i] != "\t"){
                    URL = URL.substring(0, i+1);
                    break;
                }
            }
        
            return URL;
};



exports.preparePromoLink = function (title){
        
        for (let i = 0; i < title.length; i++){
            if(title[i] != " " && title[i] != "\n" && title[i] != "\t"){
                title = title.substring(i);
                break;
            }
        }
        for (let i = (title.length-1); i >= 0; i--){
            if(title[i] != " " && title[i] != "\n" && title[i] != "\t"){
                title = title.substring(0, i+1);
                break;
            }
        }
    
        if(title.length > 128){title = title.substring(0, 128);}
    
        title = title.toLowerCase();
        title = title.replace(/\W/g, '-');
        //title = encodeURI(title);
        //title = title.replace(new RegExp('%20', 'g'), '-');

        title = title + '_' + Math.round((Math.random()*Math.pow(10, 10)));

        return title;
};

    
exports.saveImage = function(imageURL){

        imageURL.hiRes = prepareURL(imageURL.hiRes);
        imageURL.thumb = prepareURL(imageURL.thumb);

        return new Promise(function(resolve, reject){
                var imageJSON = {
                        hiRes: "",
                        thumb: ""
                };

                mongodb.MongoClient.connect(config.mongoUrl, function(error, db) {

                        if(error){
                                reject(error);
                        }
                        
                        var bucket = new mongodb.GridFSBucket(db, {
                                bucketName: 'images'
                        });

                        var tempfile1 = Math.random();

                        var inputHiRes = bucket.openUploadStream();
                        imageJSON.hiRes = inputHiRes.id;

                        var http1 = request({
                                uri: imageURL.hiRes,
                                method:'GET',
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
                                }
                        });

                        http1.on("error", function(err){
                                reject(err);
                        });

                        http1.pipe(fs.createWriteStream("./tmp/"+tempfile1))
                        .on("error", function(err){
                                reject(err);
                        })
                        .once("close", function(){
                                var file1 = fs.createReadStream("./tmp/"+tempfile1);
                                file1.on("error", function(err){
                                        reject(err);
                                })
                                file1.pipe(inputHiRes)
                                .on("error", function(err){
                                        reject(err);
                                })
                                .once("finish", function(){
                                        console.log("ok, saved " + inputHiRes.id);
                                        imageJSON.hiRes = inputHiRes.id;

                                        var tempfile2 = Math.random();

                                        var inputThumb = bucket.openUploadStream();
                                        imageJSON.thumb = inputThumb.id;

                                        var http2 = request({
                                                uri: imageURL.thumb,
                                                method:'GET',
                                                headers: {
                                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
                                                }
                                        });

                                        http2.on("error", function(err){
                                                reject(err);
                                        });

                                        http2.pipe(fs.createWriteStream("./tmp/"+tempfile2))
                                        .on("error", function(err){
                                                reject(err);
                                        })
                                        .once("close", function(){
                                                var file2 = fs.createReadStream("./tmp/"+tempfile2);
                                                file2.on("error", function(err){
                                                        reject(err);
                                                })
                                                file2.pipe(inputThumb)
                                                .on("error", function(err){
                                                        reject(err);
                                                })
                                                .once("finish", function(){
                                                        console.log("ok, saved " + inputThumb.id);
                                                        fs.unlink("./tmp/"+tempfile1, function(err){
                                                                console.log(err);
                                                        });
                                                        fs.unlink("./tmp/"+tempfile2, function(err){
                                                                console.log(err);
                                                        });
                                                        resolve(imageJSON);
                                                });
                                        });
                                });
                        });
                });
        });
};