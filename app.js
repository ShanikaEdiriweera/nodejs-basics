var express = require('express');
var app = express();

var quotes = {
    'einstein': 'Life is like riding a bicycle. To keep your balance you must keep moving',
    'berners-lee': 'The Web does not just connect machines, it connects people',
    'crockford': 'The good thing about reinventing the wheel is that you can get a round one',
    'hofstadter': 'Which statement seems more true: (1) I have a brain. (2) I am a brain.'
};

app.get('/tweets', function(req, res){
    res.sendFile(__dirname + "/README.md");
});

app.get('/quotes/:name', function(req, res){
    var author = req.params.name;
    //if the property name is dynamic, use bracket notation
    res.write(quotes[author]); // quotes.author not working
    res.end(); //Required
});

app.get('/quotes2/:name', function(req, res){
    var quote = quotes[req.params.name];
    res.locals = {author: req.params.name, quote: quote};
    res.render('quote.ejs');
    res.end(); //Required
});

app.listen(8080);