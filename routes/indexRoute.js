// indexRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var router = express.Router();

var userRegister = require('../config/userRegister');


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

router.get('/userinfo', expressjwt({secret: 'pass'}), authenticate, function(req, res) {
    console.log('user', req.user);
    res.json({email: req.user.email, username: req.user.username});
});

router.post('/login', function(req, res, next) {
    console.log('--- log in');
    
    passport.authenticate('local-login', function(err, user, info) {
        console.log('- start auth');
        if (err) {
            console.log('- db error');
            res.json({error: 'db error'});
            return next(err);
        }

        if (!user) {
            console.log('- user: ', user);
            console.log('- user does not exist');
            return res.send({error: 'login error error error'});
        }

        console.log('sending user.....................', user);

        // creating token
        var token = jwt.sign({
            email: user.email,
            username: user.username
        }, 'pass');

        var retJSON = {
            token: token,
            email: user.email,
            username: user.username
        };

        return res.json(retJSON);

    })(req, res, next);
});

router.post('/register', userRegister);

// register api endpoint
router.post('/registerx', function(req, res, next) {
    passport.authenticate('local-register', function(err, user, info) {
        if (err) {
            res.json({error: 'db error'});
            return next(err);
        }

        // email exists
        if (!user) {
            return res.send({exists: true});
        }

        // creating token
        var token = jwt.sign({
            email: user.email
        }, 'pass');

        return res.json({token: token, email: user.email});

    })(req, res, next);
});

router.post('/registernew', function(req, res) {
    console.log(req.body);
    res.json(req.body);

});

function authenticate(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({error: 'authorization failed'});
    }
}

module.exports = router;
