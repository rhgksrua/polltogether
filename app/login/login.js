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
        .service('loginService', ['$http', '$window', function($http, $window) {
            var poll = this;
            poll.login = function(User){
                console.log('user: ', User);
                //Ajax post poll to back end
                return $http.post('/login', User)
                    .then(function(response) {
                        // do stuff with response here
                        return response;
                    });
            };
        }])
        .controller('loginCtrl', ["loginService", '$location', 'tokenService', 'userService', '$route', '$scope', function(loginService, $location, tokenService, userService, $route, $scope){

            var lc = this;

            // This page is not available to logged in user
            if (tokenService.getToken()) {
                $location.path('/');
                return;
            }

            console.log($scope.share);


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

