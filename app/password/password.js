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
        .service('passwordService', ['$http', '$window', function($http, $window) {
            var ps = this;
        }])
        .controller('passwordCtrl', ["$location", "passwordService", "$routeParams", "userService", function($location, passwordService, $routeParams, userService){
            var pc = this;

            // user will contain username and new password
            pc.user = {};
            pc.error = false;

            var user = $routeParams.user;

            userService.getEmail()
                .then(function(response) {
                    if (response.data.error) {
                        // server error
                        throw new Error(response.data.error);
                    }
                    if (response.data.username === user) {
                        // user authenticated
                        pc.error = false;
                        pc.user.user = user;
                        return response;
                    }
                    pc.error = true;
                })
                .then(null, function(response) {
                    // authenication failed
                    // show error alert
                    pc.error = true;
                });

            /**
             * changePassword
             *
             * @return {undefined}
             */
            pc.changePassword = function(user) {
                console.log('changing pw');
                console.log('user inputs', user);
                passwordService.password(user)
                    .then(function(response) {
                        if (response.data.errors) {
                            console.log(resopnse.data.validationErrors);
                        }
                        return response;
                    })
                    .then(function(response) {
                        if (response.data.error) {
                            throw new Error('SERVER ERROR');
                        } else if (response.data.exists) {
                            throw new Error('exists');
                        }
                        console.log('response', response);
                        return response;
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });

            };
        }]);
})();

