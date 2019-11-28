class DayData {
    constructor() {
      this.p = 0;
      this.t = 0;
      this.dp = 0;
      this.q = 0;
      this.start;
      this.end;
      this.quality = 0;      
    }
    static parse (arrayBuffer, hour) {
       
        let mon = arrayBuffer[0] -1;
        let day = arrayBuffer[1];
        let year = arrayBuffer[2];
        
        let result = new DayData();
        
        result.q = arrayBuffer.readFloatLE(3);
        result.dp = arrayBuffer.readFloatLE(11);
        result.p = arrayBuffer.readFloatLE(15);
        result.t = arrayBuffer.readFloatLE(19);


        result.start =  new Date(year + 2000, mon, day, hour);
        result.end =  new Date(year + 2000, mon, day + 1, hour);
        result.quality = 192;
        return result;
    }
}
class HourData {
    constructor() {
      this.p = 0;
      this.t = 0;
      this.dp = 0;
      this.q = 0;
      this.start;
      this.end;
      this.quality = 0;      
    }
    static parse (arrayBuffer) {

        let mon = arrayBuffer[0]-1;
        let day = arrayBuffer[1];
        let year = arrayBuffer[2];
        let hour = arrayBuffer[3];
        let mm = arrayBuffer[4];

        let result = new HourData();
        
        result.q = arrayBuffer.readFloatLE(5);
        result.dp = arrayBuffer.readFloatLE(13);
        result.p = arrayBuffer.readFloatLE(17);
        result.t = arrayBuffer.readFloatLE(21);

        result.start =  new Date(year + 2000, mon, day, hour, mm);
        result.end =  new Date(year + 2000, mon, day, hour + 1, mm);
        result.quality = 192;
        return result;
    }
}

class InstantData {
    constructor() {
      this.p = 0;
      this.t = 0;
      this.dp = 0;
      this.q = 0;
      this.currday;
      this.lastupdate;
      this.quality;
    }
    static parse (arrayBuffer) {
        let mon = arrayBuffer[128]-1;
        let day = arrayBuffer[129];
        let year = arrayBuffer[130];
        let hour = arrayBuffer[131];
        let mm = arrayBuffer[132];
        let ss = arrayBuffer[133];

        let result = new InstantData();
                
        result.dp = arrayBuffer.readFloatLE(0);
        result.p = arrayBuffer.readFloatLE(4);
        result.t = arrayBuffer.readFloatLE(8);
        result.q = arrayBuffer.readFloatLE(16);
        result.currday = arrayBuffer.readFloatLE(20);
        
        result.lastupdate =  new Date(year + 2000, mon, day, hour, mm, ss);
        result.quality = 192;
        return result;
    }

}

class StatData {
    constructor() {
      this.co2 = 0;
      this.n2 = 0;
      this.ro = 0;
      this.lastupdate = null;
      this.quality = 0;;
    }
    static parse (arrayBuffer) {
        let mon = arrayBuffer[90]-1;
        let day = arrayBuffer[91];
        let year = arrayBuffer[92];
        let hour = arrayBuffer[93];
        let mm = arrayBuffer[94];
        let ss = arrayBuffer[95];

        let result = new StatData();
                
        result.ro = arrayBuffer.readFloatLE(16);
        result.co2 = arrayBuffer.readFloatLE(20);
        result.n2 = arrayBuffer.readFloatLE(24);

        
        result.lastupdate =  new Date(year + 2000, mon, day, hour, mm, ss);
        result.quality = 192;
        return result;
    }

}

class FlowPollCfgData {
  constructor(ip, basedir, isAbsP, haveRfile, fNameTemplate,cHour) {
    this.ip = ip;
    this.basedir = basedir;
    this.fNameTemplate = fNameTemplate;
    this.isAbsP = isAbsP;
    this.haveRfile = haveRfile;
    this.cHour = cHour;
  }
}

module.exports = {
    DayData : DayData,
    HourData : HourData,
    InstantData : InstantData,
    StatData : StatData,
    FlowPollCfgData : FlowPollCfgData,
  }
