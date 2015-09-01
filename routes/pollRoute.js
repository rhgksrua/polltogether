// pollRoute.js

var express = require('express');
var router = express.Router();
var pollValidator = require('../helper/pollValidator');
var voteValidator = require('../helper/voteValidator');
var MongoClient = require('mongodb').MongoClient;
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polls';
var Poll = require('../model/Poll').init(mongoURI, MongoClient);
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
    var poll = req.body;
    pollValidator(poll, function(err) {
        if (err) {
            res.json({error: err});
        } else {
            var pollUrl = shortid.generate();
            poll.url = pollUrl;

            Poll.save(poll, function(db, err) {
                if (err) {
                    console.log(err);
                    res.json({error: 'db error'});
                    console.log('closing db');
                    db.close();
                    
                }else {
                    console.log('sending json...');
                    res.json(pollUrl);
                    console.log('closing db');
                    db.close();
                }
            });
        } 
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
    var poll = req.params;
    Poll.get(poll.id, function(db, err, data) {
        if (err) {
            console.log(err);
            res.json({error: 'db error'});
        } else {
            if (data.length < 1) {
                res.json({error: 'not found'});
                console.log('closing db');
                db.close();
            } else {
                console.log(poll.id);
                console.log(data);
                res.json(data[0]);
                console.log('closing db');
                db.close();
            }
        }
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
    console.log("vote requested ");
    var poll = req.body;
    voteValidator(poll, function(err) {
        if (err) {
            res.json({error: err});
            console.dir(err);
            console.log("vote validate not succeded");
        } else {
            console.log("vote validate succeded");
            console.dir(poll);
            var option="choice"+poll.choice;
            console.log("vote index : "+option);

            Poll.submitVote(poll, function (db, err, numUpdated) {
                if (err) {
                    console.log('vote submit error');
                    res.json({error: 'failed to submit'});
                    console.log('db closed');
                    db.close();
                } else {
                    console.log('updated');
                    res.json({message: 'vote submitted'});
                    console.log('db closed');
                    db.close();
                }
            });
        }
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
    var poll = req.params;
    Poll.get(poll.id, function(db, err, data) {
        if (err) {
            console.log(err);
            res.json({error: 'db error'});
        } else {
            if (data.length < 1) {
                res.json({error: 'not found'});
                console.log('db closed');
                db.close();
            } else {
                console.log(poll.id);
                console.log(data);
                res.json(data[0]);
                console.log('db closed');
                db.close();
            }
        }

    });
});

module.exports = router;
