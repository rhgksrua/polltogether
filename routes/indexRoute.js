// indexRoute.js
/*jslint node: true */
'use strict';

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

router.post('/login', function(req, res) {
    res.json('login api');
});

router.post('/register', function(req, res) {
    res.json('register api');
});

module.exports = router;
