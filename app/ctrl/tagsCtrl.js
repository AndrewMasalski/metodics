angular.module('Methods')
    .controller('tagsCtrl', function($scope, api) {
        $scope.tags = {};

        api.getTags()
            .then(function(methods) {
                $scope.tags = methods;
            })
            .catch(onError);

        function onError(err) {
            $scope.error = err;
        }
    });