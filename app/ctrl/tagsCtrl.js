angular.module('Methods')
    .controller('tagsCtrl', function($scope, api) {
        $scope.tags = {};

        api.tags.all()
            .then(function(methods) {
                $scope.tags = methods;
            })
            .catch(onError);

        function onError(err) {
            $scope.error = err;
        }
    });