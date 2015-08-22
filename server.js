// PollApp server

var express = require('express');
var bodyParser = require('body-parser');

var pollValidator = require('./helper/pollValidator');
var Polls = require('./model/Poll');
var app = express();

// Separate production and local.
// var environment = process.env.POLLENV || 'local';


var port = process.env.PORT || 3000;

app.use(express.static('app'));
app.use(bodyParser.json());

/**
 *
 * Main Page
 *
 **/
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

/**
 *
 * Accept Poll Submit
 *
 * Receives ajax request and stores polls to db.
 *     Validate submition
 *     Create unique id for each poll
 *
 **/
app.post('/poll/submit', function(req, res) {
    var poll = req.body;
    pollValidator(poll, function(err) {
        if (err) {
            res.send({error: err});
        }
    }); 
    Polls.save(poll, function(err) {

        if (err)
            res.send({error: 'db error'});
        res.json(poll);
    });

});

var server = app.listen(port, function(err) {
    console.log('listening on http://%s:%s', 'localhost', port);
});

