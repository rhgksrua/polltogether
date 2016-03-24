(function(){
    'use strict';

    angular.module('pollApp.user', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/user/:user', {
                templateUrl: 'user/user.html',
                controller: 'userCtrl',
                controllerAs:'uc'
            });
        }])
        .controller('userCtrl', ["$location", "userPollService", "$routeParams" ,function($location, userPollService, $routeParams){
            var uc = this;

            var user = $routeParams.user;
            uc.user = user;

            userPollService.getPolls(user)
                .then(function(response) {
                    if (response.data.error) {
                        throw new Error(response.data.error);
                    }
                    if (response.data.polls.length > 0) {
                        // at least one poll found
                        uc.pollList = response.data.polls;
                    }
                    uc.owner = response.data.owner;
                    uc.twitter = response.data.twitter;
                    console.log(uc.owner, uc.twitter);
                    console.log(uc.owner && !uc.twitter);
                    return response;
                })
                .then(null, function(response) {

                });

            uc.removePoll = function(url, index) {
                userPollService.removePoll(url, uc.user)
                    .then(function(response) {
                        if (response.data.error) {
                            throw new Error(response.data.error);
                        }
                        console.log('server message:', response.data.message);
                        uc.pollList.splice(index, 1);
                        return response;
                    })
                    .then(null, function(response) {

                    });
            };
        }]);
})();

