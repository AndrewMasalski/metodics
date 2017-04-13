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

        block.toggle();
        api.loadAll()
            .then(function(res) {
                $scope.methods = res.methods;
                $scope.groups = res.groups;
                $scope.tags = res.tags;
                block.toggle();
            })
            .catch(onError);

        function ask(action, data, callback) {
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
                            callback(result).catch(onError)
                        }
                    });
                })
        }

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