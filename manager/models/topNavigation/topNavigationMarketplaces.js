var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var topNavigationMarketplaceSchema = new Schema({
    ref: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Marketplace',
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

var topNavigationMarketplaces = mongoose.model('topNavigationMarketplace', topNavigationMarketplaceSchema);

module.exports = topNavigationMarketplaces;