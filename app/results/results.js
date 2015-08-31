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
            rs.poll = {
                question: null,
                choices: []
            };
            rs.getUrl = function(url) {
                rs.url = url;
            };
            rs.getPollResult = function() {
                $http.post('/poll/' + rs.url + '/results')
                    .then(function(response) {
                       // console.log(response.data);
                        rs.poll = response.data;
                        console.log(rs.poll);
                        rs.poll.total = totalVotes(rs.poll);
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function(response) {
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
                        console.log('ajax error');
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        rs.poll.question = temp.question;
                        rs.poll.choices = temp.choices;
                        rs.poll.total = rs.totalVotes(rs.poll);
                    });
            };
            rs.totalVotes = function(data) {
                return data.choices.reduce(function(pv, cv) {
                    return pv + cv.vote;
                }, 0);
            };
        }])
        .controller('resultCtrl', ["$location", "resultService" ,function($location, resultService){
            var rc = this;
            rc.poll = resultService.poll;
            resultService.getPollResult();

        }]);
})();

