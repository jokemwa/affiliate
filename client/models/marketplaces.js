var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var marketplaceSchema = new Schema({
    searchTag: {
        type: String,
        required: true,
        unique: true
    },
    parser: {
        type: String
    },
    name: {
        type: String
    },
    link: {
        type: String
    },
    logo: {
        type: String
    }


}, {
        timestamps: true
    });

var Marketplaces = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplaces;