// Chatroom Server
// ===============
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client){
    // client.emit('messages', { hello: 'Hello from socket.io server!'});
    console.log("client connected...");
});

io.on('connection', function(client){
    client.on('join', function(name){
        client.nickname = name;
        console.log(name + " joined the chat!");
    });
    
    client.on('messages', function(message){
        console.log(nickname + ": " + message);
        var nickname = client.nickname;
        client.broadcast.emit("message", nickname + ": " + message);
        client.emit("messages", nickname + ": " + message);
    });
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

server.listen(8080);