const Types = require('./hl-types');

var Client = require('ftp');
var fs = require('fs');

var config = {    

    host     : 'localhost',
    port     : 21,
    user     : 'ftpuser1',
    password : ''

}

var c = new Client();

/*
c.on('ready', function() {
  c.list(function(err, list) {
    if (err) throw err;
    console.dir(list);
    c.end();
  });
});
c.connect(config);
*/

/*
c.on('ready', function() {
   
    
    c.restart(0, function(err){
        //console.log(err);
    });    
    

    c.get('S056R1R.316', function(err, stream) {
      
      if (err) {
        console.log(err);
        return;  
      }

      stream.once('close', function() { 
        c.end(); 
      });
      
      stream.pipe(fs.createWriteStream('d:\\S056R1R.316'));

    });

  });

// connect to localhost:21 as anonymous
c.connect(config);
*/

readFileChunc('d:\\S056R1R.316', -29, 29);


function readFileChunc(filename, offset, size){
  
  let stats = fs.statSync(filename);
  let fileSizeInBytes = stats["size"];

  let buffr = new Buffer.alloc(size);
  
  let start = offset >= 0 ? offset : fileSizeInBytes + offset;

  fs.open(filename, 'r', function (err, fd) {
    
    if (err) { return console.error(err); }

    fs.read(fd, buffr, 0, size, start, function (err, bytes) {

    //let res = Types.InstData.parse(contents);   //27 - day, 29 - hour
    //let res = Types.DayData.parse(contents, -27); //27 - day, 29 - hour
    let res = Types.HourData.parse(buffr); //27 - day, 29 - hour
    //let stat = Types.StatData.parse(contents);    //27 - day, 29 - hour
  
    console.log(res);


      if (err) throw err;

        // Close the opened file.
        fs.close(fd, function (err) {
            if (err) throw err;
        });
    });
});
  return buffr;
}

