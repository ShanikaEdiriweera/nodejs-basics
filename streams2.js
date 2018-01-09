var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) {
    var file = fs.createWriteStream('newREADME.md');
    fileBytes = request.headers['content-length'];
    console.log("Upload file size: "+fileBytes+"Bytes.");

    var uploadBytes = 0;

    //readable event listener to track progress
    console.log("readable event listener to track progress");
    request.on('readable', function(){
        console.log("'readable' event occured.\n");
        var chunk = null;
        let count = 0;
        while(null !== (chunk = request.read())){
            count++;
            console.log("chunk-"+count+": "+chunk.toString());

            uploadBytes += chunk.length;
            var progress = (uploadBytes / fileBytes) * 100;
            response.write("progress: "+ parseInt(progress, 10)+"%\n");
            console.log("progress: "+ parseInt(progress, 10)+"%\n");
        }
    });

    //pipe the input file to output file
    console.log("pipe the input file to output file");
    request.pipe(file);
    
    
    request.on('end', function(){
        response.end("uploaded!");
    });
}).listen(8080);

//request - curl --upload-file "README.md" http://localhost:8080
//replace README.md with a large file like a video