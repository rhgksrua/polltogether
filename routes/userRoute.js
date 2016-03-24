// pollRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Poll = require('../models/Poll');
var jwt = require('express-jwt');

var JWT_PASS = process.env.JWT_PASS || 'pass';

/**
 * URI user/polls
 *
 * Returns list of polls from a user
 * POST {username: username}
 *
 * @return {undefined}
 */
router.post('/polls', jwt({secret: JWT_PASS, credentialsRequired: false}), function(req, res) {

    var owner;
    var twitter = false;

    if (req.user && req.user.username === req.body.username){
        owner = true;
    } else {
        owner = false;
    }
        
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            return res.json('db error');
        }
        if (!user) {
            return res.json({error: 'user does not exist'});
        }
        if (user.twitter.username) {
            twitter = true;
        }

        if (user) {
            // get all polls created by the user
            Poll.find({user_id: user._id, show: true}, {'_id': 0, 'url': 1}, function(err, polls) {
                if (err) {
                    return res.json('db error');
                }
                return res.json({polls: polls, owner: owner, twitter: twitter});
            });
        }
    });
});

/**
 * URI /user/removepoll
 *
 * Removes poll
 *
 * @return {undefined}
 */
router.post('/removepoll', jwt({secret: JWT_PASS}), authPass, function(req, res) {
    if (!req.user) {
        console.log('- not logged in');
        return res.json({error: 'cannot validate user'});
    }
    if (req.user.username != req.body.username) {
        console.log('- not the owner');
        return res.json({error: 'cannot validate user'});
    }
    User.findOne({username: req.user.username}, function(err, user) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        if (!user) {
            return res.json({error: 'user does not exist'});
        }

        if (user) {
            // get all polls created by the user
            Poll.update({user_id: user._id, show: true, url: req.body.url}, {$set: {show: false}}, function(err, poll) {
                if (err) {
                    return res.json({error: 'db error'});
                }
                return res.json({message: 'removed'});
            });
        }
    });
});

/**
 * URI /user/password
 *
 * Removes poll
 *
 * @return {undefined}
 */
router.post('/password', jwt({secret: JWT_PASS}), authPass, function(req, res) {

    // user = {current, password}
    
    // NEED TO VALIDATE USER INPUT

    if (!req.user) {
        console.log('- not logged in');
        return res.json({error: 'cannot validate user'});
    }
    User.findOne({username: req.user.username}, function(err, user) {
        var newPasswordHash;

        if (err) {
            res.json('db error');
            return console.log(err);
        }
        if (!user) {
            return res.json({error: 'user does not exist'});
        }

        // check if twitter signin user
        if (user.twitter.username !== 'undefined') {
            return res.json({error: 'third party signin user'});
        }

        // check current pw
        if (user.validPassword(req.body.current)) {
            // user pw correct, set pw to new pw.
            newPasswordHash = user.generateHash(req.body.password);
            User.update({_id: user._id}, {$set: {password: newPasswordHash}}, function(err, currentUser) {
                if (err) {
                    return res.json({error: 'db error'});
                }
                return res.json({message: 'new password set'});
            });
        } else {
            return res.json({error: 'password incorrect'});
        }
    });
});

/**
 * authenticate - replaces express-jwt default behavior on authenication fail
 *
 * @return {undefined}
 */
function authenticate(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({error: 'authorization failed', revoke: 'true'});
    }
}

/**
 * authPass
 *
 * Authenticates users for user page.
 *
 * @return {undefined}
 */
function authPass(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // authenticated
        return res.json({error: 'not authorized'});
    }
    next();
}

module.exports = router;
