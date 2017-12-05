var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shopGroupSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop'
        },
        order: {
            type: Number
        }
    }]       

}, {
        timestamps: true
    });

var ShopGroups = mongoose.model('ShopGroup', shopGroupSchema);

module.exports = ShopGroups;