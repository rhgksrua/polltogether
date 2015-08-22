describe('JSON validator', function() {
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
});
