// routetemplate.js
// used to quickly create another route

var express = require('express');
var router = express.Router();

/**  Uncomment for middleware
router.use(function(req, res, next) {
    next();
});
*/

router.get('/', function(req, res) {
    res.send('Hello World');
});

module.exports = router;
