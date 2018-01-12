// Chatroom Server
// ===============
// ISSUES: 
// 1) When a new client reconnect, the chat again append
// 2) Add a clear chat button
// 3) clear names list when server disconnect

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
        if (name == null){
            name = 'Anonymous';
        }
        client.nickname = name;
        console.log(name + " joined the chat!");

        //adding names
        client.broadcast.emit("add member", name);
        redisClient.smembers('members', function(err, names) {
            names.forEach(function(name){	
                client.emit('add member', name);	
            });	
        });
        client.emit('add member', client.nickname)
        redisClient.sadd("members", name);

        // reading messages from in-memory messages array
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

    // remove clients on disconnect
    client.on('disconnect', function(name){
        console.log("client disconnected...");
        console.log(client.nickname + " left the chat!");
        client.broadcast.emit("remove member", client.nickname);
        redisClient.srem("members", client.nickname);	
    });
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});
server.listen(8080);