const express = require("express");
const util = require("util")

const app = express();


// this middleware will always run whenever client's request is made
app.use(function(req, res, next){
    console.log("Hi I'm here", req.originalUrl);
    next(); // next without parameter will call the next matching router or middleware
    // next(param: Error), with param, it will forward the error msg to next route handler on its `err` (1st of 4 param) object
 });

app.use('/', function (req, res, next) {
   console.log("Hitting on / route from app.use", req.originalUrl);
   next();
})
 
 //Route handler
 app.get('/', function(req, res, next){
   console.log("Hitting on / route from app.get", req.originalUrl);
   res.send(`Ending Middleware Chaining by red.send ${req.originalUrl}`);
 });

 // throwing error can be handle using error handler middleware (4 parameter callback)
 app.get('/error', function (req,res,next){
   throw new Error("Intentionally throwing error")
   // next("Intentionally throwing error using the next middleware's function") // recommended way
   // try { throw new Error ("Error Message")} catch (err) { next(err) } // also recommended
   // try { throw new Error ("Error Message")} catch (next) // another recommended option
 })
 
 app.use('/index', function(req, res, next){
    console.log('End', req.originalUrl);
    next();
 });

 app.get('/index', function (req, res, next) {
   console.log('End', req.originalUrl);
   res.end(`Response From /index route ${req.originalUrl}`);
 })

 // this middleware will only trigger if any error is thrown
 // if error triggered with the `next` middleware function, it will directly accessible as `err` param
 app.use(function(err, req, res, next) {
   console.log("Error Middleware Callback triggered")
   // res.send(`${util.inspect(err)}`);
   console.log(util.inspect(err));
   res.send(err.message);
   // res.send(err);
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