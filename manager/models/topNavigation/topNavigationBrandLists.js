var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var topNavigationBrandListSchema = new Schema({
    version: {
        type: Number,
        unique: true
    },
    items: [{
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        order: {
            type: Number
        }
    }],
}, {
        timestamps: true
    });

var topNavigationBrandLists = mongoose.model('topNavigationBrandList', topNavigationBrandListSchema);

module.exports = topNavigationBrandLists;