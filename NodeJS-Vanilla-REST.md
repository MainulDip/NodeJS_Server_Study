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
```
