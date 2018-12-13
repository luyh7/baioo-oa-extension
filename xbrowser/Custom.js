
const NOON_BREAK_LEFT = 12 * 60;
const NOON_BREAK_RIGHT = 13 * 60 + 30;
const NOON_BREAK_TIME = NOON_BREAK_RIGHT - NOON_BREAK_LEFT;
let dates = document.body.getElementsByClassName("cal-now-month-date");
// 实例函数，可以供popup.html中调用
function helloWorld(){
    let today = new Date();
    console.log("today:"+(today.getMonth()+1)+"-"+today.getDate());
    let weekTime = calcWeekTime() / 60;
    let monthTime = calcMonthTime() / 60;
    console.log("本周工作时长：" + weekTime);
    console.log("本月工作时长：" + monthTime);
    let title = document.getElementById("breadcrumb").getElementsByClassName("title")[0];
    let str = "<span style='font-weight:bold'>我的考勤</span>"
    str += (" 本月工作时长：" + setColor(weekTime.toFixed(1),"#0000ff"));
    str += (" 本周工作时长：" + setColor(monthTime.toFixed(1), "#ff0000"));
    title.innerHTML = str;
}
if(document.readyState == "complete")
{
    helloWorld();
}
else
{
    let oldOnload =window.onload;
    if(typeof window.onload != 'function'){
        window.onload = helloWorld;
    }else{
        window.onload = function(){
            oldOnload();
            helloWorld();
        }
    }
}

function setColor(str, color) {
    return "<span style='color:"+color+"'>"+str+"</span>";
}

function calcWeekTime(){
    let workTime = 0;
    let isThisWeek = false;
    let today = new Date();
    for(let i = 0; i < dates.length; ++i)
    {
        let date = dates[i];
        let time = date.getElementsByClassName("time")[0].innerText;
        let sign = date.getElementsByClassName("sign sign-red4 sign-hover")[0];
        let day = parseInt(date.getAttribute("data-week"));
        let record = trim(sign == null? "":sign.title);
        if(parseInt(time.split('-')[0]) == today.getMonth()+1 && parseInt(time.split('-')[1]) == today.getDate())
        {
            isThisWeek = true;
        }
        workTime += calcDayTime(record);
        if(day == 6)
        {
            console.log("第"+ parseInt(i/7) + "周工作时长：" + workTime / 60);
            if(isThisWeek)
            {
                break;
            }
            workTime = 0;
        }
    }
    return workTime;
}

function calcMonthTime(){
    let workTime = 0;
    for(let i = 0; i < dates.length; ++i)
    {
        let date = dates[i];
        let time = date.getElementsByClassName("time")[0].innerText;
        let sign = date.getElementsByClassName("sign sign-red4 sign-hover")[0];
        let record = trim(sign == null? "":sign.title);
        workTime += calcDayTime(record);
    }
    return workTime;
}

//计算一天的工作时长(分钟)
function calcDayTime(str){
    if(str == null || str == "" || str.length < 11)
    {
        return 0;
    }
    let startTime = 0;
    startTime += parseInt(str[0]) * 10 * 60;
    startTime += parseInt(str[1]) * 60;
    startTime += parseInt(str[3]) * 10;
    startTime += parseInt(str[4]);

    let endTime = 0;
    endTime += parseInt(str[str.length-5]) * 10 * 60;
    endTime += parseInt(str[str.length-4]) * 60;
    endTime += parseInt(str[str.length-2]) * 10;
    endTime += parseInt(str[str.length-1]);
    return delNoonBreak(startTime, endTime);
}

/**去掉午休时间*/
function delNoonBreak(startTime, endTime) {
    if(startTime < NOON_BREAK_LEFT && endTime > NOON_BREAK_RIGHT)
    {
         endTime -= NOON_BREAK_TIME;
    }
    if(startTime >= NOON_BREAK_LEFT && startTime <= NOON_BREAK_RIGHT)
    {
        startTime = NOON_BREAK_RIGHT;
    }
    if(endTime >= NOON_BREAK_LEFT && endTime <= NOON_BREAK_RIGHT)
    {
        endTime = NOON_BREAK_LEFT;
    }
    return endTime - startTime > 0 ? (endTime - startTime):0;
}

//删除左右两端的空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g,"");
}

//删除左边的空格
function ltrim(str) {
    return str.replace(/(^\s*)/g,"");
}

//删除右边的空格
function rtrim(str) {
    return str.replace(/(\s*$)/g, "");
}