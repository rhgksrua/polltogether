// indexRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var router = express.Router();


/**
 *
 * URI /
 *
 * Mainpage
 * - create polls and submit
 *
 **/
router.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

router.post('/test', authenticate, function(req, res) {
    var email = req.user.email;
    console.log('test req user email', req.user.email);
    res.json({email: email});
});

router.post('/login', function(req, res) {
    res.json('login api');
});

// register api endpoint
router.post('/register', function(req, res, next) {
    passport.authenticate('local-register', function(err, user, info) {
        if (err) {
            res.json({error: 'db error'});
            return next(err);
        }
        console.log(user);

        // email exists
        if (!user) {
            return res.send({exists: true});
        }

        console.log('sending user.....................', user);

        // creating token
        var token = jwt.sign({
            email: user.email
        }, 'pass');

        return res.json({token: token, email: user.email});

    })(req, res, next);
});

function authenticate(req, res, next) {
    var body = req.user;
    console.log('body user', body);
    next();
}

module.exports = router;
