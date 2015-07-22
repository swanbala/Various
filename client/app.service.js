/**
 * Created by seal on 7/3/15.
 */
angular
    .module('mean')
    .factory('userService', userService);

userService.$inject = ['$http', '$q'];

/* @ngInject */
function userService($http, $q) {
    var service = {
        logged: false,
        login: login,
        logout: logout,
        name: null
    };

    function login(username, password) {
        return $q(function(resolve, reject) {
            console.log(username);
            console.log(password);
            $http.post('/user/login', {
                username: username,
                password: password
            }).success(function() {
                service.logged = true;
                service.name = username;
                console.log(username);
                resolve('success');
            }).error(function() {
                reject('failure');
            });
        });
    }

    function logout() {
        service.logged = false;
    }

    return service;
}
