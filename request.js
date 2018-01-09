var url = require('url');
var request = require('request');

options = {
  // add URL options here
  protocol: "http",
  host: "search.twitter.com",
  pathname: "/search.json",
  query: {q: "codeschool"},
};

var searchURL = url.format(options);
//console.log(searchURL);

//request(searchURL).pipe(process.stdout);

request(searchURL, function(err, res, body){
    console.log(body);
});