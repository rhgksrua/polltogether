(function() {
    'use strict';

    angular.module('pollApp.pollVote')
        .service('voteService', ['$http', function($http) {
            var poll = this;

            /**
             * setId
             * url to get poll id for ajax request
             *
             * @param id
             * @return {undefined}
             */
            poll.setId = function(id) {
                poll.id = id;
            };

            /**
             * getPoll
             * ajax request to server api to get poll
             *
             * @return {undefined}
             */
            poll.getPoll = function() {
                return $http.get('/poll/' + poll.id)
                    .then(function(response) {
                        return response;
                    });
            };

            /**
             * submitVote
             * ajax request to server api to submit vote
             *
             * @param {object} vote
             * @return {undefined}
             */
            poll.submitVote = function(vote) {
                console.log(vote);
                return $http.post('/poll/vote/submit', vote)
                    .then(function(response) {
                        return response;
                    });
            };
        }]);
}());
