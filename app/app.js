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
    }]);
