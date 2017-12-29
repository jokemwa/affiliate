var async = require('async');
var express = require('express');
var mongoose = require('mongoose');
var lodash = require('lodash');

var Categories = require('../models/categories');
var Brands = require('../models/brands');
var Tags = require('../models/tags');
var Shops = require('../models/shops');

var products = require('./misc/products');
var tags = require('./misc/tags');

var similarRouter = express.Router();


similarRouter.route('/:id')
// Get simiilar products
.get(function (req, res, next) {
    var similar = [];
    var tasks = [];
    tasks.push(
        (callback) => {
            products.getProductCategory(req.params.id)
            .then((product_category) => {
                Categories.findById(product_category)
                .populate('items.product')
                .populate({
                    path:     'items.product',			
                    populate: { path:  'badges'}
                  })
                .lean()
                .exec((err, category) => {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    if (category) {
                        let promises = [];
                        category.items.forEach(element => {
                            promises.push(products.getProductTags(element.product._id)
                            .then(
                            (tags) => {
                                element.product.tags = tags;
                            },
                            (err) => {
                                return Promise.reject(err);
                            }));
                        });
                        Promise.all(promises)
                        .then(() => {
                            category.items.forEach(element => {
                                if(element.product._id.toString() !== req.params.id) {
                                    similar.push(element.product);
                                }
                            });
                            callback(null);
                        },
                        (err) => {
                            console.log(err);
                            err.status = 500;
                            return callback(err);
                        });
                    } else {
                        callback(null);
                    }
                });
            }, (err) => {
                console.log(err);
                err.status = 500;
                return callback(err);
            });
    });

    tasks.push(
        (callback) => {
            products.getProductShop(req.params.id)
            .then((product_shop) => {
                Shops.findById(product_shop)
                .populate('items.product')
                .populate({
                    path:     'items.product',			
                    populate: { path:  'badges'}
                  })
                .lean()
                .exec((err, shop) => {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    if (shop) {
                        let promises = [];
                        shop.items.forEach(element => {
                            promises.push(products.getProductTags(element.product._id)
                            .then(
                            (tags) => {
                                element.product.tags = tags;
                            },
                            (err) => {
                                return Promise.reject(err);
                            }));
                        });
                        Promise.all(promises)
                        .then(() => {
                            shop.items.forEach(element => {
                                if(element.product._id.toString() !== req.params.id) {
                                    similar.push(element.product);
                                }
                            });
                            callback(null);
                        },
                        (err) => {
                            console.log(err);
                            err.status = 500;
                            return callback(err);
                        });
                    } else {
                        callback(null);
                    }
                });
            }, (err) => {
                console.log(err);
                err.status = 500;
                return callback(err);
            });
    });

    tasks.push(
        (callback) => {
            products.getProductBrand(req.params.id)
            .then((product_brand) => {
                Brands.findById(product_brand)
                .populate('items.product')
                .populate({
                    path:     'items.product',			
                    populate: { path:  'badges'}
                  })
                .lean()
                .exec((err, brand) => {
                    if(err){
                        console.log(err);
                        err.status = 500;
                        return callback(err);
                    }
                    if (brand) {
                        let promises = [];
                        brand.items.forEach(element => {
                            promises.push(products.getProductTags(element.product._id)
                            .then(
                            (tags) => {
                                element.product.tags = tags;
                            },
                            (err) => {
                                return Promise.reject(err);
                            }));
                        });
                        Promise.all(promises)
                        .then(() => {
                            brand.items.forEach(element => {
                                if(element.product._id.toString() !== req.params.id) {
                                    similar.push(element.product);
                                }
                            });
                            callback(null);
                        },
                        (err) => {
                            console.log(err);
                            err.status = 500;
                            return callback(err);
                        });
                    } else {
                        callback(null);
                    }
                });
            }, (err) => {
                console.log(err);
                err.status = 500;
                return callback(err);
            });
    });

    tasks.push(
        (callback) => {
            products.getProductTags(req.params.id)
            .then((result) => {
                let promises = [];
                //console.log(result);
                result.forEach(element => {
                    promises.push(tags.getTagProducts(element._id)
                    .then(
                        (tag) => {
                            tag.items.forEach(el => {
                                if(el.product._id.toString() !== req.params.id) {
                                    similar.push(el.product);
                                }
                            });
                        },
                        (err) => {
                            return Promise.reject(err);
                    }));
                });
                Promise.all(promises)
                .then(() => {
                    callback(null);
                },
                (err) => {
                    console.log(err);
                    err.status = 500;
                    return callback(err);
                });

            }, (err) => {
                console.log(err);
                err.status = 500;
                return callback(err);
            });
    });

    async.parallel(tasks, (err) => {
        if(err){
            console.log(err);
            err.status = 500;
            return next(err);
        }
        
        let reduce = [];

        for (let i = 0; i < similar.length; i++) {
            console.log('step', i);
            let existed = false;
            for (let j = 0; j < reduce.length; j++) {
                if (reduce[j].product._id.toString() === similar[i]._id.toString()) {
                    existed = true;
                    reduce[j].rating++;
                }
                
            }
            if (!existed) {
                let item = {
                    product: similar[i],
                    rating: 1
                };
                reduce.push(item);
            }

        }
        reduce = lodash.orderBy(reduce, ['rating', 'product.title'], ['desc', 'asc']);
        for (let i = 0; i < reduce.length; i++) {
            reduce[i].order = i;
            delete reduce[i].rating;
        }
        console.log(reduce);
        res.json(reduce);
    });
});


module.exports = similarRouter;