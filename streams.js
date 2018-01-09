var fs = require('fs');

var file = fs.createReadStream("README.md");

//file.pipe(process.stdout, { end: false });

file.on('readable', function(){
    var chunk = null;
    let count = 0;
    while(null !== (chunk = file.read())){
        count++;
        console.log("chunk-"+count+": "+chunk.toString());
    }
});

//Server
var http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});

  var file = fs.createReadStream('README.md');
  //request - curl -d "Hi from client!" http://localhost:8080
  request.pipe(response, { end: false });
  file.pipe(response);
}).listen(8080);



