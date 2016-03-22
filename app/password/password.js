(function() {
    'use strict';

    angular.module('pollApp.userPassword', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/user/:user/password', {
                templateUrl: 'password/password.html',
                controller: 'passwordCtrl',
                controllerAs:'pc'
            });
        }])
        //.service('passwordService', ['$http', '$window', function($http, $window) {
        //    var ps = this;
        //}])
        .controller('passwordCtrl', ["$location", "passwordService", "$routeParams", "userService", function($location, passwordService, $routeParams, userService){
            var pc = this;

            // user will contain username and new password
            pc.user = {};
            pc.error = false;

            var user = $routeParams.user;

            /**
             * check if user tries to change other user's password
             *
             * This is only client side validation. Server does another
             * validation with user name and password.
             */
            userService.getEmail()
                .then(function(response) {
                    if (response.data.error) {
                        // server error
                        throw new Error(response.data.error);
                    }
                    if (response.data.username === user) {
                        // user authenticated
                        pc.user.user = user;
                        return response;
                    }
                    pc.userError = true;
                })
                .then(null, function(response) {
                    // authenication failed
                    // show error alert
                    pc.userError = true;
                });

            /**
             * changePassword
             *
             * @return {undefined}
             */
            pc.changePassword = function(user) {
                passwordService.password(user)
                    .then(function(response) {
                        if (response.data.error) {
                            console.log('errors', response.data.error);
                            pc.error = 'error';
                            return response;
                        }
                        pc.success = true;
                        return response;
                    })
                    .then(null, function(response) {
                        pc.error = 'error';
                    });
            };
        }]);
})();

