var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var clientActionSchema = new Schema({

    action: {
        type: String
    },
    area: {
        name: {
            type: String
        },
        context: {
            type: {
                type: String
            },
            value: {
                type: String
            }
        }
    },
    element: {
        name: {
            type: String
        },
        context: {
            type: {
                type: String
            },
            value: {
                type: String
            }
        }
    }

}, {
        timestamps: true
    });

var clientActions = mongoose.model('clientAction', clientActionSchema);

module.exports = clientActions;