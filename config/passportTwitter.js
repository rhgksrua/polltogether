/*jslint node:true */
'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/User');

module.exports = function(passport) {
    var callbackUrl;
    var twitterStrategyOptions;

    /**
     * Session is required by passport-twitter
     *
     */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('id: ', id);
            if (err) {
                done(err);
            }
            done(null, user);
        });
    });

    if (process.env.ENVIRONMENT === 'production') {
        callbackUrl = 'https://boiling-coast-6739.herokuapp.com';
    } else {
        callbackUrl = 'http://127.0.0.1:3000';
    }

    twitterStrategyOptions = {
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: callbackUrl + '/twitter/return'
    };

    passport.use(new TwitterStrategy(
        twitterStrategyOptions, 
        function (token, tokenSecret, profile, done) {
            console.log('- token:', token);
            console.log('- tokenSecret:', tokenSecret);
            process.nextTick(function() {
                User.findOne({'twitter.id': profile.id}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        console.log('user exists, set jwt based on twitter');
                        // user exists return user from db
                        return done(null, user);
                    } else {
                        User.findOne({'username': profile.username}, function(err, user) {
                            // new twitter user but same id as normal user
                            if (err) {
                                return done(err);
                            }
                            var newUser = new User();

                            // Only set username if username does not conflict with normal user
                            if (user) {
                                newUser.usernameEmpty = true;
                            } else {
                                newUser.username = profile.username;
                            }

                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.displayname = profile.displayName;
                            console.log('- profile username:', profile.username);
                            newUser.twitter.username = profile.username;
                            newUser.save(function(err, added) {
                                if (err) {
                                    throw err;
                                }
                                console.log('- added:', added);
                                return done(null, added);
                            });
                        });
                    }
                });
            });
        }
    ));
};

