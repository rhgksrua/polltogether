'use strict';

angular.module('pollApp.userPassword')
    .service('passwordService', ['$http', '$window', function($http, $window) {
        var pass = this;
        var store = $window.localStorage;
        var key = 'auth-token';

        /**
         * sanitize - removes unwanted property from user oject
         *
         * @param {object} user
         * @return {undefined}
         */
        pass.sanitize = function(user) {
            var sanitizedUser = {
                password: user.password
            };
            return sanitizedUser;
        };

        /**
         * register - ajax request to server
         *
         * @param user
         * @return {undefined}
         */
        pass.password = function(user){
            console.log('sending new pw to server...');
            user = pass.sanitize(user);

            //Ajax post poll to back end
            return $http.post('/user/password', user)
                .then(function(response) {
                    
                    // do stuff with response here
                    return response;
                });
        };
    }]);

