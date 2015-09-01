(function(){
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
            rs.getUrl = function(url) {
                rs.url = url;
            };
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
                        /*
                        var temp = {
                            question: 'fav animal',
                            choices: [
                                {id: 'choice0', name: 'cat', vote: 4},
                                {id: 'choice1', name: 'dog', vote: 5},
                                {id: 'choice2', name: 'cow', vote: 2},
                                {id: 'choice3', name: 'horse', vote: 9},
                                {id: 'choice4', name: 'bird', vote: 3},
                            ]
                        };
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        rs.poll.question = temp.question;
                        rs.poll.choices = temp.choices;
                        rs.poll.total = rs.totalVotes(rs.poll);
                        */
                        console.log('ajax error');
                    });
            };
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

