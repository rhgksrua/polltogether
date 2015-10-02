'use strict';

/**
 * Modal
 *
 * @return {undefined}
 */
angular.module('pollApp.pollCreate')
    .controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
        $scope.items = items;
        
        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }]);
