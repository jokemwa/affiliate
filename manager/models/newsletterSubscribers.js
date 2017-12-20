var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var newsletterSubscriberSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
        timestamps: true
    });

var NewsletterSubscribers = mongoose.model('newsletterSubscriber', newsletterSubscriberSchema);

module.exports = NewsletterSubscribers;