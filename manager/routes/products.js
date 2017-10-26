var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongodb = require('mongodb');


var saver = require('./misc/saver');
var images = require('./misc/images');
var categories = require('./misc/categories');
var shops = require('./misc/shops');
var brands = require('./misc/brands');
var tags = require('./misc/tags');

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
        console.log("Link: ", req.body.link);
        let domain = saver.cutLink(req.body.link);
        console.log("Domain: ", domain);

        Marketplaces.find({}, function(err, results){

            if (err) {
                console.log(err);
                err.status = 500;
                return next(err);
            }

            for(let i = 0; i < results.length; i++){

                if(domain.indexOf(results[i].searchTag) >= 0){

                    product.marketplace = results[i]._id;
                    console.log("Marketplace: ", product.marketplace);
                    product.buyLink = req.body.link;
                    console.log("Buy link: ", product.buyLink);

                    let parser = require(results[i].parser);

                    saver.download(req.body.link)
                    .then(
                        function(page){
                            parser.parseTitle(page, req.body.link)
                            .then(function(title){
                                saver.preparePromoLink(title)
                                .then(function(title){
                                    product.promoLink = title;
                                    console.log("Promo link: ", product.promoLink);
                                    parser.parseImages(page)
                                    .then(function(imageURLs){
                                        console.log("Image URLs: ", imageURLs);
                                        var imagesDownloads = [];
                                        imageURLs.forEach(function(element) {
                                            imagesDownloads.push(saver.saveImage(element)
                                            .then(function(imageFile){
                                                product.images.push(imageFile);
                                                },
                                                function(err){
                                                    return Promise.reject(err);
                                                })
                                            );
                                        });
                                        Promise.all(imagesDownloads).then(function() {
                                            console.log("Saved images: ", product.images);
                                            Products.create(product, function (err, result) {
                                                
                                                if (err) {
                                                    // Error then create prouct
                                                    console.log(err);
                                                    err.status = 500;
                                                    return next(err);
                                                }
                                                
                                                    console.log("Product created: ", result);
                                                    res.json(result);
                                                });
                                        }, function(err){
                                            // Error then create product
                                            console.log(err);
                                            err.status = 500;
                                            return next(err);
                                        }
                                    );
                                    },
                                    function(err){
                                        // Error then getting images urls from page
                                        console.log(err);
                                        err.status = 500;
                                        return next(err);
                                    });
                                },
                                function(err){
                                    // Error then preparing promoLink
                                    console.log(err);
                                    err.status = 500;
                                    return next(err);
                                });
                            },
                        function(err){
                            // Error then getting title from page
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        });
                        },
                        function(err){
                            // Error then downloading page
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        }
                    );
                    break;
                }
                else{
                    if(i == (results.length-1)){
                        console.log("Wrong link");
                        let err = new Error("Wrong link");
                        err.status = 500;
                        return next(err);
                    }
                }
            }
        });
    });

productsRouter.route('/:id/badges/:badge_id')
// Add badge to product
    .post(function (req, res, next) {
        Products.findByIdAndUpdate(req.params.id, 
        { $push: {"badges": req.params.badge_id } },
        { new: true },
        function (err, result) {
            if (err) {
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    })
// Remove badge from product
    .delete(function (req, res, next) {
        Products.findByIdAndUpdate(req.params.id, 
        { $pull: {"badges": req.params.badge_id } },
        { new: true },
        function (err, result) {
            if (err) {
                console.log(err);
                err.status = 500;
                return next(err);
            }
            console.log(result);
            res.json(result);
        });
    })


productsRouter.route('/:id')
    .get(function (req, res, next) {
        Products.findById(req.params.id, function (err, result) {
            if (err) {
                console.log(err);
                err.status = 500;
                return next(err);
            }
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
                if (err) {
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                console.log(result);
                res.json(result);
            });
    })
    
// Delete product
    .delete(function (req, res, next) {
        Products.findById(req.params.id, function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                return next(err);
            }
            images.deleteProductImages(result.images, function (err, result) {
                if(err){
                    console.log(err);
                    err.status = 500;
                    return next(err);
                }
                categories.removeFromCategories(req.params.id, function (err, result) {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return next(err);
                    }
                    shops.removeFromShops(req.params.id, function (err, result) {
                        if(err){
                            console.log(err);
                            err.status = 500;
                            return next(err);
                        }
                        brands.removeFromBrands(req.params.id, function (err, result) {
                            if(err){
                                console.log(err);
                                err.status = 500;
                                return next(err);
                            }
                            tags.removeFromTags(req.params.id, function (err, result) {
                                if(err){
                                    console.log(err);
                                    err.status = 500;
                                    return next(err);
                                }
                                Products.findByIdAndRemove(req.params.id, function (err, result) {
                                    if(err){
                                        console.log(err);
                                        err.status = 500;
                                        return next(err);
                                    }
                                    
                                    res.json(result);
                                });
                            });
                        });
                    });
                });
            });
        });
    });




module.exports = productsRouter;