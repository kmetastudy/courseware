export var mtoVideoTime = {
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
