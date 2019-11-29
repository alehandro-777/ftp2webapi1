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

var files = ['S055R1C.316', 'S056R1R.316', 'S055R1S.316', 'S057R1C.316', 'S092R1D.316'];

async function loadFile(dir, file){
  return new Promise(function(resolve, reject) {
    let chunks = [];
    c.get(file, function(err, stream) {      
      if (err) reject(err);
      else {
        stream.on('data', (chunk) => { 
          chunks.push(chunk);  
        });
        stream.on('end', () => {  
          let buf = Buffer.concat(chunks);
          console.log(buf);
        });
        stream.once('close', function() { 
          resolve('Ok'); 
        });
        stream.pipe(fs.createWriteStream(dir + file));      
      }
    });
  });
 }

async function load(){
  for( let i=0; i<files.length; i++ ){
    let result = await loadFile('d:\\', files[i]).catch( e=>console.log(e) );
    if (result) console.log(result);
  }

  await parse();

}

load().catch( e=>console.log(e) ); 

async function parse(){
  let buff = await readFileChunc('d:\\S056R1R.316', -29, 29).catch( e=>console.log(e) );
  if (buff){
    let res = Types.HourData.parse(buff); //27 - day, 29 - hour
    console.log(res)  
  }

  let buff1 = await readFileChunc('d:\\S092R1D.316', -27, 27).catch( e=>console.log(e) );
  let res1 = Types.DayData.parse(buff1, 7); //27 - day, 29 - hour
  console.log(res1)

  let buff2 = await readFileChunc('d:\\S055R1C.316', 0, 134).catch( e=>console.log(e) );
  let res2 = Types.InstantData.parse(buff2); //27 - day, 29 - hour
  console.log(res2)  
}

parse().catch( e=>console.log(e) );

c.on('ready', function() {  
//c.restart(0, function(err){});    

load();

c.end();

});

// connect to localhost:21 as anonymous
c.connect(config);

 
      //let res = Types.InstData.parse(contents);   //27 - day, 29 - hour
      //let res = Types.DayData.parse(contents, -27); //27 - day, 29 - hour
      //let res = Types.HourData.parse(buffr); //27 - day, 29 - hour
      //let stat = Types.StatData.parse(contents);    //27 - day, 29 - hour

//readFileChunc('d:\\S056R1R.316', -29, 29);

async function readFileChunc(filename, offset, size){

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

