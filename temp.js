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

  async function parse(){
    let buff = await readFileChunc('d:\\S056R1R.316', -29, 29).catch( e=>console.log(e) );
    if (buff){
      let res = Types.HourData.parse(buff); //27 - day, 29 - hour
      console.log(res)  
    }
  
    let buff1 = await readFileChunc('d:\\S091R1D.316', -27, 27).catch( e=>console.log(e) );
    let res1 = Types.DayData.parse(buff1, 7); //27 - day, 29 - hour
    console.log(res1)
  
    let buff2 = await readFileChunc('d:\\S001R1C.316', 0, 134).catch( e=>console.log(e) );
    let res2 = Types.InstantData.parse(buff2); //27 - day, 29 - hour
    console.log(res2)  
  }