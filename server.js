// PollApp server
/*jslint node: true*/
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var app = express();

require('./config/passport')(passport);


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

app.use(session({
    secret: 'abcdefg',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
//app.use(expressJwt({secret: 'pass'}).unless({path: ['/', '/login', '/register']}));
            
app.use(passport.session());
app.use(flash());


app.enable('trust proxy');

/******************************************************************************
*
* ROUTES
*
*******************************************************************************/

app.use(function(err, req, res, next) {
    console.log('token error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(req.user);
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});

app.use('/', indexRoute);
app.use('/poll', pollRoute);
app.use('/user', userRoute);


/******************************************************************************
*
* APP START
*
*******************************************************************************/

var server = app.listen(port, function(err) {
    console.log('listening on http://%s:%s', 'localhost', port);
});

