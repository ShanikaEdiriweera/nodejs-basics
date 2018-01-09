var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.write("Hi\n");
    fs.readFile('README.md', function(error, contents) {
        response.write(contents);
        response.write("Hi\n");
        response.end();
    });
}).listen(8080);

//request - curl http://localhost:8080