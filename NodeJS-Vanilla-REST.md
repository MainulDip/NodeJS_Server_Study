### Overviews:
=> https://www.tutorialspoint.com/nodejs/nodejs_quick_guide.htm
=> https://frontendguruji.com/blog/how-to-create-api-in-nodejs-without-express-js/
=> https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm

### 001:
`node main.js` sh command to run
```js
var http = require("http")

const server = http.createServer(function(request, response){
    response.writeHead(200, 'text/plain');
    response.end("Response form Vanilla NodeJS app server.");
})

server.listen(8080);

console.log('Server running at http://127.0.0.1:8081/');
```

### NodeJS REPS (Read Evaluate Print Loop):
NodeJS RAW code can be run on terminal through REPL. Simple `node` cmd will start the REPL environment.

### Frequently NPM cmd:
`npm ls` => list down all locally installed modules
`npm install/uninstall/update/search <module_name>`

### Package.json Attributes:

* name − name of the package

* version − version of the package

* description − description of the package

* homepage − homepage of the package

* author − author of the package

* contributors − name of the contributors to the package

* dependencies − list of dependencies. NPM automatically installs all the dependencies mentioned here in the node_module folder of the package.

* repository − repository type and URL of the package

* main − entry point of the package

* keywords − keywords

### Callback (Asynchronous) Fn vs Synchronous:
Usually in node.js `callback` functions are `Asynchronous`. There are synchronous variation also. Like `fs.readFileAsync()` vs `fs.readFile(callback)`

* Blocking

```js
var fs = require("fs");
var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("Program Ended");
```

* Non-Blocking

```js
var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err) return console.error(err);
   console.log(data.toString());
});

console.log("Program Ended");

// Program Ended
// The result for the input.txt
```

### Single Threaded NodeJS with hidden/restricted multithreading for event based I/O operation:
Node.js runs JavaScript code in a single thread, which means that your code can only do one task at a time. However, Node.js itself is multithreaded and provides hidden threads through the libuv library, which handles I/O operations like reading files from a disk or network requests. Through the use of hidden threads, Node.js provides asynchronous methods that allow your code to make I/O requests without blocking the main thread.

Although Node.js has hidden threads, you cannot use them to offload CPU-intensive tasks, such as complex calculations, image resizing, or video compression. Since JavaScript is single-threaded when a CPU-intensive task runs, it blocks the main thread and no other code executes until the task completes. Without using other threads, the only way to speed up a CPU-bound task is to increase the processor speed.

* Multithreading can be done with `worker-threads` module, which allows you to create threads and execute multiple JavaScript tasks in parallel.

Awesome article => https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js

### NodeJS event loop:
Node.js is a single-threaded (Main Thread Execution) event-driven application. Concurrent operations is done via hidden threads using event-loop (observer pattern) and callbacks for I/O operations (like Read/Write File System or Send/Listen Network Call).

In an event-driven application, there is generally a main loop that listens for events (maybe on background threads), and then triggers a callback function when one of those events is detected on main thread

<details>
<summary>Custom Event and Event Emitter</summary>

```js
// Import events module
var events = require('events');

// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

// Create an event handler as follows
var connectHandler = function connected() {
   console.log('connection successful.');
   // emit data after 3 seconds
   setTimeout(()=>{eventEmitter.emit('data_received');}, 3000)   
}

// Bind the connection event with the handler
eventEmitter.on('connection', connectHandler);
 
// Bind the data_received event with the anonymous function
eventEmitter.on('data_received', function() {
   console.log('data received successfully.');
});

// Fire the connection event 
eventEmitter.emit('connection');
console.log("Program Ended.");

/* Outputs
connection successful.
Program Ended..
// after 3 seconds
data received successfully.
*/
```
</details>

### NodeJS async function workflow:
In Node Application, any async function accepts a callback as the last parameter and a callback function accepts an error as the first parameter.
```js
var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err) {
      console.log(err.stack);
      return;
   }
   console.log(data.toString());
});
console.log("Program Ended");
```

### Event Emitters:
Many objects in a Node emit events, for example, a `net.Server` emits an event each time a peer connects to it, an `fs.readStream` emits an event when the file is opened. All objects which emit events are the `instances of events.EventEmitter`.

When an EventEmitter instance faces any error, it emits an `'error'` event. When a new listener is added, `'newListener'` event is fired and when a listener is removed, `'removeListener'` event is fired.

EventEmitter provides multiple properties like on and emit. on property is used to bind a function with the event and emit is used to fire an event.

Like `addListener(event, listener)`, `on(event, listener)`, `once(event, listener)`, `removeListener(event, listener)`, `removeAllListeners([event])`, `setMaxListeners(n)`, `listeners(event)`, `emit(event, [arg1], [arg2], [...])`

```js
var events = require('events');
var eventEmitter = new events.EventEmitter();

// listener #1
var listener1 = function listener1() {
   console.log('listener1 executed.');
}

// listener #2
var listener2 = function listener2() {
   console.log('listener2 executed.');
}

// Bind the connection event with the listener1 function
eventEmitter.addListener('connection', listener1);

// Bind the connection event with the listener2 function
eventEmitter.on('connection', listener2);

var eventListeners = require('events').EventEmitter.listenerCount
   (eventEmitter,'connection');
console.log(eventListeners + " listener(s) listening to connection event");

// Fire the connection event 
eventEmitter.emit('connection');

// Remove the binding of listener1 function
eventEmitter.removeListener('connection', listener1);
console.log("listener1 will not listen now.");

// Fire the connection event 
eventEmitter.emit('connection');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + " listener(s) listening to connection event");

console.log("Program Ended.");
/** Outputs
2 listener(s) listening to connection event
listener1 executed.
listener2 executed.
listener1 will not listen now.
listener2 executed.
1 listener(s) listening to connection event
Program Ended.
*/
```

### Working with buffers (binary data):
Generally, Buffer refers to the particular memory location in memory. Buffer and array have some similarities, but the difference is array can be any type, and it can be resizable. Buffers only deal with binary data, and it can not be resizable. Each integer in a buffer represents a byte. console.log() function is used to print the Buffer instance.

Buffer class is a global class that can be accessed in an application without importing the buffer module.

https://www.geeksforgeeks.org/what-is-buffer-in-node-js/

```js
buf = new Buffer(256);
len = buf.write("Simply Easy Learning");

console.log("Octets written : "+  len); // Octets written : 20


buf2 = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
  buf2[i] = i + 97;
}

console.log( buf2.toString('ascii'));       // outputs: abcdefghijklmnopqrstuvwxyz
console.log( buf2.toString('ascii',0,5));   // outputs: abcde
console.log( buf2.toString('utf8',0,5));    // outputs: abcde
console.log( buf2.toString(undefined,0,5)); // encoding defaults to 'utf8', outputs abcde

```
### Streams:
Streams are objects that let you read data from a source or write data to a destination in continuous fashion. In Node.js, there are four types of streams −

- Readable − Stream which is used for read operation.
- Writable − Stream which is used for write operation.
- Duplex − Stream which can be used for both read and write operation.
- Transform − A type of duplex stream where the output is computed based on input.

Each type of Stream is an EventEmitter instance and throws several events at different instance of times. For example, some of the commonly used events are −

- data − This event is fired when there is data is available to read.
- end − This event is fired when there is no more data to read.
- error − This event is fired when there is any error receiving or writing data.
- finish − This event is fired when all the data has been flushed to underlying system.

* ReadFile vs ReadFromStream

ReadFile- It is used to read files into memory completely before it is available for the client-side. createReadStream - It takes small parts of a file loads them into the memory and makes them visible for the client-side more briskly


* Piping the Streams: Piping is a mechanism where we provide the output of one stream as the input to another stream. It is normally used to get data from one stream and to pass the output of that stream to another stream.

```js
var fs = require("fs");

// Create a readable stream
var readerStream = fs.createReadStream('input.txt');

// Create a writable stream
var writerStream = fs.createWriteStream('output.txt');

// Pipe the read and write operations
// read input.txt and write data to output.txt
readerStream.pipe(writerStream);

console.log("Program Ended");
```

* Chaining the Streams: Chaining is a mechanism to connect the output of one stream to another stream and create a chain of multiple stream operations. It is normally used with piping operations.

```js
var fs = require("fs");
var zlib = require('zlib');

// Compress the file input.txt to input.txt.gz
fs.createReadStream('input.txt')
   .pipe(zlib.createGzip())
   .pipe(fs.createWriteStream('input.txt.gz'));
  
console.log("File Compressed.");
```

### File System (`fs`):
Node implements File I/O using simple wrappers around standard POSIX functions.

Every method in the `fs` module has synchronous as well as asynchronous forms. Asynchronous methods take the last parameter as the completion function callback and the first parameter of the callback function as error. 

```js
var fs = require("fs");

// Asynchronous read
fs.readFile('input.txt', function (err, data) {
   if (err) {
      return console.error(err);
   }
   console.log("Asynchronous read: " + data.toString());
});

// Synchronous read
var data = fs.readFileSync('input.txt');
console.log("Synchronous read: " + data.toString());

console.log("Program Ended");
```

* there are `fs.open(path, flags[, mode], callback)`,`fs.writeFile(filename, data[, options], callback)`, `fs.stat(path, callback)`, `fs.close(fd, callback)`, `fs.ftruncate(fd, len, callback)`, `fs.unlink(path, callback)` to delete file, some methods to work with directory like `fs.mkdir()`, `readdir()`, `rmdir()`, etc. [fd = file descriptor]

### Global Properties/Methods and Objects (No need to require/import):
`__filename`, `__dirname`, `setTimeout(callback, ms)` & `clearTimeout(t)`, `setInterval(cb, ms)`, etc are available as Globally accessible Prop/Methods.


`console` to print information on stdout and stderr. and `process` to get information on current process. Provides multiple events related to process activities are also globally available.

### Utility Modules
`OS Module` => Provides basic operating-system related utility functions.

`Path Module` => Provides utilities for handling and transforming file paths.

`Net Module` => Provides both servers and clients as streams. Acts as a network wrapper.

`DNS Module` => Provides functions to do actual DNS lookup as well as to use underlying operating system name resolution functionalities.

`Domain Module` => Provides ways to handle multiple different I/O operations as a single group.


### Web Module:
Node.js provides an http module which can be used to create an HTTP server to receive external request or an HTTP client to send request to a server.

* Vanilla Http Server

```js
var http = require('http');
var fs = require('fs');
var url = require('url');

// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   
   if (pathname == '/') {
    pathname = '/template.html'
   }
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      } else {	
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': 'text/html'});	
         
         // Write the content of the file to response body
         response.write(data.toString());		
      }
      
      // Send the response body 
      response.end();
   });   
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/')
```

* template.html, which will be sent as response

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template For Server</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
```

* NodeJS client sending http request to a server

```js
var http = require('http');

// Options to be used by request 
var options = {
   host: 'localhost',
   port: '8081',
   path: '/'  
};

// Callback function is used to deal with response
var callback = function(response) {
   // Continuously update stream with data
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      // Data received completely.
      console.log(body);
   });
}
var req = http.request(options, callback);
req.end();
```


### Vanilla RESTful API with NodeJS (CRUD)
With the `http.createServer((request, response) => {/**/});`, request object contain all the necessary information to identify GET, POST, PUT, DELETE request through `request.method` prop and `request.url` to detect the api route.
* Simple GET implementation

```js
const http = require("http");
const fs = require('fs');

const data = new Promise ((resolve, reject)=>{
    fs.readFile("./data.json", "utf-8", function (err, buffer) {
        if (err) reject(err); else resolve(buffer)
    })
})

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    async function (req, res) {
      //  GET: /api/blogs
      if (req.url === "/api/blogs" && req.method === "GET") {
         // get the blogs.
         const bufferPromise = await data;
         const blogs = JSON.parse(bufferPromise)
         console.log(blogs)
         // set the status code, and content-type
         res.writeHead(200, { "Content-Type": "application/json" });
         // send the data
         res.end(JSON.stringify(blogs)); // data <string> | <Buffer> | <Uint8Array>
      }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### NodeJS Application Scaling:
Node.js runs in a single-thread mode, but it uses an event-driven paradigm to handle concurrency. It also facilitates creation of child processes to leverage parallel processing on multi-core CPU based systems.

Child processes always have three streams `child.stdin`, `child.stdout`, and `child.stderr` which may be shared with the stdio streams of the parent process.

Node provides `child_process` module which has the following three major ways to create a child process. Import it by `require('child_process');`

1. `exec` − child_process.exec method runs a command in a shell/console and buffers the output. ex, `child_process.exec(command[, options], callback)`
2. `spawn` − child_process.spawn launches a new process with a given command. ex, `child_process.spawn(command[, args][, options])`
3. `fork` − The child_process.fork method is a special case of the spawn() to create child processes. The fork method returns an object with a built-in communication channel in addition to having all the methods in a normal ChildProcess instance. ex, `child_process.fork(modulePath[, args][, options])`