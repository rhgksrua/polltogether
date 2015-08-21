// PollApp server

var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('app'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

var server = app.listen(port, function(err) {
    console.log('listening on http://%s:%s', 'localhost', port);
});
