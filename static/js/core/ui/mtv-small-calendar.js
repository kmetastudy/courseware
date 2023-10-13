/* Flexbox responsive calendar */
/* https://codepen.io/enxaneta/pen/gPeZdP */

// 마우스로 터치 스크롤 구현하기
// https://nohack.tistory.com/123
// 
// Calendar Manager Module

// Calendar with HTML, CSS, and JavaScript - How to build calendar using HTML, CSS, and JavaScript
// https://www.youtube.com/watch?v=o1yMqPyYeAo
// https://github.com/lashaNoz/Calendar

// https://www.cssscript.com/demo/full-year-calendar/
// https://github.com/Sou-gata/Full-Year-Calendar

// D3.js calendar heatmap
// https://codepen.io/g1eb/pen/KWXzLR

/////////////////////////////////////////////////////////
// CodePen Home
// Calendar
// https://codepen.io/iraycd/pen/PoQeKx

// CodePen Home
// Event Calendar Widget
// https://codepen.io/peanav/pen/DmZEEp 
/////////////////////////////////////////////////////////

// Calendar Window
// https://codepen.io/khadkamhn/pen/vVGBLQ

// Round Calendar
// https://codepen.io/marcobiedermann/pen/AjxBbB

// CodePen Home
// Simple Calendar
// https://codepen.io/jpag82/pen/Nazayx

// '년도'와 '월'을 선택 하는 방법
// https://preview.colorlib.com/theme/bootstrap/calendar-04/

// CodePen Home
// Iconifying Content - Calendar
// https://codepen.io/lonekorean/pen/doXjJG

// Bootstrap Year Calendar
// https://codepen.io/maheshambure21/pen/aNJOqw

// How to Create a Calendar in HTML and CSS
// https://codeconvey.com/how-to-create-a-calendar-in-html-and-css/

export var mtvCalendar = {
    // var objects = {
    startDate : null,
    endDate : null,
    // };

    formatDate : function(year,month,day)
    {
    
        if (month <= 9) 
            month = '0' + month;
        if (day <= 9) 
            day = '0' + day;

        return [year, month, day].join('-');
    },

    formatMonthDate : function(month,day)
    {
    
        if (month <= 9) 
            month = '0' + month;
        if (day <= 9) 
            day = '0' + day;

        return [month, day].join('-');
    },

    formatNaturalMonthDate : function(month,day)
    {
    
        // if (month <= 9) 
        //     month = '0' + month;
        // if (day <= 9) 
        //     day = '0' + day;

        // return [month, day].join('-');
        return month+'월'+day+'일';
    },

    formatSlashMonthDate : function(month,day)
    {
    
        // if (month <= 9) 
        //     month = '0' + month;
        // if (day <= 9) 
        //     day = '0' + day;

        // return [month, day].join('-');
        return month+'/'+day;
    },


    getFormatToday : function()
    {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDate();

        var todayDate = formatDate(year,month+1,day);
        return todayDate;
    },

    daysInMonth :  function(year,month) {
        return new Date(year, month+1, 0).getDate();//29/03/2016 (month + 1)
    },

    firstDayOfTheMonth : function(year,month){
        var firstDay = new Date(year, month, 1);
        return firstDay.getDay();
    },

    // return {
    //     formatDate : formatDate,
    //     formatMonthDate : formatMonthDate,
    //     formatNaturalMonthDate : formatNaturalMonthDate,
    //     formatSlashMonthDate : formatSlashMonthDate,
    //     getFormatToday : getFormatToday,
    //     daysInMonth : daysInMonth,
    //     firstDayOfTheMonth : firstDayOfTheMonth,
    //     startDate : startDate,
    //     endDate : endDate, 
    // };
};


// Small And Cute Calendar Class Module

export var mtvSmallCalendar = function(id,year,month ,months)
{
    this.id = id;
    this.year = year;
    this.month = month;
    this.months = months;
    this.elThis = null;

    this.init();
}

// Month Name Array
mtvSmallCalendar.MonthNamesRy = ["1월", "2월", "3월", "4월", "5월", "6월", 
    "7월", "8월", "9월", "10월", "11월", "12월"];
// Day of Week 
mtvSmallCalendar.DaysOfTheWeekRy = ["일", "월", "화", "수", "목", "금", "토"];

mtvSmallCalendar.ColorTable = ['mtv-sc-Color0','mtv-sc-Color1','mtv-sc-Color2',
    'mtv-sc-Color3','mtv-sc-Color4','mtv-sc-Color5'];

mtvSmallCalendar.ColorIndex = 0;
mtvSmallCalendar.Year = 0;
mtvSmallCalendar.Month = 0;
mtvSmallCalendar.ThisMonth = 0;
mtvSmallCalendar.Today = 0;

mtvSmallCalendar.prototype.setColor = function(day,color)
{
    var scColor = mtvSmallCalendar.ColorTable[color];
    var startDay = mtvSmallCalendar.Year + '-01-01';
    var endDay = mtvSmallCalendar.Year + '-12-31';
    if((startDay <= day) && (endDay >= day))
    {
        var id = 'mtv-sc-id-'+day;
        // var node = document.querySelector(id);
        // node.setAttribute("class",frcColor);
        var node = document.getElementById(id);
        if(node)
            node.setAttribute("class",scColor);
    }
}

mtvSmallCalendar.prototype.createMonthHeader = function(month)
{
    
}

mtvSmallCalendar.prototype.create = function(month)
{

}

mtvSmallCalendar.prototype.init = function()
{
    // 
}

/////////////// Small Calendar Month /////////////////////
// year 는 보통 포멧
// month 는 1월 == 0, 2월 == 1, ...
export var mtvSmallCalendarMonth = function(prefixId, year,month)
{
    this.prefixId = prefixId;

    this.year = year;
    this.month = month;
    this.elThis = null;

    var d = new Date();
    mtvSmallCalendar.ThisMonth = d.getMonth();
    mtvSmallCalendar.Today = d.getDate();
    
    this.init();
}

mtvSmallCalendarMonth.prototype.clearColor = function() 
{
    //  
}

mtvSmallCalendarMonth.prototype.createDay = function(month,counter,order){

    var day = document.createElement("div");
    var scColor = "";
    // var frcSpanColor = ""
    var id = "";

    // 색을 표현하는 Routine
    // if(mtvCalendar.startDate && mtvCalendar.endDate && (counter != '&nbsp;'))
    // {
    //     var today = mtvCalendar.formatDate(this.year,month+1,counter);
    //     // console.log(frc_startDate,", ",today,", ",frc_endDate);
    //     if((mtvCalendar.startDate <= today) && (mtvCalendar.endDate >= today))
    //     {
    //         scColor = mtvSmallCalendar.ColorTable[mtvSmallCalendar.ColorIndex];
    //     }
    // }

    if(month == mtvSmallCalendar.ThisMonth && counter == mtvSmallCalendar.Today){
            day.setAttribute("class","mtv-sc-to mtv-sc-day mtv-sc-OfDay " + scColor);
            scColor = "mtv-sc-ToColor";
    }else{
            day.setAttribute("class","mtv-sc-day mtv-sc-OfDay");
    }

    day.setAttribute("style","order:"+order);

    if(counter != '&nbsp;')
    {
        var span = document.createElement("span");
        id = this.prefixId + '-mtv-sc-id-' + mtvCalendar.formatDate(this.year,month+1,counter); 
        span.setAttribute("class",scColor);
        span.setAttribute('id',id);
        span.innerHTML = counter;
        day.appendChild(span);
    }
    
    this.elWrapper.appendChild(day);

}

mtvSmallCalendarMonth.prototype.setColor = function(date,color)
{
    var scColor = mtvSmallCalendar.ColorTable[color%6];
    // var startDay = mtvSmallCalendar.Year + '-01-01';
    // var endDay = mtvSmallCalendar.Year + '-12-31';
    // if((startDay <= day) && (endDay >= day))
    {
        var id = this.prefixId + '-mtv-sc-id-' + date; // mtvCalendar.formatDate(this.year,month+1,counter);
        // var node = document.querySelector(id);
        // node.setAttribute("class",frcColor);

        // 뭘하더래도 ... 
        var node = document.getElementById(id);
        if(node)
        {
            if(node.classList.contains("mtv-sc-ToColor"))
            {
                scColor = "mtv-sc-ToColor " + scColor;
            }
            
            node.setAttribute("class",scColor);
        }
    }
}

mtvSmallCalendarMonth.prototype.createBody = function() 
{

}

mtvSmallCalendarMonth.prototype.createHeader = function() 
{
    // var calendar = document.getElementById("#frcalendar");
    

    this.elWrapper = document.createElement("div");
    this.elWrapper.setAttribute("class","mtv-sc-month");
        // calendar.appendChild(monthDiv);
        
    var monthTitle = document.createElement("div");
        monthTitle.setAttribute("class","mtv-sc-month-title");
        monthTitle.innerHTML = this.year + '년 ' + mtvSmallCalendar.MonthNamesRy[this.month];
    this.elWrapper.appendChild(monthTitle);	
        
    for( var i = 0; i < 7; i++){
        //var order = (i == 0) ? order = 7 : order = i;
        var hday = document.createElement("div");
        hday.setAttribute("class","mtv-sc-day mtv-sc-OfWeek");
        hday.setAttribute("style","order:"+i);
        hday.innerHTML = mtvSmallCalendar.DaysOfTheWeekRy[i].toUpperCase();
        this.elWrapper.appendChild(hday);
    }
    // return monthDiv;
}

mtvSmallCalendarMonth.prototype.init = function() 
{
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('style','align-self:center;');

    this.createHeader();
    var firstDayOfTheMonth  = mtvCalendar.firstDayOfTheMonth(this.year, this.month);
    var daysInMonth  = mtvCalendar.daysInMonth(this.year,this.month)
    var counter = 0;
    var order = 6;

    // 
    for( var i = 0; i < firstDayOfTheMonth ; i++){
        order++;
        this.createDay(this.month, "&nbsp;",order);
    }
    
    for( var i = firstDayOfTheMonth; i < mtvCalendar.daysInMonth(this.year,this.month) + firstDayOfTheMonth; i++){
        counter ++;
        order++;
        this.createDay(this.month,counter,order);
    }

    for( var i = firstDayOfTheMonth + daysInMonth; i < 6*7; i++){
        order++;
        this.createDay(this.month, "&nbsp;",order);
    }

    this.elThis.appendChild(this.elWrapper);

}

////////////////////////// API //////////////////////////
mtvSmallCalendarMonth.prototype.setActive = function(bActive)
{
    if(bActive)
        this.elWrapper.classList.add('active');
    else
        this.elWrapper.classList.remove('active');
} 