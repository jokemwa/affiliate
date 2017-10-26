var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shopSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
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

var Shops = mongoose.model('Shop', shopSchema);

module.exports = Shops;