describe('JSON validator', function() {
    'use strict';

    var validator = require('../helper/pollValidator');

    it('should fail validation on empty parameter', function() {
        expect(validator()).toBe(false);
    });

    it('should fail validation if argument is not an object', function() {
        expect(validator('234')).toBe(false);
        expect(validator(234234)).toBe(false);
    });

    it('should fail validation empty json', function() {
        expect(validator({})).toBe(false);
    });

    it('should fail due to no question', function() {
        var notValid = {
            "id": "some-random-string",
            "user": null,
            "choices": [ "cat", "dog", "cow" ],
            "settings": {
                "deadline": 124,
                "anonymity": false
            }
        };
        expect(validator(notValid)).toBe(false);
    });
    

    it('should validate a valid json', function() {
        var valid = {
            "id": "some-random-string",
            "user": null,
            "question": "favorite animal",
            "choices": [ "cat", "dog", "cow" ],
            "settings": {
                "deadline": 124,
                "anonymity": false
            }
        };
        expect(validator(valid)).toBe(true);

    });
});
