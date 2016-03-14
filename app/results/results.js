(function() {
    'use strict';

    angular.module('pollApp.pollResult', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/vote/:id/results', {
                templateUrl: 'results/results.html',
                controller: 'resultCtrl',
                controllerAs:'rc'
            });
        }])
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
                $http.get('/poll/' + rs.url + '/results')
                    .then(function(response) {
                        if (response.data.error) {
                            rs.errors.exists = false;
                            return;
                        }
                        rs.poll.question = response.data.question;
                        rs.poll.choices = response.data.choices;
                        console.log(rs.poll);
                        rs.poll.total = rs.totalVotes(rs.poll);
                    }, function(response) {
                        console.log('ajax error');
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
        }])
        .controller('resultCtrl', ["$location", "resultService", "$routeParams" ,function($location, resultService, $routeParams){
            var rc = this;
            rc.errors = resultService.errors;
            resultService.getUrl($routeParams.id);
            rc.poll = resultService.poll;
            resultService.getPollResult();
        }]);
})();

