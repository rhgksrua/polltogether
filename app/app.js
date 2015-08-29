'use strict';

// Declare app level module which depends on views, and components
angular.module('pollApp', [
  'ngRoute',
  'pollApp.pollCreate',
  'pollApp.pollVote',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/create'});
}]);
