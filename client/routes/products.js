var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var fs = require('fs');

var cutLink = function (link){

    let domain = link.substring((link.indexOf('//')+2));
    domain = domain.substring(0, domain.indexOf('/'));
    domain = domain.toLowerCase();
    return domain;
};

var preparePromoLink = function (title){
    
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
    title = title.replace(/\W/g, '_');

    return title;
};

var Products = require('../models/products');
var Marketplaces = require('../models/marketplaces');

var productsRouter = express.Router();
productsRouter.use(bodyParser.json());

productsRouter.route('/')
    .get(function (req, res, next) {
        Products.find({}, function (err, results) {
        if (err) throw err;
        console.log(results);
        res.json(results);
    });
})

    .post(function (req, res, next) {
        
        let product = {
            images: [],
            marketplace: null,
            buyLink: null,
            promoLink: null
        };

        let domain = cutLink(req.body.link);

        Marketplaces.find({}, function(err, results){

            if (err) {
                let error = new Error(err);
                err.status = 500;
                return next(err);
            }

            for(let i = 0; i < results.length; i++){

                if(domain.indexOf(results[i].searchTag) >= 0){

                    product.marketplace = results[i]._id;
                    product.buyLink = req.body.link;

                    let options = {
                        uri: req.body.link,
                        method:'GET',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
                        }
                    };

                    let parser = require(results[i].parser);

                    /*let path = './page.html';
                    let file = fs.createWriteStream(path);
                    request.get(options).pipe(file).on('close', function() {console.log('ok')});*/
                    
                    request(options, function (err, result, page) {

                        if (err) {
                            let error = new Error(err);
                            err.status = 500;
                            return next(err);
                        }
                        //parser.parseImages(page);
                        
                        parser.parseTitle(page, req.body.link)
                        .then(function(title){
                            product.promoLink = preparePromoLink(title);
                        })
                        .then(function(){
                            parser.parseImages(page)
                            .then(function(parsedImages){
                            for(let j = 0; j < parsedImages.length; j++){
                                product.images.push(parsedImages[j]);
                            }
                            Products.create(product, function (err, result) {
                                
                                if (err) {
                                    let error = new Error(err);
                                    err.status = 500;
                                    return next(err);
                                    }
                                
                                    console.log(result);
                                    res.json(result);
                                });
                            }, function(err){
                                let error = new Error(err);
                                err.status = 500;
                                console.log(err);
                                return next(err);
                            });
                        });
                        
                    });

                    break;
                }
                else{
                    if(i == (results.length-1)){
                        let error = new Error("Wrong link");
                        err.status = 500;
                        return next(err);
                    }
                }
            }
        });
})

productsRouter.route('/:id')
    .get(function (req, res, next) {
        Products.findOne({promoLink: req.params.id}, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
        });
    })

    .put(function (req, res, next) {
        Products.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.json(result);
            });
    })

    .delete(function (req, res, next) {
        Products.findByIdAndRemove(req.params.id, function (err, response) {
            if (err) throw err;
            console.log(response);
            res.json(response);
        });
    });



module.exports = productsRouter;