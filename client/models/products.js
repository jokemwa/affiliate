var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: {
        type: String
    },
    frontImage: {
        type: String
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
    marketplace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marketplace'
    },        
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }],
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