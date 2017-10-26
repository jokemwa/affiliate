var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var brandSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String
    },
    logo: {
        type: String
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

var Brands = mongoose.model('Brand', brandSchema);

module.exports = Brands;