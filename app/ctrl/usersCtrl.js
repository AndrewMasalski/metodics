angular.module('Methods')
    .controller('usersCtrl', function($scope, $http, $state, auth) {
        console.log($state.params.username);
        $scope.user = auth.getUser();

    });