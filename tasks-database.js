var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {
 addUserId:function(userid,callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
     var dbo = db.db("taskmanager");
      var myobj = {userid:userid,taskarray:[],labelarray:[],};
      dbo.collection("tasks").insertOne(myobj,function(err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
      callback();
    });
  });
 },
  
  findUser:function(userid,callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("taskmanager");
        //Find the first document in the users collection:
        dbo.collection("tasks").findOne({userid:userid}, function(err, result) {
          if (err) throw err;
          callback(result);
          db.close();
        });
      });   
},

addTask:function(userid,taskobj,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = {userid:userid};
    //add to array if it doesnot exist
   var newvalues = {"$addToSet" : { taskarray :taskobj} };
    dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("task added",res);
      db.close();
    });
  });
  callback();
},

addLabel:function(userid,label,callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("taskmanager");
      var myquery = {userid:userid};
      //add to array if it doesnot exist
     var newvalues = {"$addToSet" : { labelarray :label} };
      dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("label added ");
        db.close();
      });
    });
    callback();
  },

deleteTask:function(userid,task,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = {userid:userid};
   newvalues={ "$pull" : { "taskarray" : { "task" : task } }  }
    dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      db.close();
    });
  });
  callback();
},
deleteLabel:function(userid,label,callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("taskmanager");
      var myquery = {userid:userid};
     newvalues={ "$pull" : { "labelarray" : label }  }
      dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        db.close();
      });
    });
    callback();
  },

updateTaskStatus:function(id,task,status,callback){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("taskmanager");
    var myquery = { userid:id,'taskarray.task':task };
    var newvalues = { $set: {'taskarray.$.status':status} };
    dbo.collection("tasks").updateOne(myquery, newvalues, function(err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      callback(result);
    });
  });

  },

}

