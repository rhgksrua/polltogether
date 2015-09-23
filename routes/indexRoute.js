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

// jwt key
var JWT_PASS = process.env.JWT_PASS || 'pass';

router.get('/twitter/fail', function(req, res) {
    console.log(req.user);
    res.send('login failed');
});

router.get('/test', function(req, res) {
    console.log('test');
    console.log(req.user);
    res.send('username: ' + req.session.username);
});

router.post('/twitter/username', function(req, res) {
    // check db for username
    // if username exists, user has to pick another username
    // else save username
    console.log('----------- in twitter username ------');
    console.log('req body username: ', req.body.username);
    console.log('req.session.id', req.session.twitterId);
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
                console.log('updated twitter username conflict');
                return res.render('./twitter/success', {username: updatedUser.username, token: token});
            });
        });
    });
});

router.get('/twitter/success', function(req, res) {
    // NOTE: need to intercept logins with username conflict
    //
    console.log('---------------------------------');

    console.log('- user:');
    console.log(req.user);

    if (!req.user) {
        return res.send('error');
        //req.user = {twitter: {username: 'not signed in'}};
    }

    console.log('req.user: ', req.user);
    req.session.twitterId = req.user.twitter.id;

    // need to check for duplicate id
    if (!req.user.username) {
        return res.render('./twitter/username');
    }

    req.session.username = req.user.twitter.username;
    
    var token = jwt.sign({
        username: req.user.username || 'none'
    }, JWT_PASS);

    /*
    var retJSON = {
        token: token,
        username: req.user.twitter.username || 'none'
    };
    */

    

    console.log('user inside succ:', req.session);

    return res.render('./twitter/success', {username: req.user.username, token: token});
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/return', 
    passport.authenticate('twitter', {successRedirect: '/twitter/success', failureRedirect: '/twitter/fail'})
);


/**
 *
 * URI /
 *
 * Mainpage
 *
 * - create polls and submit
 *
 **/
router.get('/', function(req, res) {
    res.render('./app/index');
    //res.sendFile(__dirname + '/app/index.html');
});

/**
 * URI /userinfo
 *
 * Returns user info if token validates
 *
 * @return {undefined}
 */
router.get('/userinfo', expressjwt({secret: JWT_PASS}), authenticate, function(req, res) {
    console.log('user', req.user);
    res.json({email: req.user.email, username: req.user.username});
});

/**
 * URI /login 
 *
 * Users are logged in using passport-local
 *
 * @return {undefined}
 */
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
        }, JWT_PASS);

        var retJSON = {
            token: token,
            email: user.email,
            username: user.username
        };

        return res.json(retJSON);

    })(req, res, next);
});

/**
 *  URI /register - registers user
 *
 *  Uses userRegister instead of passport
 *
 * @return {undefined}
 */
router.post('/register', userRegister);

router.post('/logout', function(req, res) {
    console.log(req.session);
    // req.logout();
    
    req.session.destroy(function(err) {
        if (err) {
            return res.json({error: 'session error'});
        }
        return res.json({loggedout: true});
    });
   

});

/**
 * authenticate - error handling for express-jwt
 *
 * Handles error
 *
 * @return {undefined}
 */
function authenticate(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({error: 'authorization failed', revoke: true});
    }
}

module.exports = router;
