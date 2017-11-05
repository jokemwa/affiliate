var Brands = require('../../models/brands');

exports.removeFromBrands = function (product_id, callback) {
        Brands.findOne({ "items": {$elemMatch: {"product": product_id} } },
        function (err, result) {
            if(err){
                callback(err, null);
                return;
            }
            if(result != null){
            let brand_id = result._id;
            Brands.findByIdAndUpdate(brand_id,
                { $pull: { "items": { "product": product_id } } },
                { new: true }, 
                function (err, result) {
                    if(err){
                        callback(err, null);
                        return;
                    }
                    Brands.findById(brand_id, 'items')
                    .sort('order')
                    .exec(function (err, result) {
                        if(err){
                            callback(err, null);
                            return;
                        }
                        for(let i = 0; i < result.items.length; i++){
                            result.items[i].order = i;
                        }
                        Brands.findByIdAndUpdate(brand_id,
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

exports.addToBrand = function (brand_id, product_id, callback) {
    console.log(brand_id);
    Brands.findById(brand_id, 'items')
    .sort('order')
    .exec(function (err, result) {
        if(err){
            callback(err, null);
            return;
        }
        console.log(result);
        let order;
        if (result.items.length == 0) {order = 0;} else {order = result.items[result.items.length-1].order + 1;}
        let item = {
            "product": product_id,
            "order": order
        };

        Brands.findByIdAndUpdate(brand_id,
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

exports.removeFromBrand = function (brand_id, product_id, callback) {
    Brands.findByIdAndUpdate(brand_id,
        { $pull: { "items": { "product": product_id } } },
        { new: true },
        function (err, result) {
                if(err){
                    callback(err, null);
                    return;
                }
                Brands.findById(brand_id, 'items')
                .sort('order')
                .exec(function (err, result) {
                    if(err){
                        callback(err, null);
                        return;
                    }
                    for(let i = 0; i < result.items.length; i++){
                        result.items[i].order = i;
                    }
                    Brands.findByIdAndUpdate(brand_id,
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
};
