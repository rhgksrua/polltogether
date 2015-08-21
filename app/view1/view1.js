(function(){
    'use strict';

    angular.module('myApp.view1', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/view1', {
                templateUrl: 'view1/view1.html',
                controller: 'View1Ctrl'
            });
        }])

        .service('pollService', ['$http','$window',function($http,$window) {
            var poll=this;
            poll.uniqueId;
            poll.createPoll=function(Poll){
                //Ajax post poll to back end
                console.dir(Poll)
            }
            poll.resultsCallBack=function(data){
                //call back after posting result to backend
                console.dir(data);
                poll.results=data;

            }



        }])
    .$controller('pollCtrl',["$location","pollService" ,function($location,pollService){

            var pollCtrl=this;
            pollCtrl.uniqueId=pollService.uniqueId;

            pollCtrl.submitNewPoll=function(Poll){
                pollService.createPoll(Poll);
                //redirect using $location to generate unique url for retreving poll.
            }






    }])

})()