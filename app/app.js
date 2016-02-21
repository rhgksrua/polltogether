'use strict';
// test test

// Declare app level module which depends on views, and components
angular.module('pollApp', [
        'ngRoute',
        'pollApp.pollCreate',
        'pollApp.pollVote',
        'pollApp.pollResult',
        'pollApp.register',
        'pollApp.login',
        'pollApp.user'
    ])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('tokenInjector');
        $routeProvider.otherwise({redirectTo: '/create'});
    }])
    .controller('indexController', ['userService', 'tokenService', '$scope', '$timeout', '$location', '$route', function(userService, tokenService, $scope, $timeout, $location, $route) {
        var ic = this;

        $scope.share = {
            email: '',
            username: '',
            extra: 'nothing here'
        };

        ic.logout = function() {
            tokenService.removeToken();
            userService.logOut()
                .then(function(response) {
                    if (response.data.error) {
                        throw new Error(response.data.error);
                    }
                    console.log(response.data);
                    return response;
                })
                .then(null, function(response) {
                    console.log(response.data);
                });
            $scope.share.email = '';
            $scope.share.username = '';
            ic.loggedOut = true;
            $scope.$emit('showMessage', 'logged out');
            $location.path('/');

        };

        if (tokenService.getToken()) {
            userService.getEmail()
                .then(function(response) {
                    $scope.share.email = response.data.email;
                    $scope.share.username = response.data.username;
                }).
                then(null, function(response) {

                });
        }

        /**
         * Listens for email from ajax request 
         *
         * @return {undefined}
         */
        $scope.$on('setEmail', function(event, email, username) {
            $scope.share.email = email;
            $scope.share.username = username;
        });

        $scope.$on('showMessage', function(event, message) {
            if (!message) {
                console.log('showMessage needs message');
                return;
            }
            $scope.message = message || '';
            ic.showMessage = true;
            $timeout(function() {
                ic.showMessage = false;
                ic.message = '';
            }, 3000);
        });
        
        // Contains user info
    }]);
