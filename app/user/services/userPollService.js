'use strict';

angular.module('pollApp.user')
    .service('userPollService', ['$http', '$window', function($http, $window) {
        var us = this;

        us.getPolls = function(username) {
            return $http.post('/user/polls', {'username': username})
                .then(function(response) {
                    return response;
                });
        };
        us.removePoll = function(url, username) {
            return $http.post('/user/removepoll', {url: url, username: username})
                .then(function(response) {
                    return response;
                });
        };
    }]);
