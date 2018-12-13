
let _respData = null;
startup();
function startup() {
    let today = new Date();
    console.log("today:"+(today.getMonth()+1)+"-"+today.getDate());
    getMonthDataAndDo(today.getFullYear(), today.getMonth() + 1, helloWorld);
}

function helloWorld(){
    showDataOnConsole(_respData);
    showTitle();
    showDayTime();
}

function showTitle() {
    let weekTime = calcWeekTime();
    let monthTime = calcMonthTime();
    console.log("本周工作时长：" + weekTime);
    console.log("本月工作时长：" + monthTime);
    let title = document.getElementById("breadcrumb").getElementsByClassName("title")[0];
    let str = "<span style='font-weight:bold'>我的考勤</span>"
    str += (" 本月工作时长：" + setColor(monthTime.toFixed(2),"#0000ff"));
    str += (" 本周工作时长：" + setColor(weekTime.toFixed(2), "#0000ff"));
    title.innerHTML = str;
}

function showDayTime(){
    let docs = document.getElementsByClassName("cal-now-month-date");
    for(let i = 0; i < _respData.result.value.length; ++i)
    {
        let span = docs[i].getElementsByClassName("time")[0];
        let workTime = _respData.result.value[i].workHours;
        if(workTime >= 8)
        {
            span.innerHTML += setColor('<br>(' + workTime +')', "#3aae0c")
        }
        else if(workTime <= 0)
        {
            span.innerHTML += '<br>(' + workTime +')';
        }
        else
        {
            span.innerHTML += setColor('<br>(' + workTime +')', "#ff0000")
        }
    }
}

function showDataOnConsole(response) {
    console.log(response);
}
function setColor(str, color) {
    return "<span style='color:"+color+"'>"+str+"</span>";
}

function getMonthDataAndDo(year, month, callback) {
    $.ajax({
        method:'GET',
        url: 'http://oa.info/attend/statRecord/getMyMonthRecords.json?year='+year+'&month='+month,
        success: function (response) {
            _respData = response;
            callback();
        }
    });
}

function calcWeekTime(){
    let workTime = 0;
    let isThisWeek = false;
    let datas = _respData.result.value;
    for(let i = 0; i < datas.length; ++i)
    {
        let data = datas[i];
        let time = data.date;
        if(isToday(time))
        {
            isThisWeek = true;
        }
        workTime += data.workHours;
        if(data.dayOfWeek == 7)
        {
            console.log("第"+ parseInt(i/7) + "周工作时长：" + workTime);
            if(isThisWeek)
            {
                break;
            }
            workTime = 0;
        }
    }
    return workTime;
}

function isToday(time)
{
    let today = new Date();
    return parseInt(time.split('-')[0]) == today.getFullYear() &&
        (parseInt(time.split('-')[1]) == today.getMonth() + 1)&&
        parseInt(time.split('-')[2]) == today.getDate();

}

function calcMonthTime(){
    let workTime = 0;
    let datas = _respData.result.value;
    for(let i = 0; i < datas.length; ++i)
    {
        let data = datas[i];
        workTime += data.workHours;
    }
    return workTime;
}