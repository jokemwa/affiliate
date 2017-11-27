var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var clientDeviceSchema = new Schema({

    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clientSession'
    }]

}, {
        timestamps: true
    });

var clientDevices = mongoose.model('clientDevice', clientDeviceSchema);

module.exports = clientDevices;