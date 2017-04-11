angular.module('Methods')
    .controller('mainCtrl', function($scope, $rootScope, $http, $state, auth) {
        $scope.user = auth.getUser();

        $scope.login = function() {
            $scope.error = undefined;
            auth.signin($scope.user)
                .then(function() {
                    console.log('auth success');
                    $state.go('dashboard');
                })
                .catch(function(err) {
                    $scope.error = err.message || err.data.message;
                });
        };

        $scope.isLoggedIn = function() {
            return auth.authenticated();
        };

        $scope.logout = function() {
            auth.signout();
            $state.go('auth');
        };

    });