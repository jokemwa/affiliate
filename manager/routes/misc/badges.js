var Products = require ('../../models/products');

exports.removeFromProducts = function (badge_id, callback) {
    Products.update({ "badges": badge_id },
    { $pull: { "badges": badge_id } },
    { new: true },
    function (err, result) {
        if(err){
            callback(err, null);
            return;
        }
        callback(null, result);
        return;
    });
 }

 exports.getAllProducts = function (badge_id, callback) {
     return new Promise (function(resolve, reject){
        Products.find({ "badges": badge_id },
        function (err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        });
     });
    
 }