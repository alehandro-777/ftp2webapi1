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

let files;

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

 class RequestCfgData {
  constructor(id, ip, dir, isAbsP, haveRfile, cHour) {
    this.id = id;
    this.ip = ip;
    this.dir = dir;
    this.isAbsP = isAbsP;
    this.haveRfile = haveRfile;
    this.cHour = cHour;
    this.instFile = "";
    this.hourFile = "";
    this.dayFile = "";
    this.statFile = "";
  }
}


function load(ftp){  
  
  if( !files ) return;

  for( let i=0; i<files.length; i++ ) {  

    loadFile(ftp, files[i].hourFile).then( 
      (data) => {
        let hour = Types.HourData.parse(data, -29);
        putRequest(http, files[i].id, hour, "lastHour");
        //console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile(ftp, files[i].instFile).then( 
      (data) => {
        let hour = Types.InstantData.parse(data);
        putRequest(http, files[i].id, hour, "currInst");
        //console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile(ftp, files[i].dayFile).then( 
      (data) => {
        let hour = Types.DayData.parse(data, -27, 7);
        putRequest(http, files[i].id, hour, "lastDay");
        //console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );
    loadFile(ftp, files[i].statFile).then( 
      (data) => {
        let hour = Types.StatData.parse(data);
        putRequest(http, files[i].id, hour, "currStat");
        //console.log(hour);
      }, 
      (err)=>{
        console.log(err);
      }
    );


  }//end for



}

c.on('ready', function() {  

  requestCfg(http);

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
 

function requestCfg(http){
 
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/mpoints?cfg=true',
    method: 'GET'
  }

  let data = '';
  
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    res.on('end', () => {
      //console.log(JSON.parse(data));
      files = (JSON.parse(data));
      //console.log(files);
    });

  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.end()

}

function putRequest( http, id, value, parname ) {
  
  let sv = JSON.stringify( value );
  let svalue = `{ "${parname}" : ${sv} }`;

  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/mpoints/' + id,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': svalue.length
    }
  }

  let data = '';
  
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    // The whole response has been received. Print out the result.
    res.on('end', () => {
      //console.log(JSON.parse(data));
    });

  })
  
  req.on('error', error => {
    console.error(error)
  });

  req.write( svalue );
  req.end();

}
