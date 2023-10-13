import { mtoElementBuilder } from "../../utils/mto-element-builder.js";
import { mtoVideoTime } from "../../utils/mto-video-time.js";

require("../../../../css/core/ui/output/mtm-elapse-timer.css");

// What Happens to setTimeout() / setInterval() Timers Running on Inactive Browser Tabs ?
// https://usefulangle.com/post/280/settimeout-setinterval-on-inactive-tab

// How can I make setInterval also work when a tab is inactive in Chrome?
// https://stackoverflow.com/questions/5927284/how-can-i-make-setinterval-also-work-when-a-tab-is-inactive-in-chrome

// options 에
// 1) reverse 기능 추가
// 2) callback function 기능 추가
export var mtmElapseTimer = function (options) {
  this.id = "id-mtm-elapse-timer-" + mtmElapseTimer.id++;
  this.options = options;
  if (!this.options) this.options = {};

  this.elThis = null;
  this.timeElapse = 0;
  this._init();
};

mtmElapseTimer.id = 0;
mtmElapseTimer.staticBody = [
  { level: 0, tag: "button", class: "ml-0 px-3 py-1 mtm-elapse-timer", attr: { type: "button" } },
  { level: 1, tag: "i", class: "fa fa-magic" },
  { level: 1, text: " 새로 만들기" },
];

// mtmElapseTimer.formatTime = function(sec) {
//     mtoVideoTime.formatTimeFromMinute(sec);
//     return
// }

mtmElapseTimer.prototype._prepare = function () {
  if (!this.options) return;
  var text = "저장하기";
  var iClass = "fa fa-check";
  var id = this.id;

  if (this.options.text) text = this.options.text;

  if (this.options.iClass) iClass = this.options.iClass;
  this.options.icon = '<i class="' + iClass + '"></i>';

  mtmElapseTimer.staticBody[0]["id"] = id;
  mtmElapseTimer.staticBody[1]["class"] = iClass;
  mtmElapseTimer.staticBody[2]["text"] = text;
};

/* <button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button> */

mtmElapseTimer.prototype.FillPrimary = function (className) {
  $(this.elThis).removeClass("btn-outline-primary");
  $(this.elThis).addClass("btn-primary");
};

mtmElapseTimer.prototype.OutlinePrimary = function (className) {
  $(this.elThis).removeClass("btn-primary");
  $(this.elThis).addClass("btn-outline-primary");
};

mtmElapseTimer.prototype._init = function () {
  this._prepare();

  // if(!this.options)
  //     this.options = mtvInputButton.staticBody;

  this.elThis = mtoElementBuilder.createComponent(mtmElapseTimer.staticBody);

  if (this.options && this.options.eventClickHandler) {
    this.elThis.addEventListener("click", this.options.eventClickHandler);
  }

  if (this.options && this.options.position) this.setPosition(this.options.position);

  if (this.options && this.options.type == 1) {
    this.countDownTime = this.options.time;
  }
};

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Handler ////////////////////////////////////
mtmElapseTimer.prototype.onIntervalHandler = function () {
  if (this.options && this.options.type == 1) {
    // count down
    // console.log('mtmElapseTimer > onIntervalHandler');
    const now = new Date();
    const nowTime = parseInt(now.getTime() / 1000);

    this.remainTime = this.countDownTime - nowTime;
    if (this.remainTime <= 0) this.remainTime = 0;

    this.elThis.innerHTML = this.options.icon + " " + mtoVideoTime.formatTime(this.remainTime);

    // Action Fire....
    if (this.remainTime == 0) {
      // if(this.timerInterval)
      // {
      //     clearInterval(this.timerInterval);
      //     this.timerInterval = null;
      // }
      this.options.type = 0;
      this.stop();

      if (this.options && this.options.eventTimeOutHandler) {
        console.log("mtmElapseTimer > onIntervalHandler : eventTimeOutHandler");
        this.options.eventTimeOutHandler();
      }
    }

    return;
  }

  this.timeElapse += 1;
  // this.elThis.innerHTML = this.options.icon + ' ' + mtoVideoTime.formatTimeFromMinute(this.timeElapse);
  this.elThis.innerHTML = this.options.icon + " " + mtoVideoTime.formatTime(this.timeElapse);
};
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// API //////////////////////////////////////
mtmElapseTimer.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmElapseTimer.prototype.start = function () {
  this.stop();
  this.timerInterval = setInterval(this.onIntervalHandler.bind(this), 1000);
};

mtmElapseTimer.prototype.stop = function () {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
};

mtmElapseTimer.prototype.reset = function () {
  this.timeElapse = 0;
  this.elThis.innerHTML = this.options.icon + " " + mtoVideoTime.formatTime(this.timeElapse);
};

mtmElapseTimer.prototype.enable = function (bEnable) {
  if (bEnable) this.elThis.disabled = false;
  else this.elThis.setAttribute("disabled", true);
};

mtmElapseTimer.prototype.removeClass = function (className) {
  $(this.elThis).removeClass(className);
};

mtmElapseTimer.prototype.addClass = function (className) {
  $(this.elThis).addClass(className);
};

mtmElapseTimer.prototype.setEnable = function (bEnable) {
  if (bEnable) {
    this.enable(true);
    // this.addClass('btn-outline-primary');
    // this.removeClass('btn-primary');
  } else {
    this.enable(false);
    // this.removeClass('btn-primary');
    // this.addClass('btn-outline-primary');
  }
};

mtmElapseTimer.prototype.setPosition = function (options) {
  if (options) {
    if (options.position) this.elThis.style.position = options.position;
    if (options.top) this.elThis.style.top = options.top;
    if (options.left) this.elThis.style.left = options.left;
    if (options.transform) this.elThis.style.transform = options.transform;
    if (options.zIndex) this.elThis.style.zIndex = options.zIndex;
  }
};

mtmElapseTimer.prototype.setTitle = function (options) {
  var icon = '<i class="' + options.iClass + '"></i>';
  this.elThis.innerHTML = icon + " " + options.text;
};

mtmElapseTimer.prototype.setOptions = function (options) {
  // console.log('mtmElapseTimer > setOptions :', options);
  if (options && options.type == 1) {
    this.options.type = 1;
    this.countDownTime = options.time;
    const now = new Date();
    const nowTime = parseInt(now.getTime() / 1000);

    this.remainTime = this.countDownTime - nowTime;
    if (this.remainTime <= 0) this.remainTime = 0;

    this.elThis.innerHTML = this.options.icon + " " + mtoVideoTime.formatTime(this.remainTime);
  } else {
    this.options.type = 0;
  }
};

// mtv/core/utils/mtvComponentBuilder 에 등록
// mtvComponentBuilder.register('mtv-elapse-timer',mtmElapseTimer);
