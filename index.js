const Types = require('./hl-types');
const http = require('http');
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

var files = ['S056R1R.316', 'S091R1D.316', 'S001R1C.316'];

function loadFile(ftp, file, pos){
  return new Promise(function(resolve, reject) {
    
    let chunks = [];
    //c.restart(pos, function(err){}); 
    ftp.get(file, function(err, stream) {      
      if (err) reject(err);
      else {
        stream.on('data', (chunk) => { 
          chunks.push(chunk);  
        });
        stream.once('close', function() { 
          let buf = Buffer.concat(chunks);
          resolve(buf); 
        });      
      }
    });
  });
 }

function load(ftp){

    loadFile(ftp, './1/S056R1R.316').then( 
      (data) => {
        let hour = Types.HourData.parse(data, -29);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile(ftp,'S001R1C.316').then( 
      (data) => {
        let hour = Types.InstantData.parse(data);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile(ftp,'S091R1D.316').then( 
      (data) => {
        let hour = Types.DayData.parse(data, -27, 7);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile(ftp,'S055R1S.316').then( 
      (data) => {
        let hour = Types.StatData.parse(data);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );


}

c.on('ready', function() {  
  load(c);
  c.end();
  //c.connect(config); 
});
c.on('error', function(err) {  
  console.log(err);
  c.end();
  //c.connect(config); 
});
// connect to localhost:21 as anonymous

setInterval(() => {
  c.connect(config);
}, 3000);
 
getFileList(http);

function getFileList(httpClient){
  httpClient.get('http://127.0.0.1:3000/mpoints', (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data));
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

}


