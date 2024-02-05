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