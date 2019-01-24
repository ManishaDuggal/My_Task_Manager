const router = require('express').Router();
const passport = require('passport');
const db=require('../users-database');
var bcrypt = require('bcrypt');
var saltRounds = 10;
// auth login
router.get('/login/', (req, res) => {
    res.render('login', {});
});

router.post('/submitlogin', function(req, res){
db.findUser({email:req.body.email},function(result){
    if(result){
//now check password
        bcrypt.compare(req.body.password,result.password, function(err, responce) {
              if(responce==true){
                req.login(result._id,function(err){
                    if(err)throw err;
                    console.log("checking ",req.isAuthenticated()," ",result);
                    res.redirect('/profile/');
                   });
              }else{
                res.render('login', {error:"Invalid Credentials"});
              }
        });

        
    }else{
        //if user name don't exist
        res.render('login', {error:"Invalid Credentials"});
    }
    
});
   
});

// auth logout
var ObjectId = require('mongodb').ObjectID;
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.redirect('/auth/login/');
   
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile','email'],
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google',
{
   successRedirect:'/profile',
failureRedirect: '/auth/login',
} ), (req, res) => {
   // res.send('/profile/');
    //res.redirect('/profile/');
});

module.exports = router;