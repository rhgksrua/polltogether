/*jslint node:true */
'use strict';

var jwt = require('jsonwebtoken');
var validator = require('validator');
var User = require('../models/User');

var JWT_PASS = process.env.JWT_PASS;

/**
 * validateInput - server side validation
 *
 * @param input
 * @return {undefined}
 */
var validateInput = function(input) {
    var errors = [];
    if (!validator.isEmail(input.email)) {
        errors.push('invalid email'); 
    }
    if (!validator.isAlphanumeric(input.username) && input.username.length < 3) {
        errors.push('invalid username');
    }
    if (input.password.length < 4) {
        errors.push('invalid password');
    }
    return errors;
};

/**
 * registerUser
 *
 * registers user with email, username, and password
 *
 * @param req
 * @param res
 * @return {undefined}
 */
var registerUser = function(req, res) {
    console.log('- starting user reg');
    
    var dbError = {
        error: 'db error'
    };

    var userInput = req.body;

    // email, username, password
    var validationErrors = validateInput(userInput);
    if (validationErrors.length > 0) {
        return res.json({validationErrors: validationErrors});
    }

    process.nextTick(function() {
        User.findOne({'email': userInput.email}, function(err, user) {
            if (err) {
                // db error
                return res.json(dbError);
            }
            if (user) {
                // email exists return error
                return res.json({exists: 'email'});
            }
            // email not exists check username
            User.findOne({'username': userInput.username}, function(err, user) {
                if (err) {
                    // db error
                    return res.json(dbError);
                }
                if (user) {
                    // email exists return error
                    return res.json({exists: 'username'});
                }

                // Create and save new user
                var newUser = new User();
                newUser.email = userInput.email;
                newUser.username = userInput.username;
                newUser.password = newUser.generateHash(userInput.password);
                newUser.save(function(err, added) {
                    if (err) {
                        return res.json(dbError);
                    }
                    var token = jwt.sign({
                        email: added.email,
                        username: added.username
                    }, JWT_PASS);
                    console.log('- registering thru custom');
                    return res.json({token: token, email: added.email, username: added.username});
                });
            });
        });
    });
};

module.exports = registerUser;
