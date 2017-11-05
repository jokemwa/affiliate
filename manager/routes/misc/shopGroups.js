var ShopGroups = require('../../models/shopGroups');
var _this = this;

exports.addToShopGroup = function (shopGroup_id, shop_id) {
        return new Promise ((resolve, reject) => {
            ShopGroups.findById(shopGroup_id, 'items')
            .sort('order')
            .exec(function (err, result) {
                if(err){
                    reject(err);
                }
                for (let i = 0; i < result.length; i++){
                    if (result.items[i].shop == shop_id) {
                        resolve ({'result': 'existed'});
                    }
                }
                let order;
                if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
                let item = {
                    "shop": shop_id,
                    "order": order
                };
        
                ShopGroups.findByIdAndUpdate(shopGroup_id,
                    {
                    $push: { "items": item }
                }, {
                    new: true
                }, function (err, result) {
                    if(err){
                        reject(err);
                    }
                    resolve(result);
                });
            });
        });
        
    };

exports.removeFromShopGroup = function(shopGroup_id, shop_id) {
        return new Promise((resolve, reject) => {
            ShopGroups.findByIdAndUpdate(shopGroup_id,
                { $pull: { "items": { "shop": shop_id } } },
                { new: true }, 
                function (err, result) {
                    if(err){
                        reject(err);
                    }
                    ShopGroups.findById(shopGroup_id, 'items')
                    .sort('order')
                    .exec(function (err, result) {
                        if(err){
                            reject(err);
                        }
                        for(let i = 0; i < result.items.length; i++){
                            result.items[i].order = i;
                        }
                        ShopGroups.findByIdAndUpdate(shopGroup_id,
                            {
                                $set: { "items": result.items }
                            }, {
                                new: true
                            }, function (err, result) {
                                if(err){
                                    reject(err);
                                }
                                resolve(result);
                            });
                        });
                });
        });
    };

exports.removeShopFromShopGroups = function (shop_id) {
        return new Promise((resolve, reject) => {
            ShopGroups.find({ "items": {$elemMatch: {"shop": shop_id} } },
            function (err, result) {
                if(err){
                    reject(err);
                }
                if(result != null){
                    let promises = [];
                    result.forEach((element) => {
                        promises.push(_this.removeFromShopGroup(element._id, shop_id));
                    });
                    Promise.all(promises)
                    .then((result) => {
                        resolve(result);
                    },
                    (err) => {
                    reject(err);
                    });
                
                } else { resolve(null); }
            });
        });
    };