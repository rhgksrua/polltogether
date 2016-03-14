(function() {
    'use strict';

    angular.module('pollApp.register')
        .directive('compareTo', function() {
            // confirm password directive
            return {
                require: 'ngModel',
                scope: {
                    otherModelValue: '=compareTo'
                },
                link: function(scope, element, attributes, ngModel) {
                    ngModel.$validators.compareTo = function(modelValue) {
                        return modelValue == scope.otherModelValue;
                    };
                    scope.$watch('otherModelValue', function() {
                        ngModel.$validate();
                    });
                }
            };
        });
})();
