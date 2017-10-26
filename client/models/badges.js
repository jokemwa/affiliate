var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var badgeSchema = new Schema({

    name: {
        type: String
    }

}, {
        timestamps: true
    });

var Badges = mongoose.model('Badge', badgeSchema);

module.exports = Badges;