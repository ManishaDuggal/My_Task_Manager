const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const app=express();
app.set('view engine', 'ejs');
// Public Folder
app.use(express.static('./public'));
// Set The Storage Engine
var globalvar='';
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    //file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    cb(null,globalvar);
  }
});

// Init Upload
module.exports={
    uploadimage:function(req,res,imgpath){
      globalvar=imgpath;
        upload(req, res, function(err){
            if(err){
              res.render('profile', {
                msg: err
              });
            } else {
              if(req.file == undefined){
                res.render('profile', {
                  msg: 'Error: No File Selected!'
                });
              } else {
                //entry in communities database
               res.redirect('/profile/');
                
              }
            }
          });
    },
}
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}




