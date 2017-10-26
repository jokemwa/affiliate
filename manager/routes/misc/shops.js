var Shops = require('../../models/shops');

exports.removeFromShops = function (product_id, callback) {
        Shops.findOne({ "items": {$elemMatch: {"product": product_id} } },
        function (err, result) {
            if(err){
                callback(err, null);
                return;
            }
            if(result != null){
            let shop_id = result._id;
            Shops.findByIdAndUpdate(shop_id,
                { $pull: { "items": { "product": product_id } } },
                { new: true }, 
                function (err, result) {
                    if(err){
                        callback(err, null);
                        return;
                    }
                    Shops.findById(shop_id, 'items')
                    .sort('order')
                    .exec(function (err, result) {
                        if(err){
                            callback(err, null);
                            return;
                        }
                        for(let i = 0; i < result.items.length; i++){
                            result.items[i].order = i;
                        }
                        Shops.findByIdAndUpdate(shop_id,
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

exports.addToShop = function (product_id, shop_id, callback) {
    Shops.findById(shop_id, 'items')
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

        Shops.findByIdAndUpdate(shop_id,
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
