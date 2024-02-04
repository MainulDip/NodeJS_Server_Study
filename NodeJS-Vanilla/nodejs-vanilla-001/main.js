var http = require("http");

const server = http.createServer(function(request, response){
    response.writeHead(200, 'text/plain');
    response.end("Response form Vanilla NodeJS app server.");
})

server.listen(8080);

console.log('Server running at http://127.0.0.1:8081/');