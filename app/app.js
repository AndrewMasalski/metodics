angular.module('Methods', ['ui.router', 'ngCookies', 'angularModalService', 'ngSanitize', 'ngToast', 'angularModalService', 'ngAnimate'])
    .config(function($stateProvider, $urlRouterProvider, ngToastProvider) {
        $urlRouterProvider.otherwise("/dashboard");
        ngToastProvider.configure({
            animation: 'slide' // or 'fade'
        });

        console.log('app.config');
        $stateProvider
            .state('auth', {
                url: "/auth",
                templateUrl: "partials/auth.html",
                data: {requireLogin: false},
                controller: 'mainCtrl'
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "partials/dashboard.html",
                data: {requireLogin: true},
                controller: 'dashboardCtrl'
            })
            .state('users', {
                url: "/users/:username",
                templateUrl: "partials/users.html",
                data: {requireLogin: true},
                controller: 'usersCtrl'
            })
            .state('groups', {
                url: "/groups",
                templateUrl: "partials/groups.html",
                data: {requireLogin: true},
                controller: 'groupsCtrl'
            })
            .state('tags', {
                url: "/tags",
                templateUrl: "partials/tags.html",
                data: {requireLogin: true},
                controller: 'tagsCtrl'
            })
    })
    .run(function($rootScope, auth, $state) {
        console.log("app.run");
        $rootScope.isAppStarted = false;

        $rootScope.$on("$stateChangeStart",
            function(event, toState, toParams, fromState, fromParams) {
                if ((toState.data || {}).requireLogin && !auth.authenticated()) {
                    event.preventDefault();
                    $state.transitionTo('auth');
                }
            });

    })
    .directive('mEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                let key = typeof event.which === "undefined" ? event.keyCode : event.which;
                if(key === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.mEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });