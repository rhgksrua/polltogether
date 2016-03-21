// UserValidator class module
'use strict';

var UserValidator = function(rules, fields) {
    // rules should be like this
    //
    // {
    //     'name of field': 'required|length:10'
    // }
    //
    // add fields as keys to rules object
    this.rules = rules;
    this.fields = fields;
};

UserValidator.prototype = {
    checkField: function() {
    },
    
};
