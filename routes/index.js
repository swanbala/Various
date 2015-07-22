var express = require('express');
var router = express.Router();
var ObjectId=require('mongodb').ObjectID;
var MongoClient=require('mongodb').MongoClient;

//note all courses that need to schedule
var courseitems=[];

//url of database
var  url='mongodb://localhost:27017/course';

//get dates about subject
var getCourses=function(fn){
    if(typeof fn != 'function')
        throw new TypeError('fn is not a function');
    MongoClient.connect(url,function(err,db){
        var courses=db.collection('course');
        courses.find({state:'vaild'}).toArray(function(err,items){
            console.log(items);
            fn(err,items);
            db.close;
        });
    });
}

//add a course object to the database
var addCourse=function(sourse, fn){
    MongoClient.connect(url,function(err,db){
        //get the suit subject
        var courses=db.collection('course');
     //   console.log(ObjectId(sourse.cid));
        courses.findOne({_id:ObjectId(sourse.cid)},function(err,result){
            if(err){
                console.log("the opreation that findOne() is failed ")
            }
            else{
                //init the objected that will insert to the collection
               // console.log(result);
                var add={
                    name:sourse.name,
                    number:sourse.number,
                    teacherid:sourse.teacherid,
                    teacher:sourse.teacher,
                    point:sourse.point,
                    term:sourse.term,
                    cid:sourse.cid,

                    belongto:result.major,
                    ifrequired:result.ifrequired,
                    long:result.long
                };
                //collect the collection and insert the data
                var subjects=db.collection('subjects');
                subjects.insertOne(add,function(err){
                    fn(err);
                    db.close();
                })
            }
        });
    })
}

var getTeachers = function (pro, fn) {
    console.log(typeof pro);
    MongoClient.connect(url, function (err, db) {
        var teachers = db.collection('user');

        teachers.find({role: 'teacher', major: pro}, {fields: {username: 1, name: 1}}).toArray(function (err, items) {
            fn(err, items);
            db.close();
        })
    })

};

//get data about courses for modifying course
var getSubjects=function(fn){
    MongoClient.connect(url,function(err,db){
        var subjects=db.collection('subjects');
        subjects.find().toArray(function(err,items){
            fn(err,items);
            db.close();
        })

    })
}

//remove a course
var removeSubject=function(number,fn){
    console.log(number);
    MongoClient.connect(url,function(err,db){
        var subject=db.collection('subjects');

        subject.deleteOne({number: parseInt(number)},function(err, result){
            console.log(result.deletedCount);
            fn(err);
            db.close();
        })
    })
};

//update a course
var updateSubject=function(item,fn){
    MongoClient.connect(url,function(err,db){
        var subjects=db.collection('subjects');
        var id=parseInt(item.number);

        subjects.updateOne({number:id},item,function(err,re){
            fn(err);
            db.close();
        })
    })
}

var getSchedule=function(filter,condition,fn){
    MongoClient.connect(url,function(err,db){
        var schedules=db.collection('subjects');

        if(filter=='name') {
            schedules.find({name: condition}).toArray(function (err, items) {
                fn(err, items);
                db.close();
            });
        }
        else if(filter=='number'){
            schedules.find({number:parseInt(condition)}).toArray(function(err,items){
                fn(err,items);
                db.close();
            });
        }
        else if(filter=='teacher'){
            console.log(typeof condition);
            schedules.find({teacher:condition}).toArray(function(err,items){
                fn(err,items);
                db.close();
            });
        }
        else {
            schedules.find({term:parseInt(condition)}).toArray((function(err,items){
                fn(err,items);
                db.close();
            }))
        }
    })

}

//arrange the schedule of courses
var Arrange=function(term, fn){
    MongoClient.connect(url,function(err,db){
        var subjects=db.collection('subjects');

        var times=[11,12,21,22,31,32,41,42,51,52];
        subjects.find({term:term,time:null}).toArray(function(err,items) {
            if (err)
                console.log("get the date of needing to arrange!");

            var len = items.length;

            //schedule without any conditions
            if(len > 0) {
                var i = 0;
                var t;
                doit(null);
                function doit(promise) {
                    if (i == len) {
                        // promise must be not null
                        return promise.then(function(){
                            db.close()
                            fn();
                        }, function(err) {
                            fn(err);
                        });
                    }
                    t = i % 10;
                    promise = subjects.updateOne({term: term, time: null}, {$set: {time: times[t]}});
                    i++;
                    promise.then(function () {
                        console.log(i);
                        doit(promise);
                    }, function(err){
                        fn(err);
                    });
                }
            } else {
                db.close();
                fn();
            }
        })
    })
}

//avoid the same teacher at the same time
var Unique=function(term,fn){
    MongoClient.connect(url,function(err,db) {
        var times = [11, 12, 21, 22, 31, 32, 41, 42, 51, 52];
        var timeschedule=[],repeat=[],temprepeat=[];
        /*
         * note the courses that 'time' equal times[i] in timeschesule[i]
         * note the courses that need to modify 'time' in the array --repeat[]
         */

        var schedule = db.collection('subjects');

        schedule.find({term:term}).toArray(function(err,courseitems){

            for( var i=0;i<times.length;i++){
                timeschedule[i]=new Array;
                courseitems.forEach(function(obj){
                    if(obj.time==times[i])
                        timeschedule[i].push(obj.teacherid);
                });
            }


            for(var i=0;i<times.length;i++) {
                timeschedule[i].sort();
                var count=0;
                if(timeschedule[i].length>1) {
                    for (var j = 0; j < timeschedule[i].length - 1; j++) {
                        count = 0;
                        while (timeschedule[i][j] == timeschedule[i][j + 1]) {
                            count++;
                            if (j < timeschedule[i].length - 1)
                                j++;
                            else
                                break
                        }
                        temprepeat.push({id: timeschedule[i][j], times: count, schedule: i});
                        console.log(j);
                    }
                }
            }

            repeat=temprepeat.filter(function(obj){
                if(obj.times>0)
                    return true;
                else
                    return false;
            })

            console.log(repeat);
            if(repeat.length!=0)
            {
                var promise;
                var temp=repeat.pop();
                while(temp!=null){
                    temp.update=new Array;
                    for(var i=0; i<times.length; i++){
                        if(temp.times==0) break;
                        if(i!=temp.schedule&&timeschedule[i].indexOf(temp.id)==-1) {
                            console.log('');
                            promise=schedule.updateOne({teacherid: temp.id,time:times[temp.schedule]}, {$set: {time: times[i]}});
                            temp.times--;
                        }
                    }
                    temp=repeat.pop();
                }
                promise.then(function(value){
                    db.close();
                    fn();
                },function(err){
                    db.close();
                    fn(err);
                })
            }
            else{
                db.close();
                fn();
            }

        })

    })
}

router
    .route('/subject/subject')
    .get(function(req,res){
        getCourses(function(err,items){
            if(err)
                res.status(500);
            res.json(items);
        })
    })
    .post(function(req,res){
        var temp={
            name:req.body.sname,
            number:req.body.snumber,
            teacher:req.body.teacher,
            teacherid:req.body.teacherid,
            point:req.body.point,
            term:req.body.term,
            cid:req.body.cid
        };
        addCourse(temp,function(err){
            if(err)
                res.status(500);
                res.end();
        })
    })

router
    .route('/subject/subject:major')
    .get(function(req,res){
        var profession=req.params.major;

        getTeachers(profession,function(err,items){
            if(err)
            console.log(err);
            res.json(items);
        })
    })

router
    .route('/courses')
    .get(function(req, res){
        getSubjects(function(err,items){
            if(err)
                res.status(500);
            res.json(items);
        })
    })


router
    .route('/courses/:id')
    .put(function(req, res){

        var course = {
            number : req.body.number,
            name : req.body.name,
            teacher: req.body.teacher,
            teacherid:req.body.teacherid,
            point : req.body.point,
            term:req.body.term
        };
        updateSubject(course,function(err){
            if(err)
                res.status(500);
            else
                res.status(200);
        })
        res.end();
    })
    .delete(function(req, res){
        var number=req.params.id;
        console.log(number);
        removeSubject(number,function(err){
            //console.log('---');
            if(err)
                res.status(500).end();
            else
                res.status(200).end();
        });

    })

router
    .route('/schedule')
    .get(function(req,res){
        var filter=req.query.filter;
        var condition=req.query.condition;
        console.log(req.query);
        getSchedule(filter,condition,function(err,items){
            if(err) {
                res.status(500);
            }
            res.json(items);
        });
    })
    .post(function(req,res){
        var term =req.body.term;
        Arrange(term, function(err) {
            if (err) {
                res.status(500);
                console.log(err);
                res.end();
            }
            else {
                Unique(term, function (err) {
                    if (err){
                        console.log(err);
                        res.status(500);
                    }
                    res.end();
                })
            }
        });
    })

module.exports = router;
