var fs = require('fs');
 
module.exports={
    fileRename:function(oldpath,newpath,callback){
        fs.rename(__dirname+'/public/uploads/'+oldpath, __dirname+'/public/uploads/'+newpath, function (err) {
            if (err) throw err;
            console.log('File Renamed.');
            callback();
          });          
    }
}

