//    S[AAA]R[B][C].[D][EE]

//AAA - номер вычислителя (0..255) [001]
//B - номер линии (1..3) [1]
//C - тип файла (H - оперативные данные, A - аварии, U - вмешательство,
//        D - cуточные, С - мгновенные значения, S - стат параметры) [H]
//    used H C S

//D - месяц (шестнадцатиричное hex) [1]
//EE - год (десятичное 1990 - 2089) [00]

//----------------------------------------------------------------------------------------------------------------
//FILE NAME FORMAT FOR УТГ
//    [AAAA]R[B][C].[D][EE]

//От стандартного отличается только
//АААА - адрес вычислителя в 16-ричном формате

//----------------------------------------------------------------------------------------------------------------
//FILE NAME FORMAT FOR FloBoss
//    F[A][BB][CC][D].[EE][F]

//A – тип файла из старой спецификации
//BB – группа в 16-ричном виде
//СС – адрес в 16-ричном виде
//D – номер нитки в 16-ричном виде
//EE – год в 10-тичном виде
//F – месяц в 16-ричном виде

function getCurrFileName(type, addr, dch)
{
    let ctime = new Date();
    if (type === "flotec")
    {
        let m16 = ctime.getMonth() + 1;
        m16 = m16.toString(16);
        let yy = ctime.getFullYear() - 2000;
        yy = yy.toString();
        return `${addr}${dch}.${m16}${yy}`;
    }
    if (type === "floboss")
    {
        let m16 = ctime.getMonth() + 1;
        m16 = m16.toString(16);
        let yy = ctime.getFullYear() - 2000;
        yy = yy.toString();
        return `F${dch}${addr}.${yy}${m16}`;
    }
    return null;
}

let res = getCurrFileName("flotec", "S001R1", "C");
console.log(res);

res = getCurrFileName("floboss", "FFAA1", "C");
console.log(res);