angular.module('Methods')
    .controller('groupsCtrl', function($scope, api) {
        $scope.new = '';
        $scope.groups = [];

        api.getGroups()
            .then(function(groups) {
                $scope.groups = groups;
            })
            .catch(onError);

        $scope.add = function() {
            api.addGroup($scope.new)
                .then(function(res) {
                    $scope.new = '';
                    $scope.groups.push(res);
                })
        };

        function onError(err) {
            $scope.error = err;
        }
    });