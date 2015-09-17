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
        
    }])
    .service('userService', ['$http','tokenService', function($http, tokenService) {
        var us = this;

        us.getEmail = function(){
            return $http.get('/userinfo')
                .then(function(response) {
                    if (response.data.error) {
                        console.log(response.data.error);
                        throw new Error(response.data.error);
                    }
                    return response;
                });
        };
    }])
    .controller('indexController', ['userService', 'tokenService', '$scope',  function(userService, tokenService, $scope) {
        var ic = this;

        $scope.share = {
            email: '',
            username: '',
            extra: 'nothing here'
        };

        ic.logout = function() {
            console.log('loggout');
            tokenService.removeToken();
            $scope.share.email = '';

        };

        if (tokenService.getToken()) {
            userService.getEmail()
                .then(function(response) {
                    console.log('user found');
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
        
        // Contains user info
    }]);
