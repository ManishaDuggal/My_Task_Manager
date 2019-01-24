const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
LocalStrategy = require('passport-local').Strategy;

const keys = require('./keys');
const db=require('../users-database');
const tdb=require('../tasks-database');

passport.serializeUser((userid, done) => {
    console.log("serialize user "+userid);
    done(null,userid);
});
// when again req comes from browser result is stored in req.user
var ObjectId = require('mongodb').ObjectID;
passport.deserializeUser((id, done) => {
   // db.findUser({_id:new ObjectId(id)},function(result){
        console.log("find user "+id);
        done(null,id);
   // });
});

passport.use(
    new GoogleStrategy({
        //agter user gives permission where to go
        callbackURL:'/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
    }, (accessToken,refreshToken,profile,done) => {
        console.log("next tick "+profile.emails[0].value);
        // passport callback function

                db.findUser({email:profile.emails[0].value},function(result){
                    console.log("find user ",result);
                    if(result){
                        db.updateUser(result.email,profile.id,function(result){
                            db.findUser({email:profile.emails[0].value},function(result){
                                console.log("\nexist ",result);
                                return done(null,result._id);
                            });
                      });
                    }else{
                        db.addUser({
                            google_id:profile.id,
                            email:profile.emails[0].value,
                            imagePresent:0,
                            imagePath:"myImage" + '-' + Date.now()+'.png',
                        },function(result){
                            tdb.addUserId(result.insertedId,function(){
                            console.log("\nnot exist ",result.insertedId);
                            return done(null,result.insertedId);
                            });  
                       });
                    }
                       
                });

    })
);

