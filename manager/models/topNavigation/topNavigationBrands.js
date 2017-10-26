var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var topNavigationBrandSchema = new Schema({
    ref: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
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

var topNavigationBrands = mongoose.model('topNavigationBrand', topNavigationBrandSchema);

module.exports = topNavigationBrands;