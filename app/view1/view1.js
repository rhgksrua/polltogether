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
            console.log("angular service");
            poll.createPoll=function(Poll){
                //Ajax post poll to back end
                console.dir(Poll);
                $http.post('/poll/submit', Poll).
                    then(function(response) {
                        console.log(response.data);
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function(response) {
                        console.log('ajax error');
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


            };
            poll.resultsCallBack=function(data){
                //call back after posting result to backend
               // console.dir(data);
                poll.results=data;

            };



        }])
        .controller('pollCtrl',["$location","pollService" ,function($location,pollService){
           // console.log("ctrler loaded successfully")

            var pc=this;
            pc.data={choices:[]};
            pc.test="firstTest";
            pc.data.choices.push({'id':'choice0'});
            //console.log(pc.data.choices)
            pc.uniqueId=pollService.uniqueId;

            pc.submitNewPoll=function(){
                console.log("submtting for ajax")
               // pollService.createPoll(pc.data);
                //redirect using $location to generate unique url for retreving poll.
            };


            pc.showLabel=function(choice){
                return choice.id===pc.data.choices[pc.data.choices.length-1].id;
            };
            pc.addChoice=function(){
                var newItem=pc.data.choices.length;
                pc.data.choices.push({'id':'choice'+newItem});
                console.log(pc.data.choices);
            };
    }]);

})();
