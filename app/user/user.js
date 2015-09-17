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
        .service('userPollService', ['$http', '$window', function($http, $window) {
            var us = this;

            us.getPolls = function(username) {
                return $http.post('/user/polls', {'username': username})
                    .then(function(response) {
                        return response;
                    });
            };

        }])
        .controller('userCtrl', ["$location", "userPollService", "$routeParams" ,function($location, userPollService, $routeParams){
            var uc = this;

            uc.pollList = [];

            var user = $routeParams.user;

            userPollService.getPolls(user)
                .then(function(response) {
                    console.log(response.data);
                    return response;
                })
                .then(null, function(response) {
                    
                });
            console.log(user);
        }]);
})();

