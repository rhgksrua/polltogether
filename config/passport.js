/*jslint node:true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

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
                        console.log('- register user exists');
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

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function (req, email, password, done) {
            console.log('inside passport login');
            process.nextTick(function() {
                User.findOne({'email': email}, function(err, user) {
                    console.log('- findone:', user);
                    if (err) {
                        console.log('- db error');
                        return done(err);
                    }
                    if (!user) {
                        console.log('- email does not exist');
                        return done(null, false);
                    }
                    if (user.validPassword(password)) {
                        // user password correct;
                        console.log('- user pw match');
                        return done(null, user);
                    }
                    console.log('- wrong password entered');
                    return done(null, false);
                });
            });
        }
    ));
};

