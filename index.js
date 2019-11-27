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
c.restart(50, function(err){
    console.log(err);
});

c.on('ready', function() {
    
    c.restart(50, function(err){
        console.log(err);
    });  

    c.get('S001R1C.316', function(err, stream) {
      if (err) throw err;
      stream.once('close', function() { c.end(); });
      stream.pipe(fs.createWriteStream('d:\\S001R1C.316'));
    });

  });

// connect to localhost:21 as anonymous
c.connect(config);
//c.end();