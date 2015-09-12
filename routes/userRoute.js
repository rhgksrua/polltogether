// pollRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');
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

/*
router.post('/:username', isLoggedIn, function(req, res) {
    var username = req.params.username;
    User.findOne({username: username}, function(err, user) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        res.json('user exists'); 
    });
});
*/

router.post('/email', jwt({secret: 'pass'}), function(req, res) {
    console.log(req.user);
    res.json(req.user.email);

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json('not logged in');
}

module.exports = router;
