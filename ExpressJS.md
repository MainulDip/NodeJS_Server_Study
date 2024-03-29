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
Express matches routes from start to end of the index.js file, including the external routers you required. Routes can be Fixed/Static, Dynamic (`/api/users/:id`), Dynamic with RegX (`"/things/:id([0-9]{5})"`) or WildCard (`"*"`).

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

### Route Handler:
multiple callback functions can be supplied, that behave like middleware to handle a request. These callbacks might invoke next() function. This a mechanism to impose pre-conditions on a route, then pass control to subsequent routes if there’s no reason to proceed with the current route.

```js
// 2 callback in route function
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})


// Defining 3 callback, first two is middleware like callback 
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])

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

```js
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
```

* Middleware to count request and server response time. Notice, how we're defining and passing a new property `requestTimeCustom` inside middleware callback and calling that form the next middleware callback's request object

```js
const express = require('express');
const app = express()

const requestTime = function (req, res, next) {
  req.requestTimeCustom = Date.now(); // attaching a new property with request object
  next()
}

app.use(requestTime) // once passed as middleware callback (3 props), the property will be available inside next middleware-router

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTimeCustom}</small>`; // calling the newly attached prop that was declared previously through middleware callback
  res.send(responseText)
})

app.listen(3000)
```
### ThirdParty Middleware (*`body-parser`, *`cookie-parser`, `formidable`, `multer`):
`body-parser` Parse incoming request bodies in a middleware before your handlers, available under the req.body property. It provide JSON, RAW, TEXT and URL-encoded-form parsing. This does not handle multipart bodies, for handling this, use `formidable`, `multer`, etc. Docs => https://www.npmjs.com/package/body-parser

* parsing all incoming request

```js
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

* Using with router

```js
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  res.send('welcome, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
})
```

* Cookie Parser (`npm install cookie-parser`) => Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware. Docs => https://www.npmjs.com/package/cookie-parser

```js
var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
})

app.listen(8080)

// curl command that sends an HTTP request with two cookies
// curl http://127.0.0.1:8080 --cookie "Cho=Kim;Greet=Hello"
```

### Template-ing (`pug`,`handlebar`, `EJS`):
To install Pug `npm install --save pug`, also no need to require it. 
- Use directly by `app.set('view engine', 'pug');` 
- Set the template directory by `app.set('views','./directory_name');`. 
- Render the pug file using `red.render('filename.pug', {...props});`

Note: in pug file, passed props are consumed by `htmlElement=prop` and `#{prop}` signature.

```pug
// main.pug file
html
   head
      title pageTitle
   body
      include ./header.pug
      h1 Greetings from #{name}
      h3 I'm the main content
      a(href = url) Next Post
      include ./footer.pug
```

```js
var express = require('express');
var app = express();

app.get('/dynamic_view', function(req, res){
   res.render('dynamic', {
      pageTitle: "First Post",
      name: "WebSolverPro",
      url:"https://www.websolverpro.com/Second-Post"
   });
});

app.listen(3000);
```
### Static files:
Express use built-in middleware `app.use(express.static('public'));` to enable static file serving. Multiple directory can be set. Also static folders are considered same level as root directory. To change this, virtual path prefix can be declared by `app.use('/static', express.static('public'));`.

```pug
html
   head
   body
      h3 Testing static file serving:
      img(src = "/testimage.jpg", alt = "Testing Image")
```

### Form Handling (`body-parser` and `multer` for multipart form):
To work with forms easily install the body-parser(for parsing JSON and url-encoded data) and multer(for parsing multipart/form data) middleware.
`npm install --save body-parser multer`

```pug
html
html
   head
      title Form Tester
   body
      form(action = "/", method = "POST")
         div
            label(for = "say") Say:
            input(name = "say" value = "Hi")
         br
         div
            label(for = "to") To:
            input(name = "to" value = "Express forms")
         br
         button(type = "submit") Send my greetings
```

```js
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

app.get('/', function(req, res){
   res.render('form');
});

app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.post('/', function(req, res){
   console.log(req.body);
   res.send("recieved your request!");
});
app.listen(3000);
```

### Error Handling:
Error handling in Express is done using middleware, But error-handling functions MUST have four arguments instead of three – `err, req, res, next`. Docs => http://expressjs.com/en/guide/error-handling.html
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
Object inspection can be done by importing/requiring `util` package and triggering its `inspect` function.

```js
const express = require("express");
const util = require("util");

const app = express();

app.get('/', function(req, res, next){
   console.log(util.inspect(req));
   res.end("Response form server")
});

app.listen(3000);
```

Also `Debug` npm_package (https://www.npmjs.com/package/debug) can be used. Set a script like `"debug": "set DEBUG = Express:* node app.js"` and run.

- `"app-router-debug": "set DEBUG = express:application,express:router node index.js"`to restrict the logger to application and router.

### Cookies and Sessions:
 * Cookies => once set form the server, saved cookies is retrieved by `document.cookie` from browser console. `console.log(document.cookie);` can do this

 ```js
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser());

const cookieName = "cookieFoo"

app.get('/', function (req, res) {
    console.log(req.cookies); // print all cookies in server console
    res.cookie(cookieName, 'express', { expire: 360000 + Date.now() }) //Sets name = express
        .send('cookie set');
});

app.get('/clear_cookie_foo', function (req, res) {
    console.log(req.cookies); // print all cookies in server console
    res.clearCookie(cookieName);
    res.send('cookie foo cleared');
});

app.listen(3000);
 ```

* Session => Using the `express-session` package, session is set based on a secret (`app.use(session({secret: "Anything as secret"}))`) and by the request object using `req.session.session_name` (same syntax for reading the same session). 

Creating a new session in server also automatically creates/assigns an associated HttpOnly Cookie (upon the session secret) to the browser. Browser's session cookie can be read/verify with same syntax `req.session.session_name` as getter (within the server). When reading, server will read the HttpOnly cookie sent form browser, parse/decrypt, and return the original value form the key.

Note: HttpOnly Cookies Cannot Be Accessed Using Scripts (to stop CSRF), https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies. From browser, it can be accessed using GUI.


Note: `express-session` By default stores session key inside memory/ram, which is not recommended (as on server restart, all keys will be removed from RAM). Its better to store session keys inside Database (postgres/sqlite/mysql, etc). `@client/prisma` and `@quixo3/prisma-session-store` can be used together. Or use `connect-session-knex` standalone or with prisma.

https://github.com/prisma/prisma
https://www.npmjs.com/package/@quixo3/prisma-session-store

https://www.npmjs.com/package/knex (so many downloads)
https://www.npmjs.com/package/connect-session-knex (so many downloads)

https://www.npmjs.com/package/express-session#compatible-session-stores

```js
const session = require("express-session");

app.use(session({secret: "Custom Secret Key"}));

app.get('/', (req,res)=>{
    if(req.session.page_views){
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
     } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
     }
})
```


### Authentication (put this in another markdown-module):

### Database and ORM (`prisma`) integration:

### GraphQL using `express-graphql`:

### GraphQL with apollo (put this in another markdown-module)