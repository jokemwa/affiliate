var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
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

var Categories = mongoose.model('Category', categorySchema);

module.exports = Categories;