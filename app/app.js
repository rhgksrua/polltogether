'use strict';

// Declare app level module which depends on views, and components
angular.module('pollApp', [
        'ngRoute',
        'pollApp.pollCreate',
        'pollApp.pollVote',
        'pollApp.pollResult',
        'pollApp.register'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/create'});
    }]);
