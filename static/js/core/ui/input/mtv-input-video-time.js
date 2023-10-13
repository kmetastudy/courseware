// HTML custom formatting in input type=number
// https://stackoverflow.com/questions/62899064/html-custom-formatting-in-input-type-number

// How TO - Hide Arrows From Input Number
// https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp

// var mtvInputVideoTime = (function()
// {
//     var constants = {

//     };

//     var objects = {
//         elementId : null,
//         $elementId : null,
//     };


//     // public function
//     function init(id)
//     {
//         objects.elementId = id;
//         if(!!id)
//             objects.$elementID = '#' + id;
        

//     }


//     return {
//         init : init ,

//     };

// })();

// Object Creation Patterns in JavaScript
// 1. Factory pattern
// 2. Constructor pattern
// 3. Prototype pattern
// 4. Dynamic prototype pattern
// https://medium.com/developers-arena/object-creation-patterns-in-javascript-8922d52fad2c

// JavaScript object creation patterns tutorial - factory , constructor pattern, prototype pattern
// https://www.youtube.com/watch?v=xizFJHKHdHw

// Constructors ( Object Oriented Programming in JavaScript Series - Part 1)
// https://www.youtube.com/watch?v=f5wGZiYVfjk

// HTML custom formatting in input type=number
// https://stackoverflow.com/questions/62899064/html-custom-formatting-in-input-type-number

// How TO - Hide Arrows From Input Number
// https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp

// var mtvInputVideoTime = (function()
// {
//     var constants = {

//     };

//     var objects = {
//         elementId : null,
//         $elementId : null,
//     };


//     // public function
//     function init(id)
//     {
//         objects.elementId = id;
//         if(!!id)
//             objects.$elementID = '#' + id;
        

//     }


//     return {
//         init : init ,

//     };

// })();

// Object Creation Patterns in JavaScript
// 1. Factory pattern
// 2. Constructor pattern
// 3. Prototype pattern
// 4. Dynamic prototype pattern
// https://medium.com/developers-arena/object-creation-patterns-in-javascript-8922d52fad2c

// JavaScript object creation patterns tutorial - factory , constructor pattern, prototype pattern
// https://www.youtube.com/watch?v=xizFJHKHdHw

// Constructors ( Object Oriented Programming in JavaScript Series - Part 1)
// https://www.youtube.com/watch?v=f5wGZiYVfjk

export var mtvVideoTime = {
    formatHour : function(hour)
    {
        var value = "00";
        var hours = Number.parseInt(hour);
        if(hours < 10)
            value = "0" + hours.toString();
        else
            value = hours.toString();

        return value;
    },

    formatMinute : function(minute)
    {
        var value = "00";
        var min = Number.parseInt(minute);
        if(min < 10)
            value = "0" + min.toString();
        else
            value = min.toString();
        
        return value;
    },

    formatSecond : function(second)
    {
        var value = "00";
        var sec = Number.parseInt(second);
        if(sec < 10)
            value = "0" + sec.toString();
        else
            value = sec.toString();
        
        return value;
    },


    formatTime : function(sec)
    {
        var hour = Number.parseInt(sec/60/60);
        sec -= hour*60*60;
        var minute = Number.parseInt(sec/60);
        sec -= minute*60;
        var second = sec;
        var time = this.formatHour(hour) + ':' + this.formatMinute(minute) + ':' + this.formatSecond(second);

        return time;
    },

    formatTimeFromMinute : function(sec)
    {
        var hour = Number.parseInt(sec/60/60);
        sec -= hour*60*60;
        var minute = Number.parseInt(sec/60);
        sec -= minute*60;
        var second = sec;
        var time = formatMinute(minute) + ':' + formatSecond(second);

        return time;
    },

    getTime : function(time)
    {
        var times = time.split(':');
        var sec = parseInt(times[0])*60*60 + parseInt(times[1])*60 + parseInt(times[2]);
        
        return sec;
    },

    // return {
    //     formatTime : formatTime,
    //     formatTimeFromMinute : formatTimeFromMinute,
        
    //     getTime : getTime,
    // }
};

export var mtvInputVideoTime = function(parentId,elParent,options) {
    this.parentId = parentId;
    this.elParent = elParent;
    this.hour = 0;
    this.minute = 0;
    this.seconde = 0;

    this.options = options;
    if(!this.options)
        this.options = {};
    // this.addEventListener();
    this.elThis = document.createElement("span");
    this.elThis.setAttribute("class","video-time");
    this.hourEl = document.createElement("input");
    var sepNode1 = document.createTextNode(":");
    var sepNode2 = document.createTextNode(":");
    // <input type="number" id="no1" max="9999" tabindex="1" placeholder="####" />
    this.hourEl.setAttribute("type","text");
    this.hourEl.setAttribute("class","video-time");
    // hourEl.setAttribute("max","24");
    // hourEl.setAttribute("min","00");
    this.hourEl.setAttribute("value","00");
    this.hourEl.setAttribute("size","2");
    this.hourEl.setAttribute("maxlength","2");
    
    this.minuteEl = document.createElement("input");
    this.minuteEl.setAttribute("type","text");
    this.minuteEl.setAttribute("class","video-time");
    // minuteEl.setAttribute("max","59");
    // minuteEl.setAttribute("min","00");
    this.minuteEl.setAttribute("value","00");
    this.minuteEl.setAttribute("size","2");
    this.minuteEl.setAttribute("maxlength","2");
    
    this.secondEl = document.createElement("input");
    this.secondEl.setAttribute("type","text");
    this.secondEl.setAttribute("class","video-time");
    // secondEl.setAttribute("max","59");
    // secondEl.setAttribute("min","00");
    this.secondEl.setAttribute("value","00");
    this.secondEl.setAttribute("size","2");
    this.secondEl.setAttribute("maxlength","2");
    
    this.elThis.appendChild(this.hourEl);
    this.elThis.appendChild(sepNode1);
    this.elThis.appendChild(this.minuteEl);
    this.elThis.appendChild(sepNode2);
    this.elThis.appendChild(this.secondEl);
    
    if(this.elParent)
        this.elParent.appendChild(this.elThis);
    else
    {
        var parentEl = document.getElementById(this.parentId);
        parentEl.appendChild(this.elThis);
    }

    this.formatTime = function(time)
    {
        var formatted = 0;
        if(time > 10)
        {
            parseInt(time/10); 
        }
    }

    this.handlerHourChange = function(e)
    {
        console.log('hour changed : ', e.target.value);
        this.hour = parseInt(e.target.value);
        this.hourEl.blur();

        if(this.options && this.options.eventHandler)
            this.options.eventHandler();
    }

    this.handlerMinuteChange = function(e)
    {
        console.log('minute changed : ' , e.target.value);
        this.minute = parseInt(e.target.value);
        this.minuteEl.blur();
        if(this.options && this.options.eventHandler)
            this.options.eventHandler();
    }

    this.handlerSecondChange = function(e)
    {
        console.log('second changed : ', e.target.value);
        this.second = parseInt(e.target.value);
        this.secondEl.blur();
        if(this.options && this.options.eventHandler)
            this.options.eventHandler();
    }

    this.formatHour = function(hour)
    {
        var value = "00";
        hour = Number.parseInt(hour);
        if(hour < 10)
            value = "0" + hour.toString();
        else
            value = hour.toString();

        return value;
    }

    this.formatMinute = function(min)
    {
        var value = "00";
        min = Number.parseInt(min);
        if(min < 10)
            value = "0" + min.toString();
        else
            value = min.toString();
        
        return value;
    }

    this.formatSecond = function(sec)
    {
        var value = "00";
        sec = Number.parseInt(sec);
        if(sec < 10)
            value = "0" + sec.toString();
        else
            value = sec.toString();
        
        return value;
    }

    this.setTime = function(sec)
    {
        this.hour = Number.parseInt(sec/60/60);
        sec -= this.hour*60*60;
        this.minute = Number.parseInt(sec/60);
        sec -= this.minute*60;
        this.second = sec;

        // console.log('hour :', this.hour);
        // console.log('minute :', this.minute);
        // console.log('second :', this.second);
        
        // setHour
        this.hourEl.setAttribute("value",this.formatHour(this.hour));
        this.hourEl.value = this.formatHour(this.hour);
        // setMinute
        this.minuteEl.setAttribute("value",this.formatMinute(this.minute));
        this.minuteEl.value =  this.formatMinute(this.minute);
        // setSecond
        this.secondEl.setAttribute("value",this.formatSecond(this.second));
        this.secondEl.value = this.formatSecond(this.second);
    }

    this.setTimePart = function(hour,min,sec)
    {
        console.log('start setTimePart : ', hour,min,sec);

        // if(typeof(hour) == "number" )
        this.hour = Number.parseInt(hour);
        // else
        if(this.hour == NaN)    
            this.hour = 0;
        
        // if(typeof(min) == "number" )
        this.minute = Number.parseInt(min);
        // else
        if(this.minute == NaN)    
            this.minute = 0;
        
        //if(typeof(sce) == "number" )
        this.second = Number.parseInt(sec);
        //else
        if(this.second == NaN)    
            this.second = 0;
        
        console.log('end setTimePart : ', this.hour,this.minute, this.second);

        // setHour
        this.hourEl.setAttribute("value",this.formatHour(this.hour));
        this.hourEl.value = this.formatHour(this.hour);
        // setMinute
        this.minuteEl.setAttribute("value",this.formatMinute(this.minute));
        this.minuteEl.value =  this.formatMinute(this.minute);
        // setSecond
        this.secondEl.setAttribute("value",this.formatSecond(this.second));
        this.secondEl.value = this.formatSecond(this.second);

    }

    this.hourEl.addEventListener("change",this.handlerHourChange.bind(this));
    this.minuteEl.addEventListener("change",this.handlerMinuteChange.bind(this));
    this.secondEl.addEventListener("change",this.handlerSecondChange.bind(this));
    
    this.getTime = function()
    {
        var time = this.hourEl.value + ':' + this.minuteEl.value + ':' + this.secondEl.value;
        return time;
    }
}

