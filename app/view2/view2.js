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

        // REMOVE when server api is works.
        var id = "pollid";

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
            $http.get('/poll/' + id)
                .then(function(response) {
                    poll.poll = response.data;
                    notifyObservers('getPoll');
                    console.log('poll ajax success');
                }, function(response) {
                    poll.poll = 'test';
                    notifyObservers('getPoll');
                    console.log('poll ajax fail');
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
            $http.post('/poll/vote/submit', vote)
                .then(function(response) {
                    console.log('vote submit ajax successful');
                    poll.failed = false;
                    poll.status = 'Vote Submitted!';
                    notifyObservers('submitVote');
                }, function(response) {
                    console.log('vote submit ajax error');
                    poll.failed = true;
                    poll.status = 'Vote Failed!';
                    notifyObservers('submitVote');
                });
        };
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams' , function(voteService, $routeParams) {
        var vc = this;
        vc.choice = undefined;
        vc.id = $routeParams.id;
        vc.status = 'Submitting...';
        vc.failed = false;

        voteService.setId(vc.id);
        
        /**
         * updatePolls
         * Observer callback function to update ajax response from service instance
         *
         * @return {undefined}
         */
        var updatePolls = function() {
            // need to change as soon as server api is implemented
            vc.test = voteService.poll;
        };

        /**
         * submitStatus
         * Update ajax status based on reponse
         *
         * @return {undefined}
         */
        var submitStatus = function() {
            console.log('setting new status');
            vc.status = voteService.status;
            vc.failed = voteService.failed;
            if (vc.failed) {
                vc.error = 'Cannot submit vote at this time';
            }
        };

        // adding callback function to listen for ajax response object.
        voteService.registerCallback('getPoll', updatePolls);
        voteService.registerCallback('submitVote', submitStatus);

        // temporary poll for testing.
        var temp = {
            'id': 'alfekjawe',
            'user': null,
            'question': 'favorite animal',
            'choices': [
                { id: 'choice0', name: 'dog' },
                { id: 'choice1', name: 'cat' },
                { id: 'choice2', name: 'cow' }
            ]
        };

        // Temporary poll for testing.  Remove as soon as server api is implemented.
        vc.poll = temp;

        // get poll data
        voteService.getPoll();
        
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
            vc.failed = false;
            if (vc.choice === undefined) {
                vc.failed = true;
                vc.status = 'Need to pick one';
            } else if (vc.choice !== undefined) {
                voteService.submitVote({id: vc.id, choice: vc.choice});
            }
        };
    }]);
