// pollRoute.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/User');

/**
 *
 * URI /poll/submit
 *
 * Receives ajax request and stores polls to db.
 * - Validate submition
 * - Create unique url for each poll
 *
 **/
router.post('/:username', function(req, res) {
    var username = req.params.username;
    User.findOne({username: username}, function(err, user) {
        if (err) {
            res.json('db error');
            return console.log(err);
        }
        res.json('user exists'); 
    });
});


module.exports = router;
