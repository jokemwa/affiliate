var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var startPageTopSchema = new Schema({
    ref: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            unique: true
        },
        order: {
            type: Number,
            unique: true
        }
    }] 

}, {
        timestamps: true
    });

var startPageTops = mongoose.model('startPageTop', startPageTopSchema);

module.exports = startPageTops;