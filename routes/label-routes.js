const router = require('express').Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const db=require('../tasks-database');
var ObjectId = require('mongodb').ObjectID;

router.get('/',function(req, res){

  if(req.isAuthenticated()){

    db.findUser(new ObjectId(req.user),function(result){
      console.log("label ",result)
        if(result&&result.labelarray)
          res.render('createlabel',{arr:result.labelarray});
          else
          res.render('createlabel',{arr:[]});
    });

  }else{
      res.redirect('/auth/login');
  }
       
});

router.post('/create',function(req, res){
  if(req.isAuthenticated()){

    db.addLabel(new ObjectId(req.user),req.body.label,function(){
      res.redirect('/label/');
    });

  }else{
    res.redirect('/auth/login');
  }

});

router.get('/delete/:str',function(req, res){

  if(req.isAuthenticated()){

    db.deleteLabel(new ObjectId(req.user),req.params.str,function(){
      res.redirect('/label/');
   });

  }else{
      res.redirect('/auth/login');
  }
    
});

module.exports = router;