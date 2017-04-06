angular.module('Methods')
    .controller('dashboardCtrl', function($scope, ModalService, api) {
        $scope.methods = [];
        $scope.groups = [];
        $scope.filterByGroup = undefined;
        $scope.newMethod = {};

        Promise.all([api.getMethods(), api.getGroups()])
            .then(function(res) {
                $scope.methods = res[0] || [];
                $scope.groups = res[1] || [];
//                $scope.filterByGroup = $scope.groups[0]._id;
            })
            .catch(onError);

        function onError(err) {
            $scope.error = err;
        }

        function getGroupName(id) {
            let filtered = $scope.groups.filter(g => g._id === id);
            return filtered.length > 0 ? filtered[0] : '';
        }

        function ask(action, data, callback) {
            let modalOptions = {
                templateUrl: 'partials/methodDetails.html',
                controller: "methodDetailsController",
                inputs: {
                    action: action,
                    method: data,
                    groups: $scope.groups
                }
            };
            ModalService.showModal(modalOptions)
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            callback(result)
                        }
                    });
                })
        }

        $scope.create = function() {
            $scope.error = undefined;
            ask('Создать', undefined, api.addMethod);
        };

        $scope.edit = function(method) {
            $scope.error = undefined;
            let clone = angular.copy(method);
            ask('Редактировать', clone, api.updateMethod);
        };

        $scope.delete = function(method) {
            $scope.error = undefined;
            ask('Удалить', method, api.deleteMethod);
        };
    });