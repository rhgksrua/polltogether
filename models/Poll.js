/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    url: {type: String, required: true},
    question: {type: String, required: true},
    choices: [{
        id:   String,
        name: String,
        vote: Number
    }],
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    voted: [String]
});

// The name of collection will be 'polls' by default unless collection
// name is specified in the Schema option.
// mongoose takes 'Poll' and makes it plural by adding an s.
var Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
        
