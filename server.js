// PollApp server
/*jslint node: true*/
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var morgan = require('morgan');

// Load api keys from dot env file
if (!process.env.CONSUMER_KEY) {
    require('dotenv').load();
}

var app = express();

// passport strategies
require('./config/passport')(passport);
require('./config/passportTwitter')(passport);

// DB setup
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/polls';
var mongoose = require('mongoose');
mongoose.connect(mongoURI);

// Routes
var twitterRoute = require('./routes/twitterRoute');
var indexRoute   = require('./routes/indexRoute');
var pollRoute    = require('./routes/pollRoute');
var userRoute    = require('./routes/userRoute');

// Separate production and local.
// var environment = process.env.POLLENV || 'local';

var port = process.env.PORT || 3000;

// Serves static files
app.use(express.static('app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set session options

var store = new MongoDBStore(
        {
            uri: mongoURI,
            collection: 'mySessions'
        }
);

store.on('error', function(err) {
    console.log('mongodb session error');
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: store
}));

app.use(passport.initialize());
            
app.use(passport.session());

app.enable('trust proxy');

// logging
app.use(morgan('combined'));

// templating
app.set('views', './templates');
app.set('view engine', 'jade');

/******************************************************************************
*
* ROUTES
*
*******************************************************************************/

app.use('/', indexRoute);
app.use('/poll', pollRoute);
app.use('/user', userRoute);
app.use('/twitter', twitterRoute);


/******************************************************************************
*
* APP START
*
*******************************************************************************/

var server = app.listen(port, function(err) {
    console.log(process.env.JWT_PASS);
    console.log(process.env.NODE_ENV);
    console.log('listening on http://%s:%s', 'localhost', port);
    console.log('listening on http://127.0.0.1:%s', port);
});

