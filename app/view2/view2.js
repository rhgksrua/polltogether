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

        var observerCallbacks = [];

        /**
         * registerCallback
         * registers callback function for observers
         *
         * @param {function} callback
         * @return {undefined}
         */
        poll.registerCallback = function(callback) {
            observerCallbacks.push(callback);
        };

        /**
         * notifyObservers
         * executes callback where needed.
         *
         * @return {undefined}
         */
        var notifyObservers = function() {
            angular.forEach(observerCallbacks, function(callback) {
                callback();
            });
        };

        /**
         * getPoll
         * ajax request to server api
         *
         * @return {undefined}
         */
        poll.getPoll = function() {
            $http.get('/poll/' + id)
                .then(function(response) {
                    poll.poll = response.data;
                    notifyObservers();
                }, function(response) {
                    poll.poll = 'test';
                    notifyObservers();
                    console.log('ajax error');
                });
        };

        /**
         * submitVote
         * submits user vote via ajax
         *
         * @param {object} vote
         * @return {undefined}
         */
        poll.submitVote = function(vote) {
            $http.post('/poll/vote/submit', vote)
                .then(function(response) {
                    console.log('ajax successful');
                }, function(response) {
                    console.log('post ajax error');
                });
        };
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams', function(voteService, $routeParams) {
        var vc = this;
        vc.choice = undefined;
        vc.id = $routeParams.id;

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

        // adding callback function to listen for ajax response object.
        voteService.registerCallback(updatePolls);

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
         *
         * @return {undefined}
         */
        vc.submitVote = function() {
            console.log('id choice', vc.id, vc.choice);
            voteService.submitVote({id: vc.id, choice: vc.choice});
        };
}]);
