const router = require('express').Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var bcrypt = require('bcrypt');
var saltRounds = 10;
const db=require('../users-database');
var ObjectId = require('mongodb').ObjectID;

router.get('/',function(req,res){
    if(req.isAuthenticated()){
        res.render('changepassword',{});
    }else{
        res.redirect('/auth/login');
    }
  
});

router.post('/submit',function(req, res){
  if(req.isAuthenticated()){
      db.findUser({_id:new ObjectId(req.user)},function(result){
           if(result){
//if user exists
            bcrypt.compare(req.body.oldpassword,result.password, function(err, responce) {
                if(responce==true){
                    if(req.body.password!=req.body.confirmpassword){
                        res.render('changepassword',{error:"Enter same passwords"});
                    }else{
                        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                            if(err)throw err;
                            db.updatePassword(new ObjectId(req.user),hash,function(r){
                                res.render('changepassword',{success:"Password updated successfully"});
                            });
                        });
                        
                    }
                }else{
                    res.render('changepassword',{error:"Incorrect Password"});
                }

            });

           }else{
               res.render('changepassword',{error:"Incorrect Password"});
           }
      })
        
  }else{
    res.redirect('/auth/login');
  }

});



module.exports = router;