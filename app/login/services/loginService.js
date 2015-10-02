'use strict';

angular.module('pollApp.login')
    .service('loginService', ['$http', '$window', function($http, $window) {
        var poll = this;
        poll.login = function(User){
            //Ajax post poll to back end
            return $http.post('/login', User)
                .then(function(response) {
                    // do stuff with response here
                    return response;
                });
        };
    }]);
