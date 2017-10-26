var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var topNavigationCategorySchema = new Schema({
    ref: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
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

var topNavigationCategories = mongoose.model('topNavigationCategory', topNavigationCategorySchema);

module.exports = topNavigationCategories;