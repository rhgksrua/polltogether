(function() {
    'use strict';

    angular.module('pollApp.pollResult')
        .service('resultService', ['$http', '$window', function($http, $window) {
            var rs = this;
            rs.errors = {
                exists: true
            };
            rs.poll = {
                question: null,
                choices: []
            };

            /**
             * getUrl
             * grabs url as poll id
             *
             * @param {string} url
             * @return {undefined}
             */
            rs.getUrl = function(url) {
                rs.url = url;
            };

            /**
             * getPollResult
             * ajax request to for results
             *
             * @return {undefined}
             */
            rs.getPollResult = function() {
                rs.errors.exists = true;
                return $http.get('/poll/' + rs.url + '/results')
                    .then(function(response) {
                        if (response.data.error) {
                            rs.errors.exists = false;
                            return;
                        }
                        rs.poll.question = response.data.question;
                        rs.poll.choices = response.data.choices;
                        //console.log('choices', response.data.choices);
                        rs.poll.total = rs.totalVotes(rs.poll);
                        //console.log('poll', rs.poll);
                        return response;
                    });
            };

            /**
             * totalVotes
             * returns total number of votes
             *
             * @param {object} data
             * @return {integer}
             */
            rs.totalVotes = function(data) {
                return data.choices.reduce(function(pv, cv) {
                    return pv + cv.vote;
                }, 0);
            };
        }]);
}());
