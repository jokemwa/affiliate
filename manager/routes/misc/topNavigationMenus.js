var async = require('async');
var TopNavigationBrandLists = require('../../models/topNavigation/topNavigationBrandLists');


exports.addBrandToMenu = function (brand_id, callback) {
    TopNavigationBrandLists.findOne({'version': 0}, 'items')
    .sort('order')
    .exec((err, result) => {
        if(err){
            return callback(err, null);
        }
        let order;
        if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
        let item = {
            "brand": brand_id,
            "order": order
        };
        TopNavigationBrandLists.findOneAndUpdate({'version': 0},
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

exports.removeBrandFromMenu = function (brand_id, callback) {
    TopNavigationBrandLists.findOneAndUpdate({'version': 0},
    {$pull: { "items": { "brand": brand_id } }},
    { new: true },
    (err, result) => {
        if(err){
            return callback(err, null);
        }
        TopNavigationBrandLists.findOne({'version': 0}, 'items',
        (err, result) => {
            if(err){
                return callback(err, null);
            }
            for(let i = 0; i < result.items.length; i++){
                result.items[i].order = i;
            }
            TopNavigationBrandLists.findOneAndUpdate({'version': 0},
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

exports.searchAndRemoveFromBrandsMenu = function(brand_id, callback) {
    TopNavigationBrandLists.findOne({ "items": {$elemMatch: {"brand": brand_id} } }, (err, result) => {
        if(err){
            return callback(err, null);
        }
        if (result) {
            exports.removeBrandFromMenu(brand_id, (err, result) => {
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