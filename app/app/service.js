(function() {
    'use strict';

    angular.module('pollApp')
        .service('tokenService', ['$window', function($window) {
            var ts = this;
            var store = $window.localStorage;
            var key = 'auth-token';

            ts.removeToken = removeToken;
            ts.setToken = setToken;
            ts.getToken = getToken;

            /**
             * setToken: sets token to localstorage
             *
             * @param token
             * 
             * @returns {undefined}
             */
            function setToken(token) {
                if (token) {
                    store.setItem(key, token);
                } else {
                    store.removeItem(key);
                }
            }

            /**
             * getToken: retreive token from localstorage
             *
             * @returns {undefined}
             */
            function getToken() {
                return store.getItem(key);
            }
            
            /**
             * removeToken: remove token from localstorage
             *
             * @returns {undefined}
             */
            function removeToken() {
                store.removeItem(key);
            }
        }])
        .service('userService', ['$http','tokenService', function($http, tokenService) {
            var us = this;

            us.logOut = logOut;
            us.getEmail = getEmail;

            /**
             * logOut - logs out user
             * 
             * tells server to destroy session
             *
             * @return {undefined}
             */
            function logOut() {
                return $http.post('/logout')
                    .then(function(response) {
                        return response;
                    });
            }

            /**
             * getEmail - get user info
             *
             * gets username and email from server based on jwt token
             *
             * @return {undefined}
             *
             * NOTE: need to change the name
             */
            function getEmail(){
                return $http.get('/userinfo')
                    .then(function(response) {
                        if (response.data.error) {
                            if (response.data.revoke) {
                                tokenService.removeToken();
                            }
                            throw new Error(response.data.error);
                        }
                        return response;
                    });
            }
        }]);
})();
