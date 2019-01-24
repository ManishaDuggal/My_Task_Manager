const router = require('express').Router();
const db=require('../tasks-database');
var ObjectId = require('mongodb').ObjectID;

router.get('/',function(req, res){
    if(req.isAuthenticated()){
        db.findUser(new ObjectId(req.user),function(result){
            var current=new Date().toISOString().slice(0,10);
            if(result)
              res.render('createtask',{result:result,currentdate:current});
              else
              res.render('createtask',{result:{},currentdate:current});
        });

    }else{
        res.redirect('/auth/login');
    }
    
});

router.post('/create',function(req, res){

    if(req.isAuthenticated()){
        var current=new Date().toISOString().slice(0,10);
        db.addTask(new ObjectId(req.user),{
        task:req.body.task,
        date:current,
        finishdate:req.body.date,
        label:req.body.label,
        status:"pending",
       },function(){
          res.redirect('/task/');
       });       
    
      }else{
          res.redirect('/auth/login');
      }
 
});

router.get('/status/:str/:status/:oldstatus',function(req, res){

    if(req.isAuthenticated()){

       
        if(req.params.oldstatus!="finished"){
            db.updateTaskStatus(new ObjectId(req.user),req.params.str,req.params.status,function(result){
                res.redirect('/task/');
             });
        }else{
            res.redirect('/task/');
        }
          
      }else{
          res.redirect('/auth/login');
      }
 
});

module.exports = router;