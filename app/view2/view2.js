'use strict';

angular.module('pollApp.pollVote', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'pollVoteCtrl'
        });
    }])

    .controller('pollVoteCtrl', [function() {

    }]);
