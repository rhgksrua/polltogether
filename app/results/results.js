(function() {
    'use strict';

    angular.module('pollApp.pollResult', ['ngRoute','ngAnimate','ngMessages', 'chart.js'])

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
        }])
        .controller('resultCtrl', ["$location", "resultService", "$routeParams" ,function($location, resultService, $routeParams){
            var rc = this;
            var chart;

            /**
             * toChart
             *
             * @param chart
             * @returns {undefined}
             */
            var toChart = function(choices) {
                var labels = [];
                var data = [];
                choices.forEach(function(el) {
                    console.log('el', el);
                    labels.push(el.name);
                    data.push(el.vote);
                });
                return {
                    labels: labels,
                    data: data,
                    series: []
                };
            };

            rc.errors = resultService.errors;
            resultService.getUrl($routeParams.id);
            rc.poll = resultService.poll;

            resultService.getPollResult()
                .then(function(response) {
                    console.log(response.data);
                    return response;
                })
                .then(function(response) {
                    rc.chart = toChart(rc.poll.choices);
                    console.log('chart', rc.chart);
                    return response;
                });

        }]);
})();

