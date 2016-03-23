// Validator module
'use strict';

/**
 * Validator. Validates user inputs.
 * 
 *
 */
var Validator = function(rules) {
    this.rules = rules;
    
    

    
};

Validator.prototype.getRules = function() {
    return this.rules;
};


module.exports = Validator;
