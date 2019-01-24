if(req.isAuthenticated()){
    

  }else{
      res.redirect('/auth/login');
  }
