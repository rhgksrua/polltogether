(function(){
    'use strict';

    angular.module('pollApp.pollCreate', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'view1/view1.html',
                controller: 'pollCtrl',
                controllerAs:'pc'
            });
        }])
        .service('pollService', ['$http', '$window', function($http, $window) {
            var poll = this;
            poll.ob = {uniqueId: 0};
            console.log("angular service");
            poll.createPoll = function(Poll){
                //Ajax post poll to back end
                console.dir(Poll);
                $http.post('/poll/submit', Poll)
                    .then(function(response) {
                       // console.log(response.data);
                        poll.ob.uniqueId = response.data;
                        console.log(poll.ob.uniqueId);
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function(response) {
                        console.log('ajax error');
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            };
        }])
        .controller('pollCtrl', ["$location", "pollService" ,function($location, pollService){
           // console.log("ctrler loaded successfully")

            var pc = this;
            pc.page=$location.host();
            pc.data = {choices: []};
            pc.ob = {};
            pc.test = "firstTest";
            pc.data.choices.push({'id': 'choice0' , "vote":0});
            //console.log(pc.data.choices)
            pc.ob = pollService.ob;

            pc.submitNewPoll = function(){
                console.log("submtting for ajax");
                pollService.createPoll(pc.data);
                //redirect using $location to generate unique url for retreving poll.
            };
            pc.addChoice = function(){
                var newItem = pc.data.choices.length;
                pc.data.choices.push({'id': 'choice' + newItem ,'vote':0});
                console.log(pc.data.choices);
            };
    }]);
})();

