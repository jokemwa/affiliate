var Products = require ('../../models/products');


 exports.getAllProducts = function (marketplace_id) {
     return new Promise (function(resolve, reject){
        Products.find({ "marketplace": marketplace_id },
        function (err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        });
     });
    
 }