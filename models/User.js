/*jslint node: true */
'use strict';

var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {type: String},
    username: {type: String},
    usernameEmpty: {type: Boolean, default: false},
    password: {type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    twitter: {
        id: String,
        token: String,
        displayname: String,
        username: String
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    try {
        return bcrypt.compareSync(password, this.password);
    } catch (ex) {
        return false;
    }
};

// The name of collection will be 'polls' by default unless collection
// name is specified in the Schema option.
// mongoose takes 'Poll' and makes it plural by adding an s.
var User = mongoose.model('User', UserSchema);

module.exports = User;
        

