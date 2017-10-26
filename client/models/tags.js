var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tagSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    }

}, {
        timestamps: true
    });

var Tags = mongoose.model('Tag', tagSchema);

module.exports = Tags;