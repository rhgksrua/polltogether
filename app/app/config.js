'use strict';


/**
 * pollApp config
 *
 * @return {undefined}
 */
angular.module('pollApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('tokenInjector');
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
