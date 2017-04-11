angular.module('Methods', ['ui.router', 'ngCookies', 'angularModalService', 'ngSanitize', 'ngAnimate', 'xeditable', 'ngTagsInput', 'ngTagCloud'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/dashboard");

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
    .run(function($rootScope, $state, auth, editableOptions, editableThemes) {
        console.log("app.run");
        editableOptions.theme = 'bs3';

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
    })
    .filter('mFilter', function () {
        return function (array, state) {
            if (state.code || state.description || state.group || state.type) {
                return array.filter(function(o){
                    let match = false;
                    for(let key in state) {
                        let filterValue = state[key];
                        if (!filterValue) continue;

                        let arrayValue = o[key];
                        if (_.has(arrayValue, '_id')) {
                            arrayValue = arrayValue._id;
                        }
                        if((arrayValue || '').toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) {
                            match = true;
                            break;
                        }
                    }
                    return match;

                });
            }
            return array;
        };
    })