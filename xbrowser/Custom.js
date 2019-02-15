
let _respData = null;
let _today = new Date();

startup();
initButton();
function startup() {
    let today = new Date();
    console.log("today:"+(today.getMonth()+1)+"-"+today.getDate());
    getMonthDataAndDo(today.getFullYear(), today.getMonth() + 1, helloWorld, 0);
}

/**
 * 监听翻页按钮
 */
function initButton()
{
    $(document).ready(function(){
        $(".cal-pre-btn").click(function(){
            refreshData(event, -1);
        })
        $(".cal-next-btn").click(function(event){
            refreshData(event, 1);
        })
    });
}

/**
 * 翻页时更新
 * @param event 翻页按钮点击事件
 * @param offset 1:往后翻 -1:往前翻
 */
function refreshData(event, offset){
    let curTarget = event.currentTarget
    if(curTarget.classList.contains("cal-disable"))
    {
        return;
    }
    console.log("click-" + (offset>0 ?"next":"pre"));
    let month = _today.getMonth()+offset;
    let year = _today.getFullYear();
    if(month < 0) {
        month += 12;
        year -= 1;
    }
    else if(month >= 12) {
        month -= 12;
        year += 1;
    }
    _today.setFullYear(year, month);
    getMonthDataAndDo(_today.getFullYear(), _today.getMonth() + 1, helloWorld, 100);
}

/**
 * 更新页面
 */
function helloWorld(){
    preprocess();
    showDataOnConsole(_respData);
    showTitle();
    showWeekTime();
    showDayTime();
}

function preprocess(){
    console.log("beforeSort:");
    console.log(_respData);
    //数据可能因为后端原因是乱序的，需要排序
    let datas = _respData.result.value;
    for(let i = datas.length; i > 0; --i){
        for(let j = i-1; j > 0; --j){
            if(compareDate(datas[j-1].date, datas[j].date) > 0){
                let tmp = datas[j-1];
                datas[j-1] = datas[j];
                datas[j] = tmp;
            }
        }
    }
    _respData.result.value = datas;
    function compareDate(a, b) {
        let date1 = new Date(a);
        let date2 = new Date(b)
        if(date1 > date2) return 1;
        if(date1 < date2) return -1;
        return 0;
    }
}

function showTitle() {
    let weekTime = calcWeekTime();
    let monthTime = calcMonthTime();
    console.log("本周工作时长：" + weekTime);
    console.log("本月工作时长：" + monthTime);
    let title = document.getElementById("breadcrumb").getElementsByClassName("title")[0];
    let str = "<span style='font-weight:bold'>我的考勤</span>"
    let today = new Date();
    str += (" 本月工作时长：" + setColor(monthTime.toFixed(2),"#0000ff"));
    if(today.getFullYear() == _today.getFullYear() && today.getMonth() == _today.getMonth()){
        str += (" 本周工作时长：" + setColor(weekTime.toFixed(2), "#0000ff"));
    }
    title.innerHTML = str;
}

function showDayTime(){
    let docs = document.getElementsByClassName("cal-now-month-date");
    let data = _respData.result.value;
    let offset = 0;
    for(let i = 0; i < data.length; ++i)
    {
        if(docs[i + offset] == null)
        {
            return;
        }
        let dateDt = parseInt(data[i].date.split('-')[2]);
        let dateDoc = parseInt(docs[i + offset].getAttribute("data-date").split('-')[2]);
        if(dateDt != dateDoc)
        {
            offset += dateDt - dateDoc;
        }
        if(docs[i + offset] == null)
        {
            return;
        }
        let span = docs[i + offset].getElementsByClassName("sign sign-red4 sign-hover")[0];
        if(span == null)
        {
            continue;
        }
        let workTime = data[i].workHours;
        if(workTime >= 8)
        {
            span.innerHTML = setColor('' + workTime +'', "#3aae0c")
        }
        else if(workTime <= 0)
        {
            span.innerHTML = '' + workTime +'';
        }
        else
        {
            span.innerHTML = setColor('' + workTime +'', "#ff0000")
        }
    }
}

function showWeekTime() {
    let docs = document.getElementsByClassName("cal-now-month-date");
    let weekTime = 0;
    let data = _respData.result.value;
    let offset = 0;
    for(let i = 0; i < data.length; ++i)
    {
        if(docs[i + offset] == null)
        {
            return;
        }
        weekTime += data[i].workHours;
        let dateDt = parseInt(data[i].date.split('-')[2]);
        let dateDoc = parseInt(docs[i + offset].getAttribute("data-date").split('-')[2]);
        if(docs[i + offset].getAttribute("data-week") == '6')
        {
            docs[i + offset].getElementsByClassName("time")[0].innerHTML += ('<br>'+setColor(weekTime.toFixed(2), "#0000ff"));
            weekTime = 0;
        }
        if(dateDt != dateDoc)
        {
            offset += dateDt - dateDoc;
        }
        if(docs[i + offset] == null)
        {
            return;
        }
    }
}

function showDataOnConsole(response) {
    console.log("afterSort:");
    console.log(response);
}

/**
 * 向服务器请求某年某月的数据并回调
 * @param callback 回调函数
 * @param delay 获得数据后的延迟
 * 如果不设置延迟，翻页后callback会先于页面原本的翻页操作，结果会被覆盖原本的操作覆盖
 */
function getMonthDataAndDo(year, month, callback, delay) {
    $.ajax({
        method:'GET',
        url: 'http://oa.info/attend/statRecord/getMyMonthRecords.json?year='+year+'&month='+month,
        success: function (response) {
            _respData = response;
            setTimeout(callback, delay);
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


function isToday(time)
{
    let today = new Date();
    return parseInt(time.split('-')[0]) == today.getFullYear() &&
        (parseInt(time.split('-')[1]) == today.getMonth() + 1)&&
        parseInt(time.split('-')[2]) == today.getDate();

}

function setColor(str, color) {
    return "<span style='color:"+color+"'>"+str+"</span>";
}