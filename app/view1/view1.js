(function(){
    'use strict';

    angular.module('myApp.view1', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/view1', {
                templateUrl: 'view1/view1.html',
                controller: 'pollCtrl',
                controllerAs:'pc'
            });
        }])

        .service('pollService', ['$http','$window',function($http,$window) {
            var poll=this;
            poll.uniqueId;
            console.log("angular service")
            poll.createPoll=function(Poll){
                //Ajax post poll to back end
                console.dir(Poll)
            }
            poll.resultsCallBack=function(data){
                //call back after posting result to backend
               // console.dir(data);
                poll.results=data;

            }



        }])
        .controller('pollCtrl',["$location","pollService" ,function($location,pollService){
           // console.log("ctrler loaded successfully")

            var pc=this;
            pc.data={answers:[]};
            pc.test="firstTest"
            pc.data.answers.push({'id':'choice0'});
            //console.log(pc.data.answers)
            pc.uniqueId=pollService.uniqueId;

            pc.submitNewPoll=function(){
                pollService.createPoll(pc.data);
                //redirect using $location to generate unique url for retreving poll.
            }


            pc.showLabel=function(choice){
                return choice.id===pc.data.answers[pc.data.answers.length-1].id;
            }
            pc.addChoice=function(){
                var newItem=pc.data.answers.length;
                pc.data.answers.push({'id':'choice'+newItem})
                console.log(pc.data.answers)
            }
    }])

})()