/*jslint node:true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

module.exports = function(passport) {
    passport.use('local-register', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function (req, email, password, done) {
            process.nextTick(function() {
                User.findOne({'email': email}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        // username exists
                        return done(null, false);
                    } else {
                        var newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.save(function(err, added) {
                            if (err) {
                                throw err;
                            }
                            return done(null, added);
                        });
                    }
                });
            });
        }
    ));
};

                
                


