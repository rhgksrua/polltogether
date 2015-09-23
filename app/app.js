'use strict';

// Declare app level module which depends on views, and components
angular.module('pollApp', [
        'ngRoute',
        'pollApp.pollCreate',
        'pollApp.pollVote',
        'pollApp.pollResult',
        'pollApp.register',
        'pollApp.login',
        'pollApp.user'
    ])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('tokenInjector');
        $routeProvider.otherwise({redirectTo: '/create'});
    }])
    .factory('tokenInjector', ['$window', function($window) {
        var tokenInjector = {
            request: function(config) {
                var token = $window.localStorage['auth-token'];
                if (token) {
                    config.headers['authorization'] = 'Bearer ' + token;
                }
                return config;
            }
        };
        return tokenInjector;
    }])
    .service('tokenService', ['$window', function($window) {
        var ts = this;
        var store = $window.localStorage;
        var key = 'auth-token';
        ts.test = function() {
            console.log('token works');
        };
        ts.removeToken = function() {
            store.removeItem(key);
        };
        ts.setToken = function(token) {
            if (token) {
                store.setItem(key, token);
            } else {
                store.removeItem(key);
            }
        };
        ts.getToken = function() {
            return store.getItem(key);
        };
        ts.flashMessage = function(msg) {
        };
        
    }])
    .service('userService', ['$http','tokenService', function($http, tokenService) {
        var us = this;

        /**
         * logOut - logs out user
         * 
         * tells server to destroy session
         *
         * @return {undefined}
         */
        us.logOut = function() {
            return $http.post('/logout')
                .then(function(response) {
                    return response;
                });
        };

        /**
         * getEmail - get user info
         *
         * gets username and email from server based on jwt token
         *
         * @return {undefined}
         */
        us.getEmail = function(){
            return $http.get('/userinfo')
                .then(function(response) {
                    if (response.data.error) {
                        if (response.data.revoke) {
                            tokenService.removeToken();
                        }
                        throw new Error(response.data.error);
                    }
                    return response;
                });
        };
    }])
    .controller('indexController', ['userService', 'tokenService', '$scope', '$timeout', '$location', '$route', function(userService, tokenService, $scope, $timeout, $location, $route) {
        var ic = this;

        $scope.share = {
            email: '',
            username: '',
            extra: 'nothing here'
        };

        ic.logout = function() {
            tokenService.removeToken();
            userService.logOut()
                .then(function(response) {
                    if (response.data.error) {
                        throw new Error(response.data.error);
                    }
                    console.log(response.data);
                    return response;
                })
                .then(null, function(response) {
                    console.log(response.data);
                });
            $scope.share.email = '';
            $scope.share.username = '';
            ic.loggedOut = true;
            $scope.$emit('showMessage', 'logged out');
            $location.path('/');

        };

        if (tokenService.getToken()) {
            userService.getEmail()
                .then(function(response) {
                    $scope.share.email = response.data.email;
                    $scope.share.username = response.data.username;
                }).
                then(null, function(response) {

                });
        }

        $scope.$on('setEmail', function(event, email, username) {
            $scope.share.email = email;
            $scope.share.username = username;
        });

        $scope.$on('showMessage', function(event, message) {
            if (!message) {
                console.log('showMessage needs message');
                return;
            }
            $scope.message = message || '';
            ic.showMessage = true;
            $timeout(function() {
                ic.showMessage = false;
                ic.message = '';
            }, 3000);
        });
        
        // Contains user info
    }]);
