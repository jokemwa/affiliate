var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var clientSessionSchema = new Schema({

    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clientAction'
    }]

}, {
        timestamps: true
    });

var clientSessions = mongoose.model('clientSession', clientSessionSchema);

module.exports = clientSessions;