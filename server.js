// PollApp server

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Routes
var indexRoute = require('./routes/indexRoute');
var pollRoute = require('./routes/pollRoute');

// Separate production and local.
// var environment = process.env.POLLENV || 'local';

var port = process.env.PORT || 3000;

// Serves static files
app.use(express.static('app'));
app.use(bodyParser.json());

/******************************************************************************
*
* ROUTES
*
*******************************************************************************/

app.use('/', indexRoute);
app.use('/poll', pollRoute);


/******************************************************************************
*
* APP START
*
*******************************************************************************/

var server = app.listen(port, function(err) {
    console.log('listening on http://%s:%s', 'localhost', port);
});

