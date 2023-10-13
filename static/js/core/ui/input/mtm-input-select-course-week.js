require("./mtm-input-select-year.css");

import { mtvComponentBuilder } from "../../utils/mtv-component-builder.js";
import { mtvElementBuilder } from "../../component/mtv-element-builder.js";
import { mtvCalendar } from "../mtv-small-calendar";

// How to fill 100% of remaining width
// https://stackoverflow.com/questions/8252518/how-to-fill-100-of-remaining-width

export var mtmInputSelectCourseWeek = function (options) {
  this.id = "id-mtm-input-select-course-week-" + mtmInputSelectCourseWeek.id++;
  this.elThis = null;
  this.elLeft = null;
  this.elWeek = null;
  this.elRight = null;

  // 1주차(5월1일~)
  // 2추차(이번주)
  this.options = options;
  if (this.options) {
    this.startDate = options.startDate; // 2022-05-01
    this.endDate = options.endDate;

    this.startYear = options.startYear;
    this.startWeek = options.startWeek;
  }
  // for elements matching
  this.elCompList = null;
  this.elsArray = ["elThis", "elLeft", "elWeek", "elRight"];
  this.elsObject = {};

  this.todate = new Date();
  this.year = this.todate.getFullYear();
  this.month = this.todate.getMonth();
  this.today = this.todate.getDate();
  this.placehoder = "이번주";

  var startDay = this.todate.getDay();
  var remainDay = 6 - startDay;

  this.fromDate = new Date();
  this.toDate = new Date();

  this.fromDate.setDate(this.fromDate.getDate() - startDay);
  this.toDate.setDate(this.toDate.getDate() + remainDay);

  this.fromWeek = mtvCalendar.formatDate(
    this.fromDate.getFullYear(),
    this.fromDate.getMonth() + 1,
    this.fromDate.getDate(),
  );
  this.toWeek = mtvCalendar.formatDate(this.toDate.getFullYear(), this.toDate.getMonth() + 1, this.toDate.getDate());

  this.currentYear = this.year;

  this._init();
};

mtmInputSelectCourseWeek.id = 0;

mtmInputSelectCourseWeek.staticBody = [
  // <div class="mtm-input-select-year">
  //     <button>&lt;</button>
  //     <button>Year</button>
  //     <button>&gt;</button>
  // </div>
  { step: 0, tag: "div", class: "mtm-input-select-year d-flex justify-content-center", attr: { style: "width:50%" } },
  {
    step: 1,
    tag: "button",
    class: "mtm-input-select-year-left btn", //'text':'&lt;'
  },
  { step: 0, tag: "button", class: "mtm-input-select-year-center", text: "Year" },
  {
    step: 0,
    tag: "button",
    class: "mtm-input-select-year-right btn", // 'text' : '&gt;'
  },
];

mtmInputSelectCourseWeek.prototype._formatWeek = function (from, to) {
  return (
    mtvCalendar.formatNaturalMonthDate(this.fromDate.getMonth() + 1, this.fromDate.getDate()) +
    " ~ " +
    mtvCalendar.formatNaturalMonthDate(this.toDate.getMonth() + 1, this.toDate.getDate())
  );
};

mtmInputSelectCourseWeek.prototype._create = function () {
  this.elCompList = mtvElementBuilder.buildComponent(mtmInputSelectCourseWeek.staticBody, true);

  // console.log('mtvInputSelectYear > this.elCompList : ', this.elCompList);

  // Component List Matching
  this.elThis = this.elCompList[0];

  if (this.options && this.options.width) this.elThis.style.width = this.options.width;
  if (this.options && this.options.classList)
    for (var i = 0; i < this.options.classList.length; i++) this.elThis.classList.add(this.options.classList[i]);
  this.elThis.setAttribute("id", this.id);
};

mtmInputSelectCourseWeek.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
  // console.log('mtvInputSelectYear > this.elsObject : ', this.elsObject);
};

mtmInputSelectCourseWeek.prototype._initEvents = function () {
  this.elsObject.elLeft.addEventListener("click", this.leftClickHandler.bind(this));
  this.elsObject.elRight.addEventListener("click", this.rightClickHandler.bind(this));
  this.elsObject.elWeek.addEventListener("click", this.centerClickHandler.bind(this));
};

mtmInputSelectCourseWeek.prototype._prepare = function () {
  mtmInputSelectCourseWeek.staticBody[2]["text"] = this.currentYear;
};

mtmInputSelectCourseWeek.prototype._init = function () {
  this._prepare();
  this._create();
  this._matchElements();
  this._initEvents();

  // this.elsObject.elLeft.disabled = true;
  // this.elsObject.elRight.disabled = true;
  this.elsObject.elWeek.innerHTML = this.placehoder;
};

/////////////////////////////////////////////////////////////////////////////////
// mtv/core/utils/mtvComponentBuilder 에 등록
mtvComponentBuilder.register("mtm-input-select-course-week", mtmInputSelectCourseWeek);

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Handler /////////////////////////////////////
mtmInputSelectCourseWeek.prototype.leftClickHandler = function () {
  // this.currentYear--;
  // this.elsObject.elWeek.innerHTML = this.currentYear ;
  this.fromDate.setDate(this.fromDate.getDate() - 7);
  this.toDate.setDate(this.toDate.getDate() - 7);

  this.elsObject.elWeek.innerHTML = this._formatWeek();
  if (this.options && this.options.eventChangeWeek) {
    var eData = {};
    eData.fromDate = this.fromDate;
    eData.toDate = this.toDate;

    this.options.eventChangeWeek(eData);
  }
};

mtmInputSelectCourseWeek.prototype.rightClickHandler = function () {
  // this.currentYear++;
  this.fromDate.setDate(this.fromDate.getDate() + 7);
  this.toDate.setDate(this.toDate.getDate() + 7);

  // this.elsObject.elWeek.innerHTML = this.currentYear ;
  this.elsObject.elWeek.innerHTML = this._formatWeek();

  if (this.options && this.options.eventChangeWeek) {
    var eData = {};
    eData.fromDate = this.fromDate;
    eData.toDate = this.toDate;

    this.options.eventChangeWeek(eData);
  }
};

mtmInputSelectCourseWeek.prototype.centerClickHandler = function () {
  // this.elsObject.elWeek.innerHTML = this.currentYear = this.year;
  // mtvEvents.emit('OnCourseChange');
  var startDay = this.todate.getDay();
  var remainDay = 6 - startDay;

  this.fromDate = new Date();
  this.toDate = new Date();

  this.fromDate.setDate(this.fromDate.getDate() - startDay);
  this.toDate.setDate(this.toDate.getDate() + remainDay);

  this.elsObject.elWeek.innerHTML = this._formatWeek();

  if (this.options && this.options.eventChangeWeek) {
    var eData = {};
    eData.fromDate = this.fromDate;
    eData.toDate = this.toDate;

    this.options.eventChangeWeek(eData);
  }
};
/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// API //////////////////////////////////////
mtmInputSelectCourseWeek.prototype.getYear = function () {
  return this.currentYear;
};
// Google Search : javascript date 주차
// 매월 월요일을 기준으로하는 주차 및 해당주차의 날짜 구하기
// https://wickedmagica.tistory.com/269
// Javascript, 입력한 날짜의 해당 달 기준의 주차 구하기
// https://falsy.me/javascript-입력한-날짜의-해당-달-기준-주차-구하기/
// javascript getWeek()로 오늘이 몇주차인지 구하기
// https://krksap.tistory.com/1596#:~:text=사용%20방법,13주차에%20들어갑니다.

mtmInputSelectCourseWeek.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof dowOffset == "number" ? dowOffset : 0; // dowOffset이 숫자면 넣고 아니면 0
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000,
    ) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      let nYear = new Date(this.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
          the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};
