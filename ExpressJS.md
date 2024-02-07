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