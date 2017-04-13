angular.module('Methods')
    .controller('tagsCtrl', function($scope, $state, api) {
        $scope.tags = [];
        $scope.new = '';

        api.tags.all()
            .then(function(tags) {
                $scope.tags = tags;
            })
            .catch(onError);


        $scope.add = function() {
            api.groups.add($scope.new)
                .then(function(res) {
                    $scope.new = '';
                    $scope.tags.push(res);
                })
        };

        $scope.save = function(tag, value) {
            if (tag.text === value) return true;

            const clone = _.clone(tag);
            clone.text = value;
            return api.tags.save(clone);
        };

        $scope.delete = function(tag) {
            api.tags.delete(tag)
                .then(function() {
                    _.remove($scope.tag, {_id: tag._id})
                })
        };

        function onError(err) {
            $scope.error = err;
        }
    });