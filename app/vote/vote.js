// poll vote
'use strict';

angular.module('pollApp.pollVote', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vote/:id', {
            templateUrl: 'vote/vote.html',
            controller: 'pollVoteCtrl',
            controllerAs: 'vc'
        });
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams', "$location", '$modal', function(voteService, $routeParams, $location, $modal) {
        var vc = this;

        // holds user choice
        vc.choice = undefined;
        
        // url or id
        vc.id = $routeParams.id;

        // status mesasge on modal
        vc.status = 'Waiting for response...';

        // vote success/fail status
        vc.failed = false;

        // Set url for ajax request
        voteService.setId(vc.id);

        // get poll data
        voteService.getPoll().then(function(response) {
            console.log('ajax success');
            console.log(response);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            vc.poll = response.data;
            vc.getError = false;
        }).then(null, function(response) {
            console.log('something wrong', response);
            vc.getError = true;
        });
        
        /**
         * toggleChoice
         * sets current choice
         *
         * @param {integer} choice
         * @return {undefined}
         */
        vc.toggleChoice = function(choice) {
            vc.choice = choice;
        };

        /**
         * submitVote
         * submits vote to server via ajax
         * fails without a valid choice
         *
         * @return {undefined}
         */
        vc.submitVote = function() {
            //vc.failed = false;
            if (vc.choice === undefined) {
                vc.failed = true;
                vc.status = 'Need to pick one';
                vc.open();
            } else if (vc.choice !== undefined) {
                voteService.submitVote({id: vc.id, choice: vc.choice})
                    .then(function(response) {
                        console.log(response.data.error);
                        if (response.data.error) {
                            vc.status = response.data.error;
                            throw new Error(response.data.error);
                        }
                        // success
                        vc.status = 'Vote submitted!';
                        vc.failed = false;
                        vc.submitted = true;
                        vc.open();
                    }).then(null, function(response) {
                        // failed
                        if (!vc.status) {
                            vc.status = 'Vote submission failed';
                        }
                        vc.failed = true;
                        vc.open();
                    });
            }
        };

        /**
         * resultsPage
         * 
         * show results page
         *
         * @return {undefined}
         */
        vc.resultsPage = function(){
            var page = "/vote/" + vc.id + "/results";
            $location.path(page);
        };

        vc.open = function(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'vote/voteModalContent.html',
                controller: 'modalInstanceCtrl',
                constollerAs: 'mi',
                size: size,
                resolve: {
                    items: function() {
                        return {
                            failed: vc.failed,
                            status: vc.status,
                            id: vc.id
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log('selectedItem: ', selectedItem);
            });
        };
    }]);
