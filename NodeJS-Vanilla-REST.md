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