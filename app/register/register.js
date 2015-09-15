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
            var reg = this;
            var store = $window.localStorage;
            var key = 'auth-token';
            reg.setToken = function(token) {
                if (token) {
                    store.setItem(key, token);
                } else {
                    store.removeItem(key);
                }
            };
            reg.getToken = function() {
                return store.getItem(key);
            };
            reg.sanitize = function(user) {
                var sanitizedUser = {
                    email: user.email,
                    password: user.password
                };
                return sanitizedUser;
            };
            reg.register = function(user){
                user = reg.sanitize(user);
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
        .factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
            return {
                request: addToken
            };
            function addToken(config) {
                var token = registerService.getToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        })
        .controller('registerCtrl', ["registerService", '$location', function(registerService, $location){
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
                        } else if (response.data.exists) {
                            rc.emailExists = true;
                            throw new Error('email exists');
                        }

                        if (response.data.token) {
                            rc.emailExists = false;
                            console.log('registered');
                            registerService.setToken(response.data.token);
                            console.log('INFO', response.data.info);
                            rc.registerSuccess = true;
                            $location.path('/');
                        }
                        
                        // redirect user to profile page
                        return response;
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

