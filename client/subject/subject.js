/**
 * Created by Administrator on 2015/7/15.
 */
angular
    .module('mean')
    .controller('AddCourse',AddCourse)

AddCourse.$inject=['$http'];

function AddCourse($http){
    var addcourse=this;

    addcourse.courses = [];
    addcourse.scourses=[];
    addcourse.majors=[];
    addcourse.subjectname=[];
    addcourse.suit=false;
    addcourse.terms=[];


    //addcourse.belongto='';
    //addcourse.name='';

    addcourse.getSubjects=getSubjects;
    addcourse.addSubject=addSubject;
    addcourse.suitSubject=suitSubject;
    addcourse.getTeachers=getTeachers;
    //addcourse.test=test;

    initTerms();
    getSubjects();


    //init terms
    function initTerms(){
        for(var i= 0;i<40;i++){
            if (i%2==0)
                addcourse.terms[i]=(i/2+2000)*10+1;
            else
                addcourse.terms[i]=((i-1)/2+2000)*10+2;
        }
    }

    function getSubjects(){
        $http
            .get('/subject/subject')
            .success(function(items){
                console.log(items);
                addcourse.courses=items;
                var i;
                for(i in items){
                    if(addcourse.majors.indexOf(items[i].major)==-1){
                        //console.log(item);
                        addcourse.majors.push(items[i].major);
                    }

                    if(addcourse.subjectname.indexOf(items[i].name)==-1){
                        addcourse.subjectname.push(items[i].name);
                    }
                    console.log(addcourse.subjectname);
                }

            })
            .error(function(){
                alert('error');
            });
    }

    function addSubject(){
        console.log(addcourse.teacher.name);

        if(typeof addcourse.sname !='undefined'&&typeof addcourse.snumber !='undefined'&&typeof addcourse.teacher !='undefined'&&
            typeof addcourse.point !='undefined'&&typeof addcourse.term !='undefined'&& addcourse.suitsubject !='undefined') {
            $http
                .post('/subject/subject', {
                    sname: addcourse.sname,
                    snumber: addcourse.snumber,
                    teacherid: addcourse.teacher.username,
                    teacher:addcourse.teacher.name,
                    point: addcourse.point,
                    term: addcourse.term,
                    cid: addcourse.suitsubject
                })
                .success(function(){
                    alert('Successful inert a course!');
                })
                .error(function(){
                    alert('add fails!')
                })
        }
        else{
            alert('Sorry ! your information are not complete.please edit again.')
        }

    }

    function getTeachers(){
        $http
            .get('subject/subject'+addcourse.belongto)
            .success(function(teachers){
               addcourse.teachers=teachers;
            })
            .error(function(){
                console.log('get the information of teacher failed!');
            })
    };

    //belongto and name need to judge
    //function test(){console.log(this.belongto.belongto);}

    function suitSubject(){
        //  console.log(addcourse.suitsubject);
        addcourse.scourses=[];
        var temp;
        if(typeof(addcourse.belongto) == 'undefined'&&typeof (addcourse.namesuit)=='undefined'){
            //wait me to complete it
        }
        else{
            //console.log(addcourse.belongto);
            for(var i=0;i<addcourse.courses.length;i++){
                temp=addcourse.courses[i];
                if(temp.major==addcourse.belongto&&temp.name==addcourse.namesuit){
                    //console.log(temp);
                    addcourse.scourses.push(temp);
                }
            }
            getTeachers();
            addcourse.suit=true;
        }
    }
}


