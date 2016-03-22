'use strict';

/**
 * This is first test for this project.
 *
 * Some things to keep in mind.
 * - All dependencies must be included in karma.conf.js file.
 *   For pollCtrl, modal and services directory needed to be included.
 *
 * Tests for other controllers should be very similar to the test below.
 *
 */

describe('pollApp.create module', function() {

    var $controller;

    beforeEach(module('pollApp.pollCreate'));

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    describe('', function(){

        it('should equal choice0', function() {
            var $scope = {};
            var controller = $controller('pollCtrl', {$scope: $scope});
            controller.resetForm();
            expect(controller.data.choices[0].id).toEqual('choice0');
        });
        it('should equal 0', function() {
            var $scope = {};
            var controller = $controller('pollCtrl', {$scope: $scope});
            controller.resetForm();
            expect(controller.data.choices[0].vote).toEqual(0);
        });

    });
});

