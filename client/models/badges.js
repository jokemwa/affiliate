var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var badgeSchema = new Schema({

    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }

}, {
        timestamps: true
    });

var Badges = mongoose.model('Badge', badgeSchema);

module.exports = Badges;