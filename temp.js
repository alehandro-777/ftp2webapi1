function readFileChunc(filename, offset, size){

    return new Promise(function(resolve, reject) {
  
      let stats = fs.statSync(filename);
      let fileSizeInBytes = stats["size"];
      let buffr = new Buffer.alloc(size);
  
      let start = (offset >= 0) ? offset : fileSizeInBytes + offset;
      fs.open(filename, 'r', function (err, fd) {      
        if (err) reject(err);
        else {
        fs.read(fd, buffr, 0, size, start, function (err, bytes) {       
          if ( err ) {
            fs.close(fd, function (err) { });
            reject( err );      
          }
          else {
          // Close the opened file.
          fs.close(fd, function (err) { });
          resolve( buffr );
          }
          
        });
      }
    });
    //end promise  
    });
}
