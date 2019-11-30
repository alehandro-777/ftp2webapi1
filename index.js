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

var files = ['S056R1R.316', 'S091R1D.316', 'S001R1C.316'];

function loadFile(file, pos){
  return new Promise(function(resolve, reject) {
    
    let chunks = [];
    //c.restart(pos, function(err){}); 
    c.get(file, function(err, stream) {      
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

function load(){

    loadFile('./1/S056R1R.316').then( 
      (data) => {
        let hour = Types.HourData.parse(data, -29);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile('S001R1C.316').then( 
      (data) => {
        let hour = Types.InstantData.parse(data);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile('S091R1D.316').then( 
      (data) => {
        let hour = Types.DayData.parse(data, -27, 7);
        console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile('S055R1S.316').then( 
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
  load();
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
 
      //let res = Types.InstData.parse(contents);   //27 - day, 29 - hour
      //let res = Types.DayData.parse(contents, -27); //27 - day, 29 - hour
      //let res = Types.HourData.parse(buffr); //27 - day, 29 - hour
      //let stat = Types.StatData.parse(contents);    //27 - day, 29 - hour

//readFileChunc('d:\\S056R1R.316', -29, 29);



