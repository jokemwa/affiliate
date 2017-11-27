var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var startPageTopSchema = new Schema({
    version: {
        type: Number,
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

var startPageTops = mongoose.model('startPageTop', startPageTopSchema);

module.exports = startPageTops;