angular.module('Methods')
    .controller('dashboardCtrl', function($scope, $stateParams, ModalService, api, $q, block) {
        $scope.filterState = {
            group: $stateParams.group,
            tags: []
        };

        $scope.methods = [];
        $scope.groups = [];
        $scope.tags = [];
        $scope.newMethod = {};
        $scope.next = undefined;
        $scope.busy = true;

        block.toggle();
        api.loadAll()
            .then(function(res) {
                $scope.methods = res.methods;
                $scope.groups = res.groups;
                $scope.tags = res.tags;
                $scope.next = res.next;
                let tagFromParam = _.find(res.tags, {_id: $stateParams.tag});
                if (tagFromParam) {
                    $scope.filterState.tags.push(tagFromParam);
                }
                block.toggle();
                $scope.busy = false;
            })
            .catch(onError);

        function ask(action, data, cb) {
            let modalOptions = {
                templateUrl: 'partials/methodDetails.html',
                controller: "methodDetailsController",
                inputs: {
                    action: action,
                    method: data,
                    groups: $scope.groups,
                    tags: $scope.tags
                }
            };
            ModalService.showModal(modalOptions)
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            cb(result).catch(onError)
                        }
                    });
                })
        }

        $scope.nextPage = function() {
            if ($scope.next === undefined) return;

            $scope.busy = true;
            api.methods.next($scope.next)
                .then(function(res) {
                    angular.forEach(res.results, function(method) {
                        $scope.methods.push(method);
                    });
                    $scope.next = res.$next;
                    $scope.busy = false;
                })
                .catch(function(err) {
                    $scope.next = undefined;
                    console.log(err);
                    $scope.error = err;
                })
        };

        $scope.create = function() {
            $scope.error = undefined;
            ask('Создать', undefined, api.methods.add);
        };

        $scope.edit = function(method) {
            $scope.error = undefined;
            let clone = angular.copy(method);
            ask('Редактировать', clone, api.methods.save);
        };

        $scope.delete = function(method) {
            $scope.error = undefined;
            ask('Удалить', method, api.methods.delete);
        };

        $scope.addTagFilter = function(tag) {
            $scope.filterState.tags.push(tag);
        };

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }

    });