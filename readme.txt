namespace HLData
{
//    TdFile =  record          // усредненные за сутки
//  month : byte;  {  0	3 - Дата	месяц:число :год ( 2 мл. цифры ), binary }
//  day	: byte;
//  year	: byte;
//  Q	: single;{  3	4 - ЗНАЧЕНИЕ M^3		число с ПТ  single ?   }
//  HourB	: byte;{  ......				 1 byte - ноли	   }
//  MinB	: byte;{  ......				 1 byte - ноли	   }
//  HourE	: byte;{  ......				 1 byte - ноли	   }
//  MinE	: byte;{  ......				 1 byte - ноли	   }
//  dP	: single;{ 11	4 - СР.ПЕР. (Kг/M^2)		число с ПТ  single }
//  P	: single;{ 15	4 - CP. P.  (Kг/CM^2)		число с ПТ    ""   }
//  T	: single;{ 19	4 - CP. T.  (град C)		число с ПТ    ""   }
//  Ro	: single;{ 23	4 - СР. КОРЕНЬ			число с ПТ    ""   }
//  { Всего 27 byte на день }
//  

    [Serializable]
    public class DayData : HlData
    {
        System.Byte _hostDateMonth;     //
        System.Byte _hostDateDate;      //
        System.Byte _hostDateYear;      //

        public DayData()
        {

        }

        public DayData(System.Byte[] binData)
        {
            if (binData == null) throw new ArgumentNullException("Null array! Can't init InstantData");
            if (binData.Length != 27) throw new ArgumentOutOfRangeException("Can't init DayData Size array <> 27 bytes" );
            this.ParseBinData(binData);
        }
        private void ParseBinData(System.Byte[] binData)
        {
            System.Byte[] singlebuffer = new System.Byte[4];

            _hostDateMonth = binData[0];
            _hostDateDate = binData[1];
            _hostDateYear = binData[2];

            Array.Copy(binData, 3, singlebuffer, 0, 4);
            Q = BinToSingle(singlebuffer);

            Array.Copy(binData, 11, singlebuffer, 0, 4);
            DP = BinToSingle(singlebuffer);

            Array.Copy(binData, 15, singlebuffer, 0, 4);
            P = BinToSingle(singlebuffer);

            Array.Copy(binData, 19, singlebuffer, 0, 4);
            T = BinToSingle(singlebuffer);

            TimeStamp = new DateTime(_hostDateYear + 2000, _hostDateMonth, _hostDateDate, 0, 0, 0);
        }
    }
}


//ThFile = packed record          // файл с оперативной информацией на заданное время
//  HDate : THostDate;
//  Minute: byte;
//  Q	: single;{  5	4 - ЗНАЧЕНИЕ M^3		число с ПТ  single ?   }
//  E	: single;{  ......				 4 byte - ноли	   }
//  dP	: single;{ 13	4 - СР.ПЕР. (Kг/M^2)		число с ПТ  single }
//  P	: single;{ 17	4 - CP. P.  (Kг/CM^2)		число с ПТ    ""   }
//  T	: single;{ 21	4 - CP. T.  (град C)		число с ПТ    ""   }
//  Ro	: single;{ 25	4 - СР. КОРЕНЬ			число с ПТ    ""   }
//     { Всего 29 byte на час  744 часов в файле содержится за 31 день }
//
//  THostDate  = packed record
//      m,d,y,h : byte;
//  end;

namespace HLData
{
    [Serializable]
    public class HourData : HlData
    {
        System.Byte _hostDateMonth;
        System.Byte _hostDateDate;
        System.Byte _hostDateYear;
        System.Byte _hostDateHour;
        System.Byte _hostDateMinute;

        public HourData()
        {

        }

        public HourData(System.Byte[] binData)
        {
            if (binData == null) throw new ArgumentNullException("Null array! Can't init HourData");
            if (binData.Length != 29) throw new ArgumentOutOfRangeException("Can't init HourData Size array <> 29");

            this.ParseBinData(binData);
        }
        private void ParseBinData(System.Byte[] binData)
        {
            System.Byte[] singlebuffer = new System.Byte[4];

            _hostDateMonth = binData[0];
            _hostDateDate = binData[1];
            _hostDateYear = binData[2];
            _hostDateHour = binData[3];
            _hostDateMinute = binData[4];

            Array.Copy(binData, 5, singlebuffer, 0, 4);
            Q = BinToSingle(singlebuffer);

            Array.Copy(binData, 13, singlebuffer, 0, 4);
            DP = BinToSingle(singlebuffer);

            Array.Copy(binData, 17, singlebuffer, 0, 4);
            P = BinToSingle(singlebuffer);

            Array.Copy(binData, 21, singlebuffer, 0, 4);
            T = BinToSingle(singlebuffer);

            TimeStamp = new DateTime(_hostDateYear + 2000, _hostDateMonth, _hostDateDate, _hostDateHour, _hostDateMinute, 0);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

//TcFile = packed record          // мгновенный на момент опроса
//+ dP	    : single;{	0   4 - Перепад давления	    число с ПТ	single }
//+ StatP     : single;{	4   4 - Стат. давление			""             }
//+ T	    : single;{	8   4 - Температура			""             }
//  Root	    : single;{ 12   4 - Значение корня			""             }
//+ CurrQ     : single;{ 16   4 - Текущий расход			""             }
//+ DayQ	    : single;{ 20   4 - Дневной расход			""             }
//+ YDayQ	    : single;{ 24   4 - Объем за прошлые сутки 			       }
//  TotalQ    : single;{ 28   4 - Общий расход			""             }
//  Ksheroh   : single;{ 32   4 - KII  шерох. т/п 	    число с ПТ	single }
//  Kpritupl  : single;{ 36   4 - KIII притупл.2		    число с ПТ	  ""   }
//  Al	    : single;{ 40   4 - Альфа			    число с ПТ	  ""   }
//  Eps	    : single;{ 44   4 - Эпсилон 			""             }
//  Kt	    : single;{ 48   4 - Kt - темп. расшир.		""             }
//  Ksg	    : single;{ 52   4 - K сжимаемости			""             }
//  KRe	    : single;{ 56   4 - KRe K Рейнольдса		""             }
//  Re	    : single;{ 60   4 - Число Рейнольдса		""             }
//  Q0	    : single;{ 64   4 - Q0				""             }
//  M	    : single;{ 68   4 - M			    число с ПТ	  ""   }
//  rsr2	    : array[1..28] of byte;  { unknown data }
//  Dinvazk   : single;{ 100  4 - Дин.вязкость Mu 	    число с ПТ	  ""   }
//  rsr3	    : array[1..24] of byte;  { unknown data }
//  HDate   : THostDate;
//  minute  : byte;
//  sec	  : byte;
//      =========   134 byte    ====================

namespace HLData
{
    [Serializable]
    public class InstantData : HlData
    {

        public System.Single DayQ {get;set;}
        public System.Single YDayQ {get;set;}
        public System.Single TotalQ { get; set; }

        System.Byte _hostDateMonth;     //128
        System.Byte _hostDateDate;      //129
        System.Byte _hostDateYear;      //130
        System.Byte _hostDateHour;      //131
        System.Byte _hostDateMinute;    //132
        System.Byte _hostDateSec;       //133

        public static InstantData operator +(InstantData a, InstantData b)
        {
            if (a == null && b == null) return null;
            if (a == null || a.Q == 0) return b;
            if (b == null || b.Q == 0) return a;

            var result = new InstantData();
            result.TimeStamp = a.TimeStamp;
            result.DP = (a.DP + b.DP) / 2; ;
            result.P = (a.P + b.P) / 2;
            result.T = (a.T + b.T) / 2;
            result.Q = (a.Q + b.Q);
            result.YDayQ = (a.YDayQ + b.YDayQ);
            result.DayQ = (a.DayQ + b.DayQ);
            result.TotalQ = (a.TotalQ + b.TotalQ);
            return result;
        }

        public InstantData()
        {

        }

        public InstantData(System.Byte[] binData)
        {
            if (binData == null) throw new ArgumentNullException("Null array! Can't init InstantData");
            //if (binData.Length != CDValues.insRecSize) throw new ArgumentOutOfRangeException("Can't init InstantData Size array <> " + CDValues.insRecSize.ToString());
            this.ParseBinData(binData);
        }
        private void ParseBinData(System.Byte[] binData)
        { 
            System.Byte[] singlebuffer = new System.Byte[4];

            Array.Copy(binData, 0, singlebuffer, 0, 4);
            DP = BinToSingle(singlebuffer);

            Array.Copy(binData, 4, singlebuffer, 0, 4);
            P = BinToSingle(singlebuffer);

            Array.Copy(binData, 8, singlebuffer, 0, 4);
            T = BinToSingle(singlebuffer);

            Array.Copy(binData, 16, singlebuffer, 0, 4);
            Q = BinToSingle(singlebuffer);

            Array.Copy(binData, 20, singlebuffer, 0, 4);
            DayQ = BinToSingle(singlebuffer);

            Array.Copy(binData, 24, singlebuffer, 0, 4);
            YDayQ = BinToSingle(singlebuffer);

            Array.Copy(binData, 28, singlebuffer, 0, 4);
            TotalQ = BinToSingle(singlebuffer);


            _hostDateMonth = binData[128];     //128
            _hostDateDate = binData[129];      //129
            _hostDateYear = binData[130];      //130
            _hostDateHour = binData[131];      //131
            _hostDateMinute = binData[132];    //132
            _hostDateSec = binData[133];       //133

            TimeStamp = new DateTime(_hostDateYear + 2000, _hostDateMonth, _hostDateDate, _hostDateHour, _hostDateMinute, _hostDateSec);
        }

    } 
}


using System;
using System.Collections.Generic;
using System.Text;

//type TsFile = record          // статистический файл тип 1 (на момент опроса)
//  Name		: TLineName;
//  Density	: Single;
//  CO2		: Single;
//  N2		: Single;
//  PipeID	: Single;
//  OrifID	: Single;
//  AtmP		: Single;
//  CutOff	: Single;
//  Span		: Single;
//  LoCellSpan	: Single;
//  HiCellSpan	: Single;
//  DPswitch	: Single;
//  TapType	: Byte;
//  PressType	: Byte;
//  Roughness	: Single;
//  PipeBeta	: Single;
//  OrifBeta	: Single;
//  DPMin 	: Single;
//  DPMax 	: Single;
//  PMin		: Single;
//  PMax		: Single;
//  HDate 	: THostDate;
//  minute	: byte;
//  sec		: byte;
//    =====  96 bytes   =================

namespace HLData
{
    [Serializable]
    public class StaticData : BaseHlData
    {
        //System.Byte[] _Name	= new System.Byte[16];  //
        System.Single _Density;      //

        public System.Single Density
        {
            get { return _Density; }
        }
        System.Single _CO2;         //

        public System.Single CO2
        {
            get { return _CO2; }
        }
        System.Single _N2;          //

        public System.Single N2
        {
            get { return _N2; }
        }

        System.Byte _hostDateMonth;     //
        System.Byte _hostDateDate;      //
        System.Byte _hostDateYear;      //
        System.Byte _hostDateHour;      //
        System.Byte _hostDateMinute;    //
        System.Byte _hostDateSec;       //

        public StaticData()
        {

        }

        public StaticData(System.Byte[] binData)
        {
            if (binData == null) throw new ArgumentNullException("Null array! Can't init InstantData");
            //if (binData.Length != CDValues.statRecSize) 
            //    throw new ArgumentOutOfRangeException("Can't init StaticData Size array <> " + 
            //        CDValues.statRecSize.ToString());
            this.ParseBinData(binData);
        }
        private void ParseBinData(System.Byte[] binData)
        { 
            System.Byte[] singlebuffer = new System.Byte[4];

            Array.Copy(binData, 16, singlebuffer, 0, 4);
            _Density = BinToSingle(singlebuffer);

            Array.Copy(binData, 20, singlebuffer, 0, 4);
            _CO2 = BinToSingle(singlebuffer);

            Array.Copy(binData, 24, singlebuffer, 0, 4);
            _N2 = BinToSingle(singlebuffer);

            _hostDateMonth = binData[90];     //90
            _hostDateDate = binData[91];      //
            _hostDateYear = binData[92];      //
            _hostDateHour = binData[93];      //
            _hostDateMinute = binData[94];    //
            _hostDateSec = binData[95];       //95

        }

    }
}
