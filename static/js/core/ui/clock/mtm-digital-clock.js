import { mtoElementBuilder } from "../../utils/mto-element-builder";

require("../../../../css/core/ui/clock/mtm-digital-clock.css");

// CodePen Home - Digital Clock
// https://codepen.io/a7rarpress/pen/rNZPmwE
export var mtmDigitalClock = function (options) {
  this.id = "id-mtm-digital-clock-" + mtmDigitalClock.id++;
  this.options = options;
  if (!this.options) this.options = {};

  this.elThis = null;
  this.timeElapse = 0;

  // for element matching
  this.elCompList = null;
  this.elsArray = [
    "elThis",
    "elTitle",
    "elTime",
    null,
    "elHour",
    "elHourTitle",
    null,
    "elMinute",
    "elMinuteTitle",
    null,
    "elSecond",
    "elSecondTitle",
  ];
  this.elsObject = {};

  this._init();
};

mtmDigitalClock.id = 0;
{
  // <div id="clock">
  //     <h2>The time now</h2>
  //     <div id="time">
  //         <div>
  //             <span id="hour">00</span>
  //             <span>Hours</span>
  //         </div>
  //         <div>
  //             <span id="minutes">00</span>
  //             <span>Minutes</span>
  //         </div>
  //         <div>
  //             <span id="seconds">00</span>
  //             <span>Seconds</span>
  //         </div>
  //     </div>
  // </div>
}
mtmDigitalClock.staticBody = [
  { step: 0, tag: "div", class: "mtm-digital-clock" },
  { step: 1, tag: "h2", class: "mtm-digital-clock-title" },
  { step: 0, tag: "div", class: "time" },
  { step: 1, tag: "div" },
  { step: 1, tag: "span", class: "hour" },
  { step: 0, tag: "span" },

  { step: -1, tag: "div" },
  { step: 1, tag: "span", class: "minute" },
  { step: 0, tag: "span" },

  { step: -1, tag: "div" },
  { step: 1, tag: "span", class: "second" },
  { step: 0, tag: "span" },
];

mtmDigitalClock.prototype._initEvents = function () {};

mtmDigitalClock.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtmDigitalClock.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmDigitalClock.staticBody, true);
  // Component List Matching
  this.elThis = this.elCompList[0];

  // 옵션 스타일 적용
  // options for style
  if (this.options.width) this.elThis.style.width = this.options.width;
};

mtmDigitalClock.prototype._init = function () {
  this._create();
  this._initEvents();
  this._matchElements();

  this._setClockTitle();
  this._setTime();

  this.elsObject.elHourTitle.innerHTML = "시간";
  this.elsObject.elMinuteTitle.innerHTML = "분";
  this.elsObject.elSecondTitle.innerHTML = "초";

  // this._drawLines();
  // this._drawNumbers();
};

mtmDigitalClock.prototype._setClockTitle = function () {
  this.elsObject.elTitle.innerHTML = "MegaClass";
};

mtmDigitalClock.prototype._setTime = function () {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  this.elsObject.elHour.innerHTML = h;
  this.elsObject.elMinute.innerHTML = m;
  this.elsObject.elSecond.innerHTML = s;
};

mtmDigitalClock.prototype._setCountDownTime = function (h, m, s) {
  this.elsObject.elHour.innerHTML = h;
  this.elsObject.elMinute.innerHTML = m;
  this.elsObject.elSecond.innerHTML = s;
};
///////////////////////////////////////////////////////////
/////////////////////////// URL ///////////////////////////

///////////////////////////////////////////////////////////
///////////////////////// Handler /////////////////////////
//////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Handler ////////////////////////////////////
mtmDigitalClock.prototype.onIntervalHandler = function () {
  if (this.bCountDown) {
    // count down
    const now = new Date();
    const nowTime = parseInt(now.getTime() / 1000);

    this.remainTime = this.time + this.duration - nowTime;
    if (this.remainTime <= 0) this.remainTime = 0;

    var time = this.remainTime;

    var h = parseInt(time / 60 / 60);
    time = time - h * 60 * 60;
    var m = parseInt(time / 60);
    time = time - m * 60;
    var s = time;

    this._setCountDownTime(h, m, s);

    // Action Fire....
    if (this.remainTime == 0) {
      this.stop();

      if (this.options.eventTimeOutHandler) this.options.eventTimeOutHandler();
    }

    return;
  }

  this.timeElapse += 1;
  // this.elThis.innerHTML = this.options.icon + ' ' + mtoVideoTime.formatTimeFromMinute(this.timeElapse);
  this.elThis.innerHTML = this.options.icon + " " + mtoVideoTime.formatTime(this.timeElapse);
};
///////////////////////////////////////////////////////////
/////////////////////////// API ///////////////////////////
mtmDigitalClock.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmDigitalClock.prototype.start = function () {
  this.stop();
  this.timerInterval = setInterval(this.onIntervalHandler.bind(this), 300);
};

mtmDigitalClock.prototype.stop = function () {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
};

mtmDigitalClock.prototype.setCountDownTimer = function (time, duration) {
  this.bCountDown = true;
  this.time = time;
  this.duration = duration;

  this.onIntervalHandler();
  this.stop();
  this.start();

  this.show(true);
};

mtmDigitalClock.prototype.setTimerCountDown = function (time) {
  this.bCountDown = true;
  this.time = time;
  this.duration = 0;

  this.onIntervalHandler();
};

mtmDigitalClock.prototype.setDigitalClock = function (time) {
  var h = parseInt(time / 60 / 60);
  time = time - h * 60 * 60;
  var m = parseInt(time / 60);
  time = time - m * 60;
  var s = time;

  this._setCountDownTime(h, m, s);
};
