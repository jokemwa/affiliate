var Tags = require ('../../models/tags');
var Marketplaces = require('../../models/marketplaces');

var products = require('./products');

exports.getTagProducts = function (tag_id) {
    return new Promise (function(resolve, reject){
        Tags.findById(tag_id)
        .populate('items.product')
        .populate({
            path:     'items.product',			
            populate: { path:  'badges'}
          })
        .populate({
            path:     'items.product',			
            populate: { path:  'marketplace'}
        })
        .lean()
        .exec(function (err, result) {
            if(err){
                console.log(err);
                err.status = 500;
                reject(err);
            }
            if(result){
            let promises = [];
            result.items.forEach(element => {
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
                //console.log(result);
                resolve(result);
            },
            (err) => {
                console.log(err);
                err.status = 500;
                reject(err);
            });
            } else {
                console.log(result);
                resolve(result);
            }
       });
    });
}