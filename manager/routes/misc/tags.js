var Tags = require('../../models/tags');

exports.removeFromTags = function (product_id, callback) {
        Tags.update({ "items": {$elemMatch: {"product": product_id} } },
        { $pull: { "items": { "product": product_id } } },
        { new: true },
        function (err, result) {
            if(err){
                callback(err, null);
                return;
            }
            callback(null, 'ok');
            return;
        });
};

exports.removeFromTag = function (tag_id, product_id, callback) {
    Tags.findByIdAndUpdate(tag_id,
    { $pull: { "items": { "product": product_id } } },
    { new: true },
    function (err, result) {
        if(err){
            callback(err, null);
            return;
        }
        callback(null, 'ok');
        return;
    });
};

exports.addToTag = function (product_id, tag_id, callback) {
        Tags.findByIdAndUpdate(tag_id,
        { $push: { "items": { "product": product_id } } },
        { new: true },
        function (err, result) {
            if(err){
                callback(err, null);
                return;
            }
            callback(null, 'ok');
            return;
        });
};
