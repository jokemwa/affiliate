var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var topNavigationShopSchema = new Schema({
    ref: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            unique: true
        },
        show: {
            type: Boolean
        },
        order: {
            type: Number,
            unique: true
        }
    }] 

}, {
        timestamps: true
    });

var topNavigationShops = mongoose.model('topNavigationShop', topNavigationShopSchemaSchema);

module.exports = topNavigationShops;