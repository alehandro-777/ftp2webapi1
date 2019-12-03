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
    static parse (arrayBuffer, pos, hour=7) {
        let offset =  pos >=0 ? pos : arrayBuffer.length + pos;

        let mon = arrayBuffer[offset + 0] -1;
        let day = arrayBuffer[offset + 1];
        let year = arrayBuffer[offset + 2];
        
        let result = new DayData();
        
        result.q = arrayBuffer.readFloatLE(offset + 3);
        result.dp = arrayBuffer.readFloatLE(offset + 11);
        result.p = arrayBuffer.readFloatLE(offset + 15);
        result.t = arrayBuffer.readFloatLE(offset + 19);

        result.start =  new Date(year + 2000, mon, day, hour);
        result.end =  new Date(year + 2000, mon, day, hour);
        //32 will result in the first day of the next month
        result.end.setDate(day + 1);
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
    static parse (arrayBuffer, pos) {
      let offset =  pos >=0 ? pos : arrayBuffer.length + pos;

        let mon = arrayBuffer[offset + 0] - 1;
        let day = arrayBuffer[offset + 1];
        let year = arrayBuffer[offset + 2];
        let hour = arrayBuffer[offset + 3];
        let mm = arrayBuffer[offset + 4];

        let result = new HourData();
        
        result.q = arrayBuffer.readFloatLE(offset + 5);
        result.dp = arrayBuffer.readFloatLE(offset + 13);
        result.p = arrayBuffer.readFloatLE(offset + 17);
        result.t = arrayBuffer.readFloatLE(offset + 21);

        result.start =  new Date(year + 2000, mon, day, hour, mm);
        result.end =  new Date(year + 2000, mon, day, hour, mm);
        result.end.setHours(hour + 1);
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
    //УТГ 96 байт
    //Флоутек ГОСТ 123 байта
    static parse (arrayBuffer) {
        
      let tmIdx = arrayBuffer.length - 6;
        
        let mon = arrayBuffer[tmIdx +0]-1;
        let day = arrayBuffer[tmIdx +1];
        let year = arrayBuffer[tmIdx +2];
        let hour = arrayBuffer[tmIdx +3];
        let mm = arrayBuffer[tmIdx +4];
        let ss = arrayBuffer[tmIdx +5];

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
