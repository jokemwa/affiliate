var async = require('async');
var startPageCategoriesLists = require('../../models/startPage/startPageCategoriesLists');
var startPageCategories = require('../../models/startPage/startPageCategories');
var startPageTops = require('../../models/startPage/startPageTops');

exports.addCategoryToList = function (category_id, callback) {
    startPageCategories.create({category: category_id}, (err, result) => {
        if(err){
            return callback(err, null);
        }
        let category = result._id;
        startPageCategoriesLists.findOne({"version": 0}, 'items')
        .sort('order')
        .exec((err, result) => {
            if(err){
                return callback(err, null);
            }
            let order;
            if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
            let item = {
                "category": category,
                "order": order
            };
            startPageCategoriesLists.findOneAndUpdate({"version": 0},
            {$push: { "items": item }},
            { new: true }, 
            (err, result) => {
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            }
            );
        });
    });
}

exports.removeCategoryFromList = function (topCategory_id, callback) {
    startPageCategories.findByIdAndRemove(topCategory_id, (err, result) => {
        if(err){
            return callback(err, null);
        }
        startPageCategoriesLists.findOneAndUpdate({"version": 0},
        { $pull: { "items": {"category": topCategory_id}} },
        { new: true }, 
        (err, result) => {
            if(err){
                return callback(err, null);
            }
            startPageCategoriesLists.findOne({"version": 0}, 'items')
            .sort('order')
            .exec((err, result) => {
                if(err){
                    return callback(err, null);
                }
                for(let i = 0; i < result.items.length; i++){
                    result.items[i].order = i;
                }
                startPageCategoriesLists.findOneAndUpdate({"version": 0},
                { $set: { "items": result.items} },
                { new: true }, 
                (err, result) => {
                    if(err){
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        });
    });
}

exports.addProductToCategory = function (category_id, product_id, callback) {
    startPageCategories.findById(category_id, 'items')
    .sort('order')
    .exec((err, result) => {
        if(err){
            return callback(err, null);
        }
        let order;
        if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
        let item = {
            "product": product_id,
            "order": order
        };
        
        startPageCategories.findByIdAndUpdate(category_id,
            {$push: { "items": item }},
            { new: true }, 
            (err, result) => {
                console.log(result);
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    });
}

exports.removeProductFromCategory = function (category_id, product_id, callback) {
    startPageCategories.findByIdAndUpdate(category_id,
    {$pull: { "items": { "product": product_id } }},
    { new: true },
    (err, result) => {
        if(err){
            return callback(err, null);
        }
        startPageCategories.findById(category_id, 'items',
        (err, result) => {
            if(err){
                return callback(err, null);
            }
            for(let i = 0; i < result.items.length; i++){
                result.items[i].order = i;
            }
            startPageCategories.findByIdAndUpdate(category_id,
            { $set: { "items": result.items} },
            { new: true }, 
            (err, result) => {
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            });
        });
    });
}

exports.addProductToTops = function (product_id, callback) {
    startPageTops.findOne({'version': 0}, 'items')
    .sort('order')
    .exec((err, result) => {
        if(err){
            return callback(err, null);
        }
        let order;
        if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
        let item = {
            "product": product_id,
            "order": order
        };
        startPageTops.findOneAndUpdate({'version': 0},
            {$push: { "items": item }},
            { new: true }, 
            (err, result) => {
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    });
}

exports.removeProductFromTops = function (product_id, callback) {
    startPageTops.findOneAndUpdate({'version': 0},
    {$pull: { "items": { "product": product_id } }},
    { new: true },
    (err, result) => {
        if(err){
            return callback(err, null);
        }
        startPageTops.findOne({'version': 0}, 'items',
        (err, result) => {
            if(err){
                return callback(err, null);
            }
            for(let i = 0; i < result.items.length; i++){
                result.items[i].order = i;
            }
            startPageTops.findOneAndUpdate({'version': 0},
            { $set: { "items": result.items} },
            { new: true }, 
            (err, result) => {
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            });
        });
    });
}

function searchAndRemoveFromTopCategroies(product_id, callback) {
    startPageCategories.findOne({ "items": {$elemMatch: {"product": product_id} } }, (err, result) => {
        if(err){
            return callback(err, null);
        }
        if (result) {
            exports.removeProductFromCategory(result._id, product_id, (err, result) => {
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            });
        } else {
            callback(null, null);
        }
    });
}

function searchAndRemoveFromTops(product_id, callback) {
    startPageTops.findOne({ "items": {$elemMatch: {"product": product_id} } }, (err, result) => {
        if(err){
            return callback(err, null);
        }
        if (result) {
            exports.removeProductFromTops(product_id, (err, result) => {
                if(err){
                    return callback(err, null);
                }
                callback(null, result);
            });
        } else {
            callback(null, null);
        }
    });
}


exports.removeFromStartPage = function(product_id, callback) {
    async.parallel([(callback) => {
        searchAndRemoveFromTopCategroies(product_id, callback);
    },
    (callback) => {
        searchAndRemoveFromTops(product_id, callback);
    }
    ], (err, result) => {
        if(err){
            return callback(err, null);
        }
        callback(null, result);
    });
}