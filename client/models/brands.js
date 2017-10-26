var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var brandSchema = new Schema({

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

var Brands = mongoose.model('Brand', brandSchema);

module.exports = Brands;