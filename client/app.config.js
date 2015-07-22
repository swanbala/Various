angular
    .module('mean')
    .config(routerConfig);


function routerConfig($urlRouterProvider, $stateProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('info', {
            url: '/info',
            templateUrl: 'info/info.html',
            controller: 'InfoController',
            controllerAs: 'info'
        })
        .state('home', {
            url: '/',
            templateUrl: 'home/home.html'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'about/about.html'
        })
        .state('course', {
            url: '/course',
            templateUrl: 'course/course.html',
            controller: 'CourseController',
            controllerAs: 'course'
        })
        .state('subject',{
            url:'/subject',
            templateUrl:'subject/subject.html',
            controller:'AddCourse',
            controllerAs:'Add'

        })
        .state('schedule',{
            url:'/schedule',
            templateUrl:'schedule/schedule.html',
            controller:'Schedule',
            controllerAs:'schedule'
        })

}

