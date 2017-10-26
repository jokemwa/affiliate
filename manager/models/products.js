var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    frontImage: {
        hiRes: { type: String, default: '' },
        thumb: { type: String, default: '' }
    },   
    images: {
        type: [{
            hiRes: String,
            thumb: String
        }]
    },
    buyLink: {
        type: String
    },
    brokenLinkCheck: {
        type: Date
    },
    marketplace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marketplace'
    },        
    description: {
        type: String,
        default: ''
    },
    badges: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
    }],
    promoLink: {
         type: String 
    }     

}, {
        timestamps: true
    });

var Products = mongoose.model('Product', productSchema);

module.exports = Products;