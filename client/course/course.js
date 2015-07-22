/**
 * Created by seal on 7/4/15.
 */

angular
    .module('mean')
    .controller('CourseController', CourseController)

CourseController.$inject = ['$http'];
/*SubjectSelect.$inject=['$scope'];*/

/*get information to <select>*/

/* @ngInject */
function CourseController($http) {
    /* jshint validthis: true */
    var course = this;
    course.items = [];
    course.item = {};
    course.getAll = getAll;
    course.remove = remove;
    course.edit = edit;
    course.save = save;
    course.cancel = cancel;

    getAll();

    function getAll() {
        $http.get('/courses')
            .success(function(items){
                course.items = items;
                //for (var i = 0; i < items.length; i++) {
                //    course.items[i].endtime = new Date(items[i].endtime);
                //}
            })
            .error(function(){
                console.log('get error');
            })
    }

    function getTeachers(major){
        $http.get('/subject/subject'+major)
            .success(function(teachers){
                console.log(teachers);
                course.teachers=teachers;
            })
            .error(function(){
                console.log('get teachers failed!');
            })
    }

    function remove(id){
        $http.delete('/courses/'+id)
            .success(function(){
                console.log('success');
                getAll();
            })
            .error(function(){
                console.log('error');
            });
    }


    function edit(item){
        getTeachers(item.belongto);
        course.number = item.number;
        course.name=item.name;
        course.teacher=item.teacher;
        course.point=item.point;
        course.term=item.term;
        $('#courseModal').modal();
    }

    function save(id) {
        $http.put('/courses/'+id, {
            name: course.name,
            teacher:course.teacher.name,
            teacherid:course.teacher.username,
            number:course.number,
            point:course.point,
            term:course.term,
        }).success(function(){
            getAll();
            $('#courseModal').modal('hide');
        }).error(function(){
            console.log('save error');
        });
    }

    function cancel() {
        $('#courseModal').modal('hide');

        course.name ='';
        course.teacher='';
        course.number='';
        course.point='';
        course.term='';
   }
}