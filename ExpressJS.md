### Overviews:
=> https://www.tutorialspoint.com/expressjs/expressjs_quick_guide.htm.

### Express:
Express is a minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications. Some interesting feature of it are

- Allows to set up middlewares to respond to HTTP Requests.
- Defines a routing table which is used to perform different actions based on HTTPMethod and URL.
- Allows to dynamically render HTML Pages based on passing arguments to templates.

```sh
npm install express --save
```

### Some Utility Library:

- body-parser − This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data.

- cookie-parser − Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

- multer − This is a node.js middleware for handling multipart/form-data.

```sh
$ npm install body-parser --save
$ npm install cookie-parser --save
$ npm install multer --save
```

### Simple Express Server and Routing:
`get` method of express object has a route and a callback function. The callback receives a Request and a Response Object as its param. `Response.send()` is what will be return when request for a route.

- `Request Object` − The request object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.

- `Response Object` − The response object represents the HTTP response that an Express app sends when it gets an HTTP request.

* Routing: Express object has `get`,`post`,`delete`, etc method to deal with routing.

```js
const express = require("express")
const app = express();

app.get('/', (req, res) => {
    res.send("hello world")
})

const server = app.listen(8081, () => {
    // the outer variable `server` is already available inside the callback at this point
    var host = server.address().address
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
})
```

`curl http://localhost:8081/` running in shell will return `Hello World`
`curl -w "\nTotal time it took: %{time_total}\n" -s http://localhost:8081/`

### Connect Static Asset's Directory and html file as response:
```js
app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})
```

### Cookie Management Using `cookie-parser`:
`cookie-parser` 3rd party package can be set as Middleware Function using `app.use(cookieParser())`. Then sent cookies are available as callback's `Request.cookies` prop
```js
var express      = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

app.get('/', function(req, res) {
   console.log("Cookies: ", req.cookies)
})
app.listen(8081)
```

### Express RESTful:
Note: after calling `res.writeHead`, only optional `res.write` will work followed by `res.end`.

```js
const express = require("express");
const fs = require("fs");
const app = express();

// GET Request Route
// test it `curl -X "GET" -s http://localhost:8081/listUsers`
app.get('/listUsers', (req, res) => {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', (err, data) => {
        console.log(data)
        res.end(data)
    })
})

const user = {
    "user4": {
        "name": "mohit",
        "password": "password4",
        "profession": "teacher",
        "id": 4
    }
}


// Post Request Route
// test it `curl -X "POST" -s http://localhost:8081/addUser`
app.post('/addUser', (req, res) => {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', (err, data) => {
        let users = JSON.parse(data);
        let allUsers = {...users, ...user}

        res.writeHead(200, { 'Content-Type': 'application/json' }); // this is important
        // res.end(JSON.stringify(allUsers)); // Not good, `end` should call after sending
        // res.send(allUser); // good approach, string conversion optional
        res.write(JSON.stringify(allUsers)); // another good approach, after `writeHead`, only `write` and `end` will work
        res.end(()=>{
            console.log("Finished Processing")
        })        
    });
});

// GET :id Request Route
// test it `curl -X "GET" -s http://localhost:8081/user/3`
app.get('/user/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       var users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       // res.writeHead(200, { 'Content-Type': 'application/json' }); // `send` will not with `writeHead`
       res.send(user);
       res.end();
    });
 })

 // DELETE a user with :id
 // test it `curl -X "DELETE" -s http://localhost:8081/deleteUser/3`
 app.delete('/deleteUser/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + req.params.id];
        
       console.log( data );
       res.writeHead(200, { 'Content-Type': 'application/json' });
       res.end( JSON.stringify(data));
    });
 });

const server = app.listen(8081, () => {
    // the outer variable `server` is already available inside the callback at this point
    var host = server.address().address;
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
```

### Routing (Fixed and Dynamic):
Express matches routes from start to end of the index.js file, including the external routers you required. Routes can be Fixed/Static, Dynamic (`/api/users/:id`), Dynamic with RegX (`"/things/:id([0-9]{5})"`) or WildCard (`"*"`)

```js
var express = require('express');
var app = express();

// Dynamic Routes, dynamic slots are available as their text after `:`
app.get('/things/:name/:id', function(req, res) {
   res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});

// Dynamic Route With Regular Express
app.get('/things/:id([0-9]{5})', function(req, res){
   res.send('id: ' + req.params.id);
});


// WildCard Route, this should come at the last resort
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

app.listen(3000);
```

### MiddleWare Functions:
Middleware function can be triggered any point after User/Client made a request to the Server. 
* `app.use(function(req, res, next){})` and all of the route handling functions like `app.get`, `app.post` with 3 arguments in their callback are both middleware and route function.

Middleware functions have access to the `request object (req)`, the `response object (res)`, and the `next middleware` function in the application’s `request-response` cycle. These functions are used to modify req and res objects for tasks like parsing request bodies, adding response headers, etc. And like everything, their position matters.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

If the current middleware function does not end the request-response cycle, it must call `next()` to pass control to the next middleware function. Otherwise, the request will be left hanging.


https://expressjs.com/en/guide/writing-middleware.html

* MiddleWare type => 1. WildCard (that only have callback and no route), 2. Route Middle Ware (an URL route is the first param, followed by callback as second). Also note, callback with 3 params are regular Middleware, with 4 params is a Error Handler Middleware.

* `next` function => `next()` will call the next matching route handler or middleware, without next() call, it will not move forward. `next(param)` will trigger error which needs to be handle with next matching route's `err` param object

* Middleware to count request and server response time

```js
const express = require('express');
const app = express()

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

app.listen(3000)
```

### Static files:

### Form Handling (`body-parser` and `multer` for multipart form):


### Template-ing (`pug`,`handlebar`):

### Database and ORM (`prisma`) integration:

### Cookies and Sessions:

### Authentication (put this in another markdown-module):

### Error Handling:
Error handling in Express is done using middleware, But error-handling functions MUST have four arguments instead of three – `err, req, res, next`.
```js
app.get('/', function(req, res){
   var err = new Error("Something went wrong");
   next(err);
});

/*
 * other route handlers and middleware here
 * ....
 */

//An error handling middleware
app.use(function(err, req, res, next) {
   res.status(500);
   res.send("Oops, something went wrong.")
});
```
### Debugging:
Can be used with `Debug` npm package (https://www.npmjs.com/package/debug). Set a script like `"debug": "set DEBUG = Express:* node app.js"` and run.

- `"app-router-debug": "set DEBUG = express:application,express:router node index.js"` to restrict the logger to application and router.

### GraphQL using `express-graphql`:

### GraphQL with apollo (put this in another markdown-module)