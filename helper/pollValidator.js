// pollValidator module

/**
 * pollValidator
 *
 * @param {object} poll
 * @return {boolean} false on invalid poll submitoin
 */
var pollValidator = function(poll) {
    return poll || false;
}

module.exports = pollValidator;
