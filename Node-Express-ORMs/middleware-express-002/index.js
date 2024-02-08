const express = require("express");

const app = express();


//First middleware before response is sent
app.use(function(req, res, next){
    console.log("Start", req.originalUrl);
    next(); // next without parameter will call the next matching router or middleware
    // next(param: Error), with param, it will forward the error msg to next route handler on its `err` (1st of 4 param) object
 });
 
 //Route handler
 app.get('/', function(req, res, next){
    console.log("Middle", req.originalUrl);
    res.send("Middle");
    next();
 });
 
 app.use('/index', function(req, res, next){
    console.log('End', req.originalUrl);
 });
 
 app.listen(3000)

 /**
//First middleware before response is sent
app.use(function(req, res, next){
    console.log("Start", req.originalUrl);
    next();
 });
 
 //Route handler
 app.get('/', function(req, res, next){
    console.log("Middle", req.originalUrl);
    res.send("Middle");
    next();
 });
 
 app.use('/', function(req, res, next){
    console.log('End', req.originalUrl);
 });
  */