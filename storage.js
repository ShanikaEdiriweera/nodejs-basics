// download and install redis
// run redis database 

var redis = require('redis');
var client = redis.createClient();

client.set("message1", "hello, how are you?");
client.set("message2", "I am fine, how are you?");

client.get("message1", function(err, reply){
    console.log(reply);
});

//lists
client.llen("messages", function(err, length){
    console.log("length: "+length);
});

var message1 = "hi Shanika";
var message2 = "hi how are you?";
client.lpush("messages", message1, function(err, reply){
    console.log("list length: "+reply);
    client.ltrim("messages", 0, 1); // trim list
});

client.lpush("messages", message2, function(err, reply){
    console.log("list length: "+reply);
});

client.lrange("messages", 0, -1, function(err, messages){
    console.log("messages: "+messages);
});
client.del("messages", function(err, reply){
    console.log("list delete :"+reply);
});

//sets
client.sadd("names", "Shanika");
client.sadd("names", "Nadun");

client.smembers("names", function(err, names){
    console.log("names: "+names);
});

client.srem("names", "Nadun");

client.smembers("names", function(err, names){
    console.log("names: "+names);
});

client.srem("names", "Shanika");