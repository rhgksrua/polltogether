// poll vote
'use strict';

angular.module('pollApp.pollVote', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vote/:id', {
            templateUrl: 'view2/view2.html',
            controller: 'pollVoteCtrl',
            controllerAs: 'vc'
        });
    }])
    .service('voteService', ['$http', function($http) {
        var poll = this;
        poll.status = 'Waiting for response...';
        poll.failed = false;
        poll.getError = false;

        /**
         * setId
         * url to get poll id for ajax request
         *
         * @param id
         * @return {undefined}
         */
        poll.setId = function(id) {
            poll.id = id;
        };

        // container for observer
        var observerCallbacks = {};

        /**
         * registerCallback
         * registers callback function for observers
         *
         * @param {string} name of group to notify
         * @param {function} callback
         * @return {undefined}
         */
        poll.registerCallback = function(name, callback) {
            if (observerCallbacks[name]) {
                observerCallbacks[name].push(callback);
            } else {
                observerCallbacks[name] = [];
                observerCallbacks[name].push(callback);
            }
        };

        /**
         * notifyObservers
         * executes callback where needed.
         * 
         * @param  {string} name
         * @return {undefined}
         */
        var notifyObservers = function(name) {
            angular.forEach(observerCallbacks[name], function(callback) {
                callback();
            });
        };

        /**
         * getPoll
         * ajax request to server api to get poll
         *
         * @return {undefined}
         */
        poll.getPoll = function() {
            return $http.get('/poll/' + poll.id)
                .then(function(response) {
                    return response;
                });
        };

        /**
         * submitVote
         * ajax request to server api to submit vote
         *
         * @param {object} vote
         * @return {undefined}
         */
        poll.submitVote = function(vote) {
            console.log(vote);
            $http.post('/poll/vote/submit', vote)
                .then(function(response) {
                    if (response.data.error) {
                        // server error
                        console.log(response.data);
                        poll.failed = true;
                        poll.status = 'Vote Failed';
                        notifyObservers('submitVote');
                        return;
                    }
                    console.log('vote submit ajax successful');
                    poll.submitted = true;
                    poll.failed = false;
                    poll.status = 'Vote Submitted!';
                    notifyObservers('submitVote');
                }, function(response) {
                    // ajax fail
                    console.log('vote submit ajax error');
                    poll.failed = true;
                    poll.status = 'Vote Failed!';
                    notifyObservers('submitVote');
                });
        };
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams' ,"$location", function(voteService, $routeParams,$location) {
        var vc = this;
        vc.choice = undefined;
        vc.id = $routeParams.id;
        vc.status = 'Submitting...';
        vc.failed = false;

        // Set url for ajax request
        voteService.setId(vc.id);

        // get poll data
        voteService.getPoll().then(function(response) {
            console.log('ajax success');
            vc.poll = response.data;
        }).then(null, function(response) {
            console.log('something wrong', response);
        });
        
        /**
         * updatePolls
         * Observer callback function to update ajax response from service instance
         *
         * @return {undefined}
         */
        var updatePolls = function() {
            vc.poll = voteService.poll;
            vc.getError = voteService.getError;
        };

        /**
         * submitStatus
         * Update ajax status based on reponse
         *
         * @return {undefined}
         */
        var submitStatus = function() {
            console.log('setting new status');
            vc.submitted = voteService.submitted;
            vc.status = voteService.status;
            vc.failed = voteService.failed;
            if (vc.failed) {
                vc.error = 'Cannot submit vote at this time';
            }
        };

        // adding callback function to listen for ajax response object.
        voteService.registerCallback('getPoll', updatePolls);
        voteService.registerCallback('submitVote', submitStatus);
        
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
            } else if (vc.choice !== undefined) {
                voteService.submitVote({id: vc.id, choice: vc.choice});
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
    }]);
