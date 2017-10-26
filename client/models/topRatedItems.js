var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var topRatedItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },        
    order: {
         type: Number,
         unique: true

    }     

}, {
        timestamps: true
    });

var topRatedItems = mongoose.model('topRatedItem', topRatedItemSchema);

module.exports = topRatedItems;