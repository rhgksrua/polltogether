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
        .controller('loginCtrl', ["loginService", '$location', 'tokenService', function(loginService, $location, tokenService){
            var lc = this;

            console.log('login screen');
            lc.user = {};
            lc.login = function(user) {
                console.log('--- user:', user);
                loginService.login(user)
                    .then(function(response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            throw new Error('SERVER ERROR');
                        }
                        console.log('logged in');
                        console.log(response.data);
                        tokenService.setToken(response.data.token);
                        $location.path('/');
                        // redirect user to profile page

                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });
            };

        }]);
})();

