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

            Poll.save(poll, function(err) {
                if (err) {
                    console.log(err);
                    res.json({error: 'db error'});
                }else {
                    console.log('sending json...');
                    res.json(pollUrl);
                }
            });


        } 
    }); 
});

router.get('/:id',function(req,res){
    var poll=req.params;
    Poll.get(poll.id,function(err,data) {
        if (err) {
            console.log(err);
            res.json({error: 'db error'});
        }else{
            console.log(poll.id);
            console.log(data);
            res.json(data);
        }
    })
});

router.post('/vote', function(req, res) {
    var poll = req.body;
    var url=poll.url;
    var option=poll.choice;
    voteValidator(poll, function(err) {
        if (err) {
            res.json({error: err});
        } else {

//$inc:{choices[option].vote : 1}

            Poll.update({ "url": url },
                {  },
                { upsert: true },function (err, numUpdated) {
                if (err) {
                    console.log(err);
                } else if (numUpdated) {
                    console.log('Updated Successfully %d document(s).', numUpdated);
                } else {
                    console.log('No document found with defined "find" criteria!');
                }});


        }
    });
});



module.exports = router;
