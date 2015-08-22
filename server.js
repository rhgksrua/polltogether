// PollApp server

var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var pollValidator = require('./helper/pollValidator');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polls';
var Poll = require('./model/Poll').init(mongoURI, MongoClient);
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

/******************************************************************************
*
* ROUTES
*
*******************************************************************************/

/**
 * Routes
 *
 * @return {undefined}
 */
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
    Poll.save(poll, function(err) {
        if (err) {
            console.log(err);
            res.json({error: 'db error'});
        } else {
            console.log('sending json...');
            res.json(poll);
        }
    });

});

/******************************************************************************
*
* APP START
*
*******************************************************************************/

var server = app.listen(port, function(err) {
    console.log('listening on http://%s:%s', 'localhost', port);
});

