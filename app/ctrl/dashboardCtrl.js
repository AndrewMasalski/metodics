angular.module('Methods')
    .controller('dashboardCtrl', function($scope, ModalService, api) {
        $scope.filterState = {};
        $scope.methods = [];
        $scope.groups = [];
        $scope.tags = [];
        $scope.filterByGroup = undefined;
        $scope.newMethod = {};

        Promise.all([api.methods.all(), api.groups.all()])
            .then(function(res) {
                $scope.methods = res[0] || [];
                $scope.groups = res[1] || [];
            })
            .catch(onError);

        function onError(err) {
            $scope.error = err;
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

        $scope.compare = function(a, b){
            console.log(a);
            console.log(b);
        }
    });