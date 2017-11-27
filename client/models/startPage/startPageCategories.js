var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var startPageCategorySchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        unique: true
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

var startPageCategories = mongoose.model('startPageCategory', startPageCategorySchema);

module.exports = startPageCategories;