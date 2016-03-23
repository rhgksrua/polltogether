describe('Validator', function() {
    'use strict';
    var Validator = require('../helper/Validator');

    it('should return rules', function() {
        var rules = {'user': 'required|min:4|max:4'};
        var validator = new Validator(rules);
        validator(rules);
        expect(validator.getRules()).toEqual(rules);
    });
});
