var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var Verify = require('./verify');


var saver = require('./misc/saver');
var images = require('./misc/images');
var categories = require('./misc/categories');
var shops = require('./misc/shops');
var brands = require('./misc/brands');
var tags = require('./misc/tags');
var products = require('./misc/products');

var Products = require('../models/products');
var Marketplaces = require('../models/marketplaces');


var productsRouter = express.Router();
productsRouter.use(bodyParser.json());

productsRouter.route('/')
// Get all products with category, brand, shop, tags and badges
    .get(Verify.verifyUser, function (req, res, next) {
        Products.find({})
        .populate('badges')
        .lean()
        .exec(function (err, result) {
            if (err) {
                console.log(err);
                err.status = 500;
                return next(err);
            }
            let promises = [];
            result.forEach((element) => {

                promises.push(products.getProductBrand(element._id)
                .then(
                (brand) => {
                    if (brand == null) {
                        brand = {name: '', _id: ''};
                    }
                    element.brand = brand;
                },
                (err) => {
                    return Promise.reject(err);
                }));

                promises.push(products.getProductCategory(element._id)
                .then(
                (category) => {
                    element.category = category;
                },
                (err) => {
                    return Promise.reject(err);
                }));

                promises.push(products.getProductShop(element._id)
                .then(
                (shop) => {
                    element.shop = shop;
                },
                (err) => {
                    return Promise.reject(err);
                }));

                promises.push(products.getProductTags(element._id)
                .then(
                (tags) => {
                    element.tags = tags;
                },
                (err) => {
                    return Promise.reject(err);
                }));
            });
            
            Promise.all(promises)
            .then(() => {
                console.log(result);
                res.json(result);
            },
            (err) => {
                console.log(err);
                err.status = 500;
                return next(err);
            });
    });
})
// Create new product
    .post(Verify.verifyUser, function (req, res, next) {
        
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
    .post(Verify.verifyUser, function (req, res, next) {
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
    .delete(Verify.verifyUser, function (req, res, next) {
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
// Get selected product
    .get(Verify.verifyUser, function (req, res, next) {
        Products.findById(req.params.id)
        .populate('badges')
        .lean()
        .exec(function (err, result) {
            if (err) {
                console.log(err);
                err.status = 500;
                return next(err);
            }
            let promises = [];
            promises.push(products.getProductBrand(result._id)
                .then(
                (brand) => {
                    if (brand == null) {
                        brand = {name: '', _id: ''};
                    }
                    result.brand = brand;
                },
                (err) => {
                    return Promise.reject(err);
                }));

            promises.push(products.getProductCategory(result._id)
                .then(
                (category) => {
                    result.category = category;
                },
                (err) => {
                    return Promise.reject(err);
                }));

            promises.push(products.getProductShop(result._id)
                .then(
                (shop) => {
                    result.shop = shop;
                },
                (err) => {
                    return Promise.reject(err);
                }));

            promises.push(products.getProductTags(result._id)
                .then(
                (tags) => {
                    result.tags = tags;
                },
                (err) => {
                    return Promise.reject(err);
                }));
            
            
            Promise.all(promises)
            .then(() => {
                console.log(result);
                res.json(result);
            },
            (err) => {
                console.log(err);
                err.status = 500;
                return next(err);
            });
    });
    })

    .put(Verify.verifyUser, function (req, res, next) {
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
    .delete(Verify.verifyUser, function (req, res, next) {
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