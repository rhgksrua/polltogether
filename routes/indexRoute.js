// indexRoute.js

var express = require('express');
var router = express.Router();


/**
 *
 * URI /
 *
 * Mainpage
 * - create polls and submit
 *
 **/
router.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

module.exports = router;
