const router = require('express').Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;
const fileupload=require('../upload');
const udb=require('../users-database');
const tdb=require('../tasks-database');

//show signup form
router.get('/',function(req,res){
    res.render('signup',{});
    });

router.post('/check',function(req,res){
    udb.findUser({email:req.body.email},function(result){
          if(result){
            res.render('signup',{error:"Account already exists"});
          }else{
            if(req.body.password===req.body.confirmpassword){

                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    if(err)throw err;

                    udb.addUser({
                        email:req.body.email,
                        password:hash,
                        imagePresent:0,
                        imagePath:"myImage" + '-' + Date.now()+'.png',
                      },function(result){
                        //inserting userid in tasks db
                       tdb.addUserId(result.insertedId,function(resul){
                          req.login(result.insertedId,function(err){
                              if(err)throw err;
                              console.log("checking ",req.isAuthenticated()," ",result);
                              res.redirect('/profile/');
                             });
                       });
                      });
                  });

                 }else{
                     res.render('signup',{confirmpassword:"Enter same password",});
                 } 
          }
    });
    
        });
module.exports = router;