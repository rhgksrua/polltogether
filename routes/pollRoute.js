// pollRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var Poll = require('../models/Poll');
var User = require('../models/User');
var shortid = require('shortid');

var JWT_PASS = process.env.JWT_PASS || 'pass';

/**
 * jwtErrHandler - error handling for express-jwt
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @return {undefined}
 */
function jwtErrHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({error: 'Unauthorized'});
    }
}

/**
 *
 * URI /poll/submit
 *
 * Receives ajax request and stores polls to db.
 * - Validate submition
 * - Create unique url for each poll
 *
 **/
router.post('/submit', jwt({secret: JWT_PASS, credentialsRequired: false}), jwtErrHandler, function(req, res) {
//router.post('/submit', jwt({secret: JWT_PASS, credentialsRequired: true}), function(req, res) {
    var rawPoll = req.body;
    var email;
    try {
        email = req.user.email;
    } catch (e) {
        console.log(e);
    }
        
    rawPoll.url = shortid.generate();

    var poll;
    
    /**
     * 
     * Need to check if generated url exists in the database.
     * If it exists, it should fail or create another one.
     * 
     */
    User.findOne({'email': email}, function(err, user) {
        console.log('user: ', user);
        if (err) {
            // db error
            return res.json({error: 'db error'});
        }
        if (user) {
            // user exists add id to poll
            console.log('user found!!!!');
            rawPoll.user_id = user._id;
        }
        poll = new Poll(rawPoll);
        poll.save(function(err, data) {
            if (err) {
                res.json({error: 'db error'});
                return console.log(err);
            }
            if (data) {
                return res.json(data.url);
            }
        });
    });
});

/**
 * URI /poll/id
 *
 * Returns poll for users to vote
 **/
router.get('/:id', function(req, res) {
    var url = req.params.id;
    Poll.findOne({url: url, show: true}, function(err, poll) {
        if (err) {
            console.log(err);
            return res.json('db error');
        }
        if (!poll) {
            return res.json({error: 'poll does not exist'});
        }
        return res.json(poll); 
    });
});

/**
 * URI /poll/vote/submit
 * 
 * Accept votes and update poll results 
 **/
router.post('/vote/submit', function(req, res) {
    var url = req.body.id;
    var choice = req.body.choice;
    // filtering IPv6
    var ip = req.ip.split(':').slice(-1)[0];
    
    // Check if already voted
    Poll.findOne({'url': url}, function(err, data) {
        if (err) {
            return res.json({'error': 'db error'});
        }

        // IP already voted
        if (data.voted.indexOf(ip) >= 0) {
            console.log('IP duplicate');
            return res.json({'error': 'Already voted'});
        }

        // Adds vote and ip to poll
        Poll.update({'url': url, 'choices.id': 'choice' + choice}, {$inc: {'choices.$.vote': 1}, $addToSet: {'voted': ip}}, function(err, data) {
            if (err) {
                console.log(err);
                return res.json({'error': 'db error'});
            }
            console.log('vote submitted');
            return res.json('vote submitted and ip added');
        });
    });
});

/**
 * URI /poll/:id/results
 * 
 * Returns poll results
 **/
router.get('/:id/results', function(req, res) {
    var url = req.params.id;
    Poll.findOne({url: url}, function(err, poll) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        res.json(poll); 
    });
});

module.exports = router;
