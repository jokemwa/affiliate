var Categories = require ('../../models/categories');
var Brands = require ('../../models/brands');
var Shops = require ('../../models/shops');
var Tags = require ('../../models/tags');



exports.getProductCategory = function (product_id) {
     return new Promise (function(resolve, reject){
        Categories.findOne({ "items": {$elemMatch: {"product": product_id} } },
        function (err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        });
     });
}

exports.getProductBrand = function (product_id) {
    return new Promise (function(resolve, reject){
       Brands.findOne({ "items": {$elemMatch: {"product": product_id} } },
       function (err, result) {
           if(err){
               reject(err);
           }
           resolve(result);
       });
    });
}

exports.getProductShop = function (product_id) {
    return new Promise (function(resolve, reject){
       Shops.findOne({ "items": {$elemMatch: {"product": product_id} } },
       function (err, result) {
           if(err){
               reject(err);
           }
           resolve(result);
       });
    });
}

exports.getProductTags = function (product_id) {
    return new Promise (function(resolve, reject){
       Tags.find({ "items": product_id },
       function (err, result) {
           if(err){
               reject(err);
           }
           resolve(result);
       });
    });
}