(function(){
    'use strict';

    angular.module('pollApp.pollCreate', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'create/create.html',
                controller: 'pollCtrl',
                controllerAs:'pc'
            });
        }])
        .service('pollService', ['$http', '$window', function($http, $window) {
            var poll = this;
            var validate = function(Poll) {
                Poll.choices = Poll.choices.filter(function(el) {
                    console.log('el');
                    return el.name.length > 0;
                });
                return Poll;
            };
            poll.createPoll = function(Poll){
                Poll = validate(Poll);
                console.log('validated poll', Poll);

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
                        console.log('response email', response.data);
                        return response.data;
                    });

            };
        }])
        .controller('pollCtrl', ["$location", "pollService", '$window', '$scope', function($location, pollService, $window, $scope){
            var pc = this;
            pc.host = $location.host();
            pc.data = {choices: []};
            pc.data.choices.push({'id': 'choice0' , "vote": 0});
            pc.email = '';
           



            /*
            // check for jwt to get email address
            pc.checkJwt = function() {
                var token = $window.localStorage['auth-token'];
                if (token) {
                    console.log('jwt found');
                    return token;
                }
                console.log('jwt not found');
                return false;
            };
            var jwt = pc.checkJwt();
            if (jwt) {
                pollService.getEmail(jwt)
                    .then(function(response) {
                        pc.email = response;
                    }).then(null, function(response) {
                        console.log('error', response);
                        pc.serverError = true;
                        
                    });
            }
            */

            pc.submitNewPoll = function(){
                pollService.createPoll(pc.data)
                    .then(function(response) {
                        pc.voteUrl = '/#/vote/' + response.data;
                        console.log('submitted', response);
                        // NEED TO ADD SERVER FAILURE ERROR
                        if (response.data.error) {
                            pc.status = 'Server does not want your stupid poll right now';
                            throw new Error('SERVER ERROR');
                        }
                        pc.serverError = false;
                        pc.status = 'Your poll has been submitted';
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                        pc.serverError = true;
                    });


                //redirect using $location to generate unique url for retreving poll.
            };
            pc.addChoice = function(){
                var newItem = pc.data.choices.length;
                pc.data.choices.push({'id': 'choice' + newItem ,'vote':0});
                console.log(pc.data.choices);
            };

            pc.resetForm = function() {
                console.log('reset form');
                pc.data = {choices: [{'id': 'choice0' , "vote": 0}]};
            };
    }]);
})();

