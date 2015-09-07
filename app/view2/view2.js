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
            return $http.post('/poll/vote/submit', vote)
                .then(function(response) {
                    return response;
                });
        };
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams' ,"$location", function(voteService, $routeParams,$location) {
        var vc = this;

        // holds user choice
        vc.choice = undefined;
        
        // url or id
        vc.id = $routeParams.id;

        // status mesasge on modal
        vc.status = 'Submitting...';

        // vote success/fail status
        vc.failed = false;

        // Set url for ajax request
        voteService.setId(vc.id);

        // get poll data
        voteService.getPoll().then(function(response) {
            console.log('ajax success');
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
            } else if (vc.choice !== undefined) {
                voteService.submitVote({id: vc.id, choice: vc.choice})
                    .then(function(response) {
                        // success
                        vc.status = 'Vote submitted!';
                        vc.failed = false;
                        vc.submitted = true;
                    }).then(null, function(response) {
                        // failed
                        vc.failed = true;
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
    }]);
