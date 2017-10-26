var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tagSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }] 

}, {
        timestamps: true
    });

var Tags = mongoose.model('Tag', tagSchema);

module.exports = Tags;