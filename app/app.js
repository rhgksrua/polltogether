'use strict';

// Declare app level module which depends on views, and components
angular.module('pollApp', [
        'ngRoute',
        'pollApp.pollCreate',
        'pollApp.pollVote',
        'pollApp.pollResult',
        'pollApp.register',
        'pollApp.login'
    ])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('tokenInjector');
        $routeProvider.otherwise({redirectTo: '/create'});
    }]).factory('tokenInjector', ['$window', function($window) {
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
    }]);
