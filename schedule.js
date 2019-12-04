
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

class UpdateScheduleLine {
    constructor( id ) {
      this.id = id;
      this.instFile;
      this.hourFile;
      this.dayFile;
      this.statFile;
    }
}

class UpdateSchedule {
    constructor( timeoutC, timeoutH, timeoutD, timeoutS ) {
      this.timeouts = {};
      this.timeouts.currInst = timeoutC;
      this.timeouts.lastHour = timeoutH;
      this.timeouts.lastDay = timeoutD;
      this.timeouts.currStat = timeoutS;
      this.lines = [];
    }
    update(id, prop, value){
        let el = this.lines.find(l=>l.id === id);
        if (!el) {
            el = new UpdateScheduleLine( id );
            el[prop] = value;    
            this.lines.push(el);
        }
        el[prop] = value;
    }
    needUpdate(id, prop){
        let el = this.lines.find(l=>l.id === id);
        if (el) {
          //null or undefined не обновилось ни разу
          if (!el[prop]) return true;
          //
          let dt = Date.now() - el[prop];
          return (dt > this.timeouts[prop]*1000) ? true : false;
        }
        //строка не найдена - нужно обновить 
        return true;
    }
}

module.exports = {
    UpdateSchedule : UpdateSchedule,
  }

