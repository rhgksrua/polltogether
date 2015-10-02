'use strict';

angular.module('pollApp.register')
    .service('registerService', ['$http', '$window', function($http, $window) {
        var reg = this;
        var store = $window.localStorage;
        var key = 'auth-token';

        /**
         * sanitize - removes unwanted property from user oject
         *
         * @param {object} user
         * @return {undefined}
         */
        reg.sanitize = function(user) {
            var sanitizedUser = {
                username: user.username,
                email: user.email,
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
        reg.register = function(user){
            user = reg.sanitize(user);

            //Ajax post poll to back end
            return $http.post('/register', user)
                .then(function(response) {
                    
                    // do stuff with response here
                    return response;
                });
        };
    }]);
