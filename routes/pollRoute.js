// pollRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polls';
var mongoose = require('mongoose');
mongoose.connect(mongoURI);
var Poll = require('../models/Poll');
var shortid = require('shortid');

/**
 *
 * URI /poll/submit
 *
 * Receives ajax request and stores polls to db.
 * - Validate submition
 * - Create unique url for each poll
 *
 **/
router.post('/submit', function(req, res) {
    var rawPoll = req.body;
    rawPoll.url = shortid.generate();
    var poll = new Poll(rawPoll);
    poll.save(function(err, data) {
        if (err) {
            res.json({error: 'db error'});
            return console.log(err);
        }
        res.json(data.url);
        return console.log(data);
    });

});

/**
 *
 * URI /poll/id
 *
 * Returns poll for users to vote
 *
 **/
router.get('/:id', function(req, res) {
    var url = req.params.id;
    Poll.findOne({url: url}, function(err, poll) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        console.log('findOne success');
        res.json(poll); 
    });
});

/**
 *
 * URI /poll/vote/submit
 * 
 * Accept votes and update poll results 
 *
 **/
router.post('/vote/submit', function(req, res) {
    var url = req.body.id;
    var choice = req.body.choice;
    Poll.update({'url': url, 'choices.id': 'choice' + choice}, {$inc: {'choices.$.vote': 1}}, function(err, data) {
        if (err) {
            res.json({'error': 'db error'});
            return console.log(err);
        }
        res.json('vote submitted');
        return console.log(data);
    });
});

/**
 *
 * URI /poll/:id/results
 * 
 * Returns poll results
 *
 **/
router.get('/:id/results', function(req, res) {
    var url = req.params.id;
    Poll.findOne({url: url}, function(err, poll) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        console.log('findOne success');
        res.json(poll); 
    });
});

module.exports = router;
