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

        $scope.save = function(group, value) {
            if (group.name === value) return true;

            const clone = _.clone(group);
            clone.name = value;
            return api.updateGroup(clone);
        };

        $scope.delete = function(group) {
            api.deleteGroup(group)
                .then(function() {
                    _.remove($scope.groups, {_id: group._id})
                })
        };

        function onError(err) {
            $scope.error = err;
        }
    });