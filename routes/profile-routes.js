const router = require('express').Router();

const fileupload=require('../upload');

const udb=require('../users-database');
var file=require('../file-rename');

var ObjectId = require('mongodb').ObjectID;

router.get('/',function(req,res){

    if(req.isAuthenticated()){
        udb.findUser(new ObjectId(req.user),function(result){
            res.render('profile',{result:result});
        });  
    }else{
        res.redirect('/auth/login');
    }

    });


router.post('/upload', function(req, res){

//image upload
    if(req.isAuthenticated()){
    
        var newpath="myImage"+Date.now()+".png";
        udb.findUser({
          _id:new ObjectId(req.user),
       },function(result){
        if(result.imagePresent){
      file.fileRename(result.imagePath,newpath,function(){ 
      udb.addImage(new ObjectId(req.user),newpath,function(){
        console.log("\nadd image ",result);          
        fileupload.uploadimage(req,res,result.imagePath);
      });
      });
       }else{
           udb.imagePresent(new ObjectId(req.user),function(){
            udb.addImage(new ObjectId(req.user),result.imagePath,function(){
                console.log("\nadd image ",result);          
                fileupload.uploadimage(req,res,result.imagePath);
              });
           });
       }
    });

    }else{
        res.redirect('/auth/login');
    } 
});

router.get('/changeimage/:img',function(req,res){
    if(req.isAuthenticated()){
        udb.findUser(new ObjectId(req.user),function(result){
            if(result.imagePath!=req.params.img){
                file.fileRename(result.imagePath,"manisha.png",function(){
                    file.fileRename(req.params.img,result.imagePath,function(){
                        file.fileRename("manisha.png",req.params.img,function(){
                             res.redirect('/profile/images');
                        });
                    });
                  });
            }else{
                res.redirect('/profile/images');
            }
         
        });

    }else{
        res.redirect('/auth/login');
    }
  
    
 //file.fileRename()
});

router.get('/images',function(req,res){
    
    if(req.isAuthenticated()){
        
        udb.findUser(new ObjectId(req.user),function(result){
            res.render('images',{result:result});
        });
      
    }else{
        res.redirect('/auth/login');
    }
    
    });
module.exports = router;