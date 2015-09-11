// PollApp server
/*jslint node: true*/
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// DB setup
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polls';
var mongoose = require('mongoose');
mongoose.connect(mongoURI);

// Routes
var indexRoute = require('./routes/indexRoute');
var pollRoute = require('./routes/pollRoute');
var userRoute = require('./routes/userRoute');

// Separate production and local.
// var environment = process.env.POLLENV || 'local';

var port = process.env.PORT || 5000;

// Serves static files
app.use(express.static('app'));
app.use(bodyParser.json());

app.enable('trust proxy');

/******************************************************************************
*
* ROUTES
*
*******************************************************************************/

app.use('/', indexRoute);
app.use('/poll', pollRoute);
app.user('/user', userRoute);


/******************************************************************************
*
* APP START
*
*******************************************************************************/

var server = app.listen(port, function(err) {
    console.log('listening on http://%s:%s', 'localhost', port);
});

