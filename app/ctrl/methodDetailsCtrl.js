angular.module('Methods')
    .controller('methodDetailsController', function($scope, close, action, method, groups) {
        $scope.groups = groups;
        $scope.method = method || {};
        $scope.action = action;
        if ($scope.action === 'Delete') {
            $scope.readOnly = true;
        }
        $scope.close = function(result) {
            close(result, 333);
        };
    });