var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {
 addUser:function(myobj,callback){

    MongoClient.connect(url, function(err, db){
      if (err) throw err;
     var dbo = db.db("taskmanager");
      dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err)  throw new Error('Unable to access database');
     console.log('user added');
      db.close();
      callback(res);
     });
    });
  },
  findUser:function(obj,callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("taskmanager");
        //Find the first document in the users collection:
        dbo.collection("users").findOne(obj, function(err, result) {
          if (err) throw err;
          callback(result);
          db.close();
        });
      });
      
},
addImage:function(id,imgpath,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = {_id:id};
    //add to array if it doesnot exist
   var newvalues = {"$addToSet" : { allImages :imgpath} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
     // console.log(res);
      db.close();
    });
  });
  callback();
},

imagePresent:function(id,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = { _id: id };
    var newvalues = { $set: {imagePresent:1} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  callback();
},

updateUser:function(email,googleid,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = { email: email };
    var newvalues = { $set: {google_id:googleid} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
      if (err) throw err;
      console.log("1 document updated");
      callback(result);
      db.close();
    });
  });
  
},
updatePassword:function(id,password,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = { _id:id };
    var newvalues = { $set: {password:password} };
    dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
      if (err) throw err;
      console.log("1 document updated");
      callback(result);
      db.close();
    });
  });
  
},

}