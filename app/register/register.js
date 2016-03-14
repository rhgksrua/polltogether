(function() {
    'use strict';

    angular.module('pollApp.register', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/register', {
                templateUrl: 'register/register.html',
                controller: 'registerCtrl',
                controllerAs:'rc'
            });
        }])
        .controller('registerCtrl', ["registerService", '$location', 'tokenService', 'userService', '$route', '$scope', function(registerService, $location, tokenService, userService, $route, $scope){
            var rc = this;
            rc.user = {};
            $scope.share.email = '';

            if (tokenService.getToken()) {
                console.log('token found');
                $location.path('/');
                return;
            }

            /**
             * register - register users
             *
             * @param {object} user
             * @return {undefined}
             */
            rc.register = function(user) {
                registerService.register(user)
                    .then(function(response) {
                        // handle server side validation error
                        if (response.data.validationErrors) {
                            console.log(response.data.validationErrors);
                            rc.validationErrors = response.data.validationErrors;
                        }
                        return response;
                    })
                    .then(function(response) {
                        // handle data base error
                        if (response.data.error) {
                            throw new Error('SERVER ERROR');
                        } else if (response.data.exists) {
                            if (response.data.exists === 'email') {
                                rc.emailExists = true;
                            } else if (response.data.exists === 'username') {
                                rc.usernameExists = true;
                            }
                            throw new Error('email exists');
                        }

                        if (response.data.token) {
                            rc.emailExists = false;
                            console.log('registered');
                            console.log(response.data);
                            tokenService.setToken(response.data.token);
                            $scope.$emit('setEmail', response.data.email, response.data.username);
                            $scope.$emit('showMessage', 'registered!');
                            rc.registerSuccess = true;

                            $location.path('/');
                        }
                        
                        // redirect user to profile page
                        return response;
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });
            };
        }]);
})();

