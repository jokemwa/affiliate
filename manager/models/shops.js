var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shopSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        order: {
            type: Number
        }
    }]       

}, {
        timestamps: true
    });

var Shops = mongoose.model('Shop', shopSchema);

module.exports = Shops;