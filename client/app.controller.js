/**
 * Created by seal on 7/3/15.
 */

angular
    .module('mean')
    .controller('NavController', NavController)
    .controller('UserController', UserController);

function NavController(userService) {
    var nav = this;

    nav.login = login;
    nav.signin = signin;
    nav.logout = logout;
    nav.userService = userService;

    function login() {
        $('#loginModal').modal();
    }

    function signin() {
        $('#signinModal').modal();
    }

    function logout() {
        userService.logout();
    }
}

function UserController(userService) {
    var user = this;

    user.username = '';
    user.password = '';
    user.userService = userService;
    user.login = login;
    user.signin = signin;

    function login() {
        userService
            .login(user.username, user.password)
            .then(function(){
                $('#loginModal').modal('hide');
                console.log('login success');
            }, function(){
                user.error = true;
                console.log('login failure');
            });
    }

    function signin() {
        console.log(user.username);
        console.log(user.password);
        $('#signinModal').modal('hide');
    }
}