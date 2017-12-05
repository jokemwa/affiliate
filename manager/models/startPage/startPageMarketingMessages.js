var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var startPageMarketingMessageSchema = new Schema({
    version: {
        type: Number,
        unique: true
    },
    image: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: 'The offers of the best online stores in the world are available for Israel'
    }

}, {
        timestamps: true
    });

var startPageMarketingMessages = mongoose.model('startPageMarketingMessage', startPageMarketingMessageSchema);

module.exports = startPageMarketingMessages;