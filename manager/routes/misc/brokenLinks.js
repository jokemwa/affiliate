var BrokenLinks = require('../../models/brokenLinks');

exports.removeFromBrokenLinks = function(product_id, callback) {
    BrokenLinks.findOneAndRemove({ "product": product_id },
    function (err, result) {
        if(err){
            return callback(err, null);
        }
        callback(null, result);
        return;
    });
}