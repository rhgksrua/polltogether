// pollValidator module
'use strict';

/**
 * pollValidator
 *
 * @param {object} poll
 * @param {function} callback
 * @return {boolean} false on invalid poll submitoin
 */
var pollValidator = function(poll, callback) {
    var err = false;
    var required = ['question', 'choices'];


    if (poll === undefined) {
        err = 'undefined poll';
        return false;
    }
    if (typeof poll !== 'object') {
        err = 'invalid type';
        return false;
    }
    if (Object.keys(poll).length === 0) {
        err = 'poll cannot be empty';
        return false;
    }
    required.forEach(function(el, self) {
        if (Object.keys(poll).indexOf(el) < 0) {
            err = 'missing required key(s)';
        }
    });
    if (poll.choices.length < 1) {
        err = 'need two or more choices';
    }

    callback(err);

    if (err) {
        return false;
    }
    return true;
};


module.exports = pollValidator;
