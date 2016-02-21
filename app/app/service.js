'use strict';

angular.module('pollApp')
    .service('tokenService', ['$window', function($window) {
        var ts = this;
        var store = $window.localStorage;
        var key = 'auth-token';

        ts.removeToken = function() {
            store.removeItem(key);
        };

        ts.setToken = function(token) {
            if (token) {
                store.setItem(key, token);
            } else {
                store.removeItem(key);
            }
        };

        ts.getToken = function() {
            return store.getItem(key);
        };

        ts.flashMessage = function(msg) {
        };
        
    }])
    .service('userService', ['$http','tokenService', function($http, tokenService) {
        var us = this;

        /**
         * logOut - logs out user
         * 
         * tells server to destroy session
         *
         * @return {undefined}
         */
        us.logOut = function() {
            return $http.post('/logout')
                .then(function(response) {
                    return response;
                });
        };

        /**
         * getEmail - get user info
         *
         * gets username and email from server based on jwt token
         *
         * @return {undefined}
         *
         * NOTE: need to change the name
         */
        us.getEmail = function(){
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
        };
    }]);
