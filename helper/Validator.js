// Validator module
'use strict';

/**
 * Validator. Validates user inputs.
 * 
 *
 */
function Validator(rules) {
    this.rules = rules;
}

Validator.prototype.getRules = function() {
    return this.rules;
};

module.exports = Validator;
