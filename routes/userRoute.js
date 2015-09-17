// pollRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Poll = require('../models/Poll');
var jwt = require('express-jwt');

/**
 *
 * URI /poll/submit
 *
 * Receives ajax request and stores polls to db.
 * - Validate submition
 * - Create unique url for each poll
 *
 **/

/***************************************************************************/

/**
 * Returns list of polls from a user
 * POST {username: username}
 *
 * @return {undefined}
 */
router.post('/polls', jwt({secret: 'pass'}), authPass, function(req, res) {
    console.log('user on page:', req.userAuth);
    console.log('json: ', req.body);
    var username = req.body.username;
    console.log('user: ', req.user);
    User.findOne({username: username}, function(err, user) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        if (!user) {
            return res.json({error: 'user does not exist'});
        }

        if (user) {
            // get all polls created by the user
            Poll.find({user_id: user._id}, {'_id': 0, 'url': 1}, function(err, polls) {
                if (err) {
                    return res.json('db error');
                }
                return res.json({polls: polls});
            });
        }
        
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json('not logged in');
}

function authenticate(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({error: 'authorization failed'});
    }
}

/**
 * authPass - only called when jwt fails.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @return {undefined}
 */
function authPass(err, req, res, next) {
    if (err.name !== 'UnauthorizedError') {
        req.userAuth = true;
    } else {
        req.userAuth = false;
    }
    console.log('reqAuth middleware', req.userAuth);
    next();
}

module.exports = router;
