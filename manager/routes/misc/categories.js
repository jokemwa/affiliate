var Categories = require('../../models/categories');

exports.removeFromCategories = function (product_id, callback) {
        Categories.findOne({ "items": {$elemMatch: {"product": product_id} } },
        function (err, result) {
            if(err){
                callback(err, null);
                return;
            }
            if(result != null){
            let category_id = result._id;
            Categories.findByIdAndUpdate(category_id,
                { $pull: { "items": { "product": product_id } } },
                { new: true }, 
                function (err, result) {
                    if(err){
                        callback(err, null);
                        return;
                    }
                    Categories.findById(category_id, 'items')
                    .sort('order')
                    .exec(function (err, result) {
                        if(err){
                            callback(err, null);
                            return;
                        }
                        for(let i = 0; i < result.items.length; i++){
                            result.items[i].order = i;
                        }
                        Categories.findByIdAndUpdate(category_id,
                            {
                                $set: { "items": result.items }
                            }, {
                                new: true
                            }, function (err, result) {
                                if(err){
                                    callback(err, null);
                                    return;
                                }
                                callback(null, result);
                                return;
                            });
                        });
            });
        } else { callback(null, null); return; }
        });
};

exports.addToCategory = function (product_id, category_id, callback) {
    Categories.findById(category_id, 'items')
    .sort('order')
    .exec(function (err, result) {
        if(err){
            callback(err, null);
            return;
        }
        let order;
        if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
        let item = {
            "product": product_id,
            "order": order
        };

        Categories.findByIdAndUpdate(category_id,
            {
            $push: { "items": item }
        }, {
            new: true
        }, function (err, result) {
            if(err){
                callback(err, null);
                return;
            }
            callback(null, result);
            return;
        });
    });
};