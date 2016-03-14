(function(){
'use strict';

angular.module('pollApp')
    .factory('tokenInjector', ['$window', function($window) {
        var tokenInjector = {
            request: function(config) {
                var token = $window.localStorage['auth-token'];
                if (token) {
                    config.headers.authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
        return tokenInjector;
    }]);
})();
