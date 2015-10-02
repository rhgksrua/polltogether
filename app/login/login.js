(function(){
    'use strict';

    angular.module('pollApp.login', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'login/login.html',
                controller: 'loginCtrl',
                controllerAs:'lc'
            });
        }])
        .controller('loginCtrl', ["loginService", '$location', 'tokenService', 'userService', '$route', '$scope', function(loginService, $location, tokenService, userService, $route, $scope){
            var lc = this;

            console.log('why!');

            // This page is not available to logged in user
            if (tokenService.getToken()) {
                $location.path('/');
                return;
            }

            lc.user = {};
            lc.login = function(user) {
                loginService.login(user)
                    .then(function(response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            lc.loginError = true;
                            throw new Error('login error');
                        }
                        lc.loginError = false;
                        tokenService.setToken(response.data.token);
                        $scope.$emit('showMessage', 'logged in');
                        $scope.$emit('setEmail', response.data.email, response.data.username);
                        $location.path('/create');
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });
            };
        }]);
})();

