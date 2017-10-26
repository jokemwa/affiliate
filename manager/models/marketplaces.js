var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var marketplaceSchema = new Schema({
    searchTag: {
        type: String,
        required: true,
        unique: true
    },
    parser: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    link: {
        type: String
    },
    logo: {
        type: String
    },
    hasShops: {
        type: Boolean,
        default: false
    },
    shops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }]

}, {
        timestamps: true
    });

var Marketplaces = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplaces;