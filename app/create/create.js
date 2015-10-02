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
        .controller('pollCtrl', ["$location", "pollService", '$window', '$scope', '$modal', function($location, pollService, $window, $scope, $modal) {
            var pc = this;
            pc.host = $location.host();
            pc.data = {choices: []};
            pc.data.choices.push({'id': 'choice0' , "vote": 0});
            pc.email = '';

            /**
             * submitNewPoll - ajax request to server to create poll
             *
             * @return {undefined}
             */
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
            };
            /**
             * addChoice - add a choice to poll
             *
             * @return {undefined}
             */
            pc.addChoice = function(){
                var newItem = pc.data.choices.length;
                pc.data.choices.push({'id': 'choice' + newItem ,'vote':0});
                console.log(pc.data.choices);
            };

            /**
             * resetForm - clear form
             *
             * @return {undefined}
             */
            pc.resetForm = function() {
                console.log('reset form');
                pc.data = {choices: [{'id': 'choice0' , "vote": 0}]};
            };

            /**
             * removeChoice - remove a choice from poll
             *
             * @param index
             * @return {undefined}
             */
            pc.removeChoice = function(index) {
                console.log('removing choice');
                pc.data.choices.splice(index, 1);
            };

            /**
             * open - opens modal on submit
             *
             * @param size
             * @return {undefined}
             */
            pc.open = function(size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'create/modal/createModalContent.html',
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
        }]);
    })();

