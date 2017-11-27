var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var startPageCategoriesListSchema = new Schema({
    version: {
        type: Number,
        unique: true
    },
    items: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'startPageCategory'
        },
        order: {
            type: Number
        }
    }],
}, {
        timestamps: true
    });

var startPageCategoriesLists = mongoose.model('startPageCategoriesList', startPageCategoriesListSchema);

module.exports = startPageCategoriesLists;