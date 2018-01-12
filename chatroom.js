// Chatroom Server
// ===============
// ISSUES: 
// 1) When a new client reconnect, the chat again append
// 2) Show list of names in chat
// 3) Show client's name

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();

var messages = [];

var storeMessageInMem = function(name, data){
    messages.push({name: name, data: data});
    if (messages.length > 10) {
        messages.shift();
    }
}

var storeMessageRedis = function(name, data){
    var message = JSON.stringify({name:name, data:data});
    redisClient.lpush("messages", message, function(err, res){
        redisClient.ltrim("messages", 0, 9);
    });
}

io.on('connection', function(client){
    // client.emit('messages', { hello: 'Hello from socket.io server!'});
    console.log("client connected...");
});

io.on('connection', function(client){
    client.on('join', function(name){
        client.nickname = name;
        console.log(name + " joined the chat!");
        // messages.forEach(function(message) {	
        //     client.emit("messages", message.name + ": " + message.data);	
        // });
        redisClient.lrange("messages", 0, -1, function(err, messages){
            messages = messages.reverse();
            messages.forEach(function(message) {
                message =  JSON.parse(message);	
                client.emit("messages", message.name + ": " + message.data);	
            });
        });
    });
    client.on('messages', function(message){
        // var nickname = "nickname";
        var nickname = client.nickname;
        console.log(nickname + ": " + message);       
        client.broadcast.emit("messages", nickname + ": " + message);
        client.emit("messages", nickname + ": " + message);
        storeMessageRedis(client.nickname, message);
    });
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});
server.listen(8080);