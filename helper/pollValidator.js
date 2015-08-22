// pollValidator module

/**
 * pollValidator
 *
 * @param {object} poll
 * @return {boolean} false on invalid poll submitoin
 */
var pollValidator = function(poll) {
    if (poll === undefined)
        return false;
    if (typeof poll !== 'object') {
        return false;
    }
    if (Object.keys(poll).length === 0)
        return false;
    return true;
}

module.exports = pollValidator;
