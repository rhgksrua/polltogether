/*jslint node:true */
'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deser user:', user);
            if (err) {
                done(err);
            }
            done(null, user);
        });
    });

    passport.use(new TwitterStrategy({
            consumerKey: process.env.CONSUMER_KEY,
            consumerSecret: process.env.CONSUMER_SECRET,
            callbackURL: 'http://127.0.0.1:3000/twitter/return'
        }, function (token, tokenSecret, profile, done) {
            console.log('- token:', token);
            console.log('- tokenSecret:', tokenSecret);
            //console.log(profile);
            //return done(null, profile);
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
                        // create new user entry
                        var newUser = new User();
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.displayName = profile.displayName;
                        console.log('- profile username:', profile.username);
                        newUser.twitter.username = profile.username;
                        newUser.save(function(err, added) {
                            if (err) {
                                throw err;
                            }
                            console.log('- added:', added);
                            return done(null, added);
                        });
                    }
                });
            });
        }
    ));
};

