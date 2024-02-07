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
