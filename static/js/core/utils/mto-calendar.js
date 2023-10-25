export var mtoCalendar = {
  // var objects = {
  startDate: null,
  endDate: null,
  // };

  formatDate: function (year, month, day) {
    if (month <= 9) month = "0" + month;
    if (day <= 9) day = "0" + day;

    return [year, month, day].join("-");
  },

  formatMonthDate: function (month, day) {
    if (month <= 9) month = "0" + month;
    if (day <= 9) day = "0" + day;

    return [month, day].join("-");
  },

  formatNaturalMonthDate: function (month, day) {
    // if (month <= 9)
    //     month = '0' + month;
    // if (day <= 9)
    //     day = '0' + day;

    // return [month, day].join('-');
    return month + "월" + day + "일";
  },

  formatSlashMonthDate: function (month, day) {
    // if (month <= 9)
    //     month = '0' + month;
    // if (day <= 9)
    //     day = '0' + day;

    // return [month, day].join('-');
    return month + "/" + day;
  },

  getFormatToday: function () {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();

    var todayDate = this.formatDate(year, month + 1, day);
    return todayDate;
  },

  daysInMonth: function (year, month) {
    return new Date(year, month + 1, 0).getDate(); //29/03/2016 (month + 1)
  },

  firstDayOfTheMonth: function (year, month) {
    var firstDay = new Date(year, month, 1);
    return firstDay.getDay();
  },

  getThisWeek: function () {
    var now = new Date();
    var nowDayOfWeek = now.getDay();
    var nowDay = now.getDate();
    var nowMonth = now.getMonth();
    var nowYear = now.getFullYear();
    return [
      this.formatDate(nowYear, nowMonth + 1, nowDay - nowDayOfWeek),
      this.formatDate(nowYear, nowMonth + 1, nowDay + (6 - nowDayOfWeek)),
    ];
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
