var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var brokenLinksSchema = new Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }       

}, {
        timestamps: true
    });

var BrokenLinks = mongoose.model('BrokenLink', brokenLinksSchema);

module.exports = BrokenLinks;