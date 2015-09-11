(function(){
    'use strict';

    angular.module('pollApp.register', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/register', {
                templateUrl: 'register/register.html',
                controller: 'registerCtrl',
                controllerAs:'rc'
            });
        }])
        .service('registerService', ['$http', '$window', function($http, $window) {
            var poll = this;
            poll.sanitize = function(user) {
                var sanitizedUser = {
                    username: user.username,
                    email: user.email,
                    password: user.password
                };
                return sanitizedUser;
                
            };
            poll.register = function(user){
                user = poll.sanitize(user);
                console.log('sanitized user', user);

                //Ajax post poll to back end
                return $http.post('/register', user)
                    .then(function(response) {
                        console.log('response data', response.data);
                        // do stuff with response here
                        return response;
                    });
            };
        }])
        .controller('registerCtrl', ["registerService" ,function(registerService){
            var rc = this;
            // register
            rc.user = {};

            rc.register = function(user) {
                console.log('register');
                console.log(user);
                registerService.register(user)
                    .then(function(response) {
                        if (response.data.error) {
                            throw new Error('SERVER ERROR');
                        }
                        console.log('registered!!!!!!!!!!!!!!!');
                        // redirect user to profile page
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });
            };

        }])
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

