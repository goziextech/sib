    var express = require('express');
    var goziextech = express ();
    var port = process.env.PORT || 3000;
    
    //API Home
    goziextech.get('/',function(req, res){
    res.send('Welcome to Goziex Technologies Test API'); 
    });
    
    goziextech.listen(3000);
    console.log('Goziex Tech Server is running on port:' + port);
