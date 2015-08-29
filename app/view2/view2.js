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
        var id = "pollid";
        poll.getPoll = function() {
            $http.get('/poll/' + id)
                .then(function(response) {
                    poll.poll = response.data;
                }, function(response) {
                    console.log('ajax error');
                });
        };
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams', function(voteService, $routeParams) {
        var vc = this;
        vc.choice = 0;
        vc.id = $routeParams.id;
        vc.poll = {
            'id': 'alfekjawe',
            'user': null,
            'question': 'favorite animal',
            'choices': [
                { id: 'choice0', name: 'dog' },
                { id: 'choice1', name: 'cat' },
                { id: 'choice2', name: 'cow' }
            ]
        };
        voteService.getPoll();

        vc.toggleChoice = function(choice) {
            vc.choice = choice;
        };

        vc.submitVote = function() {
            
            console.log(vc.id, vc.choice);


        };
}]);
