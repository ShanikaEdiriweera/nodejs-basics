var events = require('events');
var EventEmitter = events.EventEmitter;

var chat = new EventEmitter();
var users = [], chatlog = [];

chat.on('message', function(message) {
    console.log("'message' event caught on listener.");
  chatlog.push(message);
  console.log(message);
});

chat.on('join', function(nickname) {
  users.push(nickname);
});

chat.emit('message', "Message event emitted.");

//'request' event
var http = require('http');

var server = http.createServer();
server.on('request', function(request, response) {
  response.writeHead(200);
  response.write("Hello, this is dog");
  response.end();
});

server.on('request', function(request, response) {
    console.log("New request coming in...");
});
  
server.listen(8080);
//request - curl http://localhost:8080