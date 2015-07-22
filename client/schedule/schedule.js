/**
 * Created by swan on 15-7-18.
 */

angular
    .module('mean')
    .controller('Schedule',Schedule)

Schedule.$inject=['$http'];

function Schedule($http){


    var schedule=this;

    schedule.terms=[];
    schedule.items=[];
    schedule.filters=['名称','编号','老师'];

    schedule.initTerms=initTerms;
    schedule.getSchedule=getSchedule;
    schedule.Arrange=Arrange;

    initTerms();

    function initTerms(){
        for(var i= 0;i<40;i++){
            if (i%2==0)
                schedule.terms[i]=(i/2+2000)*10+1;
            else
                schedule.terms[i]=((i-1)/2+2000)*10+2;
        }
    };

    function getSchedule(fit){
        var filter,condition;
        if(fit=='term'){
            filter=fit;
            condition=schedule.term;
        }
        else{
            if(fit=='编号') {
                filter = 'number';
            }
            else if(fit=='名称'){
                filter='name';
            }
            else{
                filter='teacher';
            }
            condition=schedule.condition
        }

        console.log(filter);
        $http
            .get('/schedule',{
                params: {
                    filter:filter,
                    condition:condition
                }
            })
            .success(function(items){
                schedule.items=items;
            })
          .error(function(){
              console.log('get schedule fails!');
          })

    };

    function Arrange(){
        $http
            .post('/schedule',{
                term:schedule.term
            })
            .success(function(){
                alert('schedule success!');
            })
            .error(function(){
                alert('schedule fail!');
            })

        getSchedule('term');
        console.log(schedule.items);

    }

}