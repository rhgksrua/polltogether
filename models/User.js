/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

// The name of collection will be 'polls' by default unless collection
// name is specified in the Schema option.
// mongoose takes 'Poll' and makes it plural by adding an s.
var User = mongoose.model('User', UserSchema);

module.exports = User;
        

