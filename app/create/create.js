(function(){
    'use strict';

    angular.module('pollApp.pollCreate', ['ngRoute', 'ngAnimate', 'ngMessages', 'ui.bootstrap'])

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
                console.log(Poll.choices);
                Poll.choices = Poll.choices.filter(function(el) {
                    console.log('el', el);
                    return el.name && el.name.length > 0;
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
        .controller('pollCtrl', ["$location", "pollService", '$window', '$scope', '$modal', function($location, pollService, $window, $scope, $modal) {
            var pc = this;
            pc.host = $location.host();
            pc.data = {choices: []};
            pc.data.choices.push({'id': 'choice0' , "vote": 0});
            pc.email = '';

            pc.submitNewPoll = function(){
                console.log('submitting');
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
                        pc.open();
                    })
                    .then(null, function(response) {
                        console.log('error', response.data);
                        pc.serverError = true;
                        pc.open();
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

            pc.removeChoice = function(index) {
                console.log('removing choice');
                pc.data.choices.splice(index, 1);
            };

            pc.open = function(size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'create/createModalContent.html',
                    controller: 'modalInstanceCtrl',
                    constollerAs: 'mi',
                    size: size,
                    resolve: {
                        items: function() {
                            return {
                                serverError: pc.serverError,
                                status: pc.status,
                                voteUrl: pc.voteUrl,
                                host: pc.host
                            };
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log('selectedItem: ', selectedItem);
                });
            };
    }])
    .controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
        console.log('items from pc: ', items);
        $scope.items = items;
        
        $scope.ok = function() {
            console.log('trying to close');
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }]);
})();

