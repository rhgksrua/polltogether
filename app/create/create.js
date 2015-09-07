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
            poll.createPoll = function(Poll){
                //Ajax post poll to back end
                return $http.post('/poll/submit', Poll)
                    .then(function(response) {
                        // do stuff with response here
                        return response;
                    });
            };
        }])
        .controller('pollCtrl', ["$location", "pollService" ,function($location, pollService){
            var pc = this;
            pc.host = $location.host();
            pc.data = {choices: []};
            pc.data.choices.push({'id': 'choice0' , "vote": 0});

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
    }]);
})();

