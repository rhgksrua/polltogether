// twitterRoute.js
/*jslint node: true */
'use strict';

/**
 * Twitter Login Routes
 *
 * Uses passport-twitter
 */

var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var router = express.Router();

// jwt key
var JWT_PASS = process.env.JWT_PASS || 'pass';

/**
 * Twitter sing in failed
 *
 * @return {undefined}
 */
router.get('/fail', function(req, res) {
    console.log(req.user);
    res.send('login failed');
});

/**
 * Twitter users with username that already exists in db are sent here to set a new username.
 *
 * @return {undefined}
 */
router.post('/username', function(req, res) {
    User.findOne({'username': req.body.username}, function(err, user) {
        if (err) {
            return res.send('error');
        }
        if (user) {
            return res.render('./twitter/username', {message: 'username exists'});
        }
        User.findOne({'twitter.id': req.session.twitterId}, function(err, user) {
            if (err) {
                return res.send('error');
            }
            if (!user) {
                return res.send('user does not exists. log in through twitter again');
            }
            user.username = req.body.username;
            user.save(function(err, updatedUser) {
                if (err) {
                    return res.send('update error');
                }
                var token = jwt.sign({
                    username: updatedUser.username
                }, JWT_PASS);
                return res.render('./twitter/success', {username: updatedUser.username, token: token});
            });
        });
    });
});

/**
 * twitter login success
 *
 * saves user data when twitter sign in is successful
 *
 * @return {undefined}
 */
router.get('/success', function(req, res) {

    if (!req.user) {
        return res.send('error');
    }

    /**
     * Twitter Id helps keep track of user that needs to set another username
     *
     */
    req.session.twitterId = req.user.twitter.id;

    /**
     * Twitter user data (username, displayname, id, token) is saved in User.twitter
     * If username from Twitter does not exist in the User.username, it sets Twitter username
     * as the deafult username.  If username exists from normal registration, Twitter user
     * needs to set an another username.  Twitter user will be redirected to /twitter/username
     * to set a new username.  New username is saved in User.username.
     *
     * req.user comes from passportTwitter.  If req.user.username does not exist, it means
     * that Twitter username already exists and a new username is required. User is redirected.
     *
     * @return {undefined}
     */
    if (!req.user.username) {
        return res.render('./twitter/username');
    }

    req.session.username = req.user.twitter.username;
    
    var token = jwt.sign({
        username: req.user.username || 'none'
    }, JWT_PASS);

    return res.render('./twitter/success', {username: req.user.username, token: token});
});

/**
 * twitter oauth login
 *
 * redirects users to twitter for sign in
 *
 * @return {undefined}
 */
router.get('/', passport.authenticate('twitter'));

/**
 * twitter oauth callback
 *
 * users signing in with twitter is redirected here
 *
 * @return {undefined}
 */
router.get('/return', 
    passport.authenticate('twitter', {successRedirect: '/twitter/success', failureRedirect: '/twitter/fail'})
);

module.exports = router;
