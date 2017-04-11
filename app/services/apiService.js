angular.module('Methods')
    .service('api', function($http) {
        const host = 'http://localhost:3003/';
        const server = host + 'api/';

        this.login = function(user) {
            return $http.post(host + 'auth/login', user)
                .then(function(response) {
                    return response.data;
                });
        };

        this.getMethods = function() {
            return $http.get(server + 'methods')
                .then(function(response) {
                    return response.data;
                });
        };
        this.addMethod = function(method) {
            return $http.post(server + 'methods', method)
                .then(function(response) {
                    return response.data;
                });
        };
        this.updateMethod = function(method) {
            return $http.put(server + 'methods/' + method._id, method)
                .then(function(response) {
                    return response.data;
                });
        };
        this.deleteMethod = function(method) {
            return $http.delete(server + 'methods/' + method._id)
                .then(function(response) {
                    return response.data;
                });
        };

        this.getTags = function() {
            return $http.get(server + 'tags')
                .then(function(response) {
                    return response.data;
                });
        };

        this.getGroups = function() {
            return $http.get(server + 'groups')
                .then(function(response) {
                    return response.data;
                });
        };

        this.addGroup = function(name) {
            return $http.post(server + 'groups', {name: name})
                .then(function(response) {
                    return response.data;
                });
        };

        this.updateGroup = function(group) {
            return $http.put(server + 'groups/' + group._id, group)
                .then(function(response) {
                    return response.data;
                });
        };

        this.deleteGroup = function(group) {
            return $http.delete(server + 'groups/' + group._id)
                .then(function(response) {
                    return response.data;
                });
        };


        return this;
    });