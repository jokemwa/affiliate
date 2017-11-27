var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var clientActionSchema = new Schema({

    location: {
        type: String
    },
    actionType: {
        type: String
    },
    target: {
        type: String
    }

}, {
        timestamps: true
    });

var clientActions = mongoose.model('clientAction', clientActionSchema);

module.exports = clientActions;