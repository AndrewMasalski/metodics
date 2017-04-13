angular.module('Methods')
    .constant('host', 'http://localhost:3003/')
    .factory('EntitySet', function($http, host) {
        return function(name, domain) {
            domain = domain || 'api';
            const server = host + domain + '/';
            return {
                all: function(params) {
                    return $http.get(server + name, {params: params})
                        .then(function(response) {
                            return response.data.results;
                        });
                },
                add: function(method) {
                    return $http.post(server + name, method)
                        .then(function(response) {
                            return response.data;
                        });
                },
                save: function(method) {
                    return $http.put(server + name + '/' + method._id, method)
                        .then(function(response) {
                            return response.data;
                        });
                },
                delete: function(method) {
                    return $http.delete(server + name + '/' + method._id)
                        .then(function(response) {
                            return response.data;
                        });
                }
            }
        }
    })
    .service('api', function($http, $q, host, EntitySet) {
        this.users = new EntitySet('users', 'auth');
        this.methods = new EntitySet('methods');
        this.tags = new EntitySet('tags');
        this.groups = new EntitySet('groups');

        this.loadAll = function() {
            return $q.all([this.methods.all({skip: 0, top: 30}), this.groups.all(), this.tags.all()])
                .then(function(res) {
                    return {
                        methods: res[0] || [],
                        nexturl: res[0].$nexturl,
                        groups: res[1] || [],
                        tags: res[2] || []
                    }
                })
        };

        this.login = function(user) {
            return $http.post(host + 'auth/login', user)
                .then(function(response) {
                    return response.data;
                });
        };

        return this;
    });