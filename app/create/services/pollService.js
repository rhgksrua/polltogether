'use strict';

angular.module('pollApp.pollCreate')
    .service('pollService', ['$http', '$window', function($http, $window) {
        var poll = this;
        var validate = function(Poll) {
            Poll.choices = Poll.choices.filter(function(el) {
                return el.name && el.name.length > 0;
            });
            return Poll;
        };
        poll.createPoll = function(Poll){
            Poll = validate(Poll);

            //Ajax post poll to back end
            return $http.post('/poll/submit', Poll)
                .then(function(response) {
                    // do stuff with response here
                    return response;
                });
        };
        poll.getEmail = function(token) {
            return $http.post('/user/email')
                .then(function(response) {
                    return response.data;
                });
        };
    }]);
