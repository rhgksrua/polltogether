/*jslint node:true */
'use strict';

var jwt = require('jsonwebtoken');
var User = require('../models/User');

var registerUser = function(req, res) {
    console.log('- starting user reg');
    
    var dbError = {
        error: 'db error'
    };

    // email, username, password
    var userInput = req.body;

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
                    }, 'pass');
                    console.log('- registering thru custom');
                    return res.json({token: token, email: added.email, username: added.username});
                });
            });
        });
    });
};

module.exports = registerUser;
