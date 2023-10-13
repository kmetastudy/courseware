import { mtoElementBuilder } from "../../utils/mto-element-builder";

require("../../../../css/core/ui/clock/mtm-analog-clock.css");

// CodePen Home - Analog Clock
// https://codepen.io/ds92ko/pen/KKeVxbz
export var mtmAnalogClock = function (options) {
  this.id = "id-mtm-analog-clock-" + mtmAnalogClock.id++;
  this.options = options;
  if (!this.options) this.options = {};

  this.elThis = null;
  this.timeElapse = 0;

  // for element matching
  this.elCompList = null;
  this.elsArray = [
    "elThis",
    null,
    "elLineCircle",
    "elBoardCircle",
    "elNumberCircle",
    "elClockName",
    "elHour",
    "elMinute",
    "elSecond",
  ];
  this.elsObject = {};

  this._init();
};

mtmAnalogClock.id = 0;
{
  /* <div class="clock">
  <div class="clock-face">
    <div class="line-circle"></div>
    <div class="board-circle"></div>
    <div class="number-circle"></div>
  </div>
  <div class="time hour-hand"></div>
  <div class="time minute-hand"></div>
  <div class="time second-hand"></div>
</div> */
}
mtmAnalogClock.staticBody = [
  { step: 0, tag: "div", class: "mtm-analog-clock" },
  { step: 1, tag: "div", class: "mtm-analog-clock-face" },
  { step: 1, tag: "div", class: "mtm-analog-clock-line-circle" },
  { step: 0, tag: "div", class: "mtm-analog-clock-board-circle" },
  { step: 0, tag: "div", class: "mtm-analog-clock-number-circle" },
  { step: 0, tag: "div", class: "mtm-analog-clock-name" },

  { step: -1, tag: "div", class: "mtm-analog-clock-time mtm-analog-clock-hour-hand" },
  { step: 0, tag: "div", class: "mtm-analog-clock-time mtm-analog-clock-minute-hand" },
  { step: 0, tag: "div", class: "mtm-analog-clock-time mtm-analog-clock-second-hand" },
];

mtmAnalogClock.prototype._initEvents = function () {};

mtmAnalogClock.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtmAnalogClock.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmAnalogClock.staticBody, true);
  // Component List Matching
  this.elThis = this.elCompList[0];

  // 옵션 스타일 적용
  // options for style
  if (this.options.width) this.elThis.style.width = this.options.width;
};

mtmAnalogClock.prototype._init = function () {
  this._create();
  this._initEvents();
  this._matchElements();

  this._setClockName();
  this._drawLines();
  this._drawNumbers();
};

mtmAnalogClock.prototype._drawLines = function () {
  for (var i = 0; i < 30; i++) {
    var line = document.createElement("div");
    var lineType = i % 5 ? "thin" : "thick";

    line.classList.add("mtm-analog-clock-line", lineType);
    line.style.transform = "rotate(" + 6 * i + "deg)";

    this.elsObject.elLineCircle.appendChild(line);
  }
};

mtmAnalogClock.prototype._drawNumbers = function () {
  var right = 3;
  var left = 9;

  for (var i = 0; i < 6; i++) {
    var numbers = document.createElement("div");
    var leftNumber = document.createElement("div");
    var rightNumber = document.createElement("div");

    leftNumber.setAttribute("class", "mtm-analog-clock-number");
    rightNumber.setAttribute("class", "mtm-analog-clock-number");
    leftNumber.style.transform = "rotate(" + -(30 * i) + "deg)";
    leftNumber.innerHTML = left > 12 ? left - 12 : left;
    rightNumber.style.transform = "rotate(" + -(30 * i) + "deg)";
    rightNumber.innerHTML = right;

    numbers.classList.add("mtm-analog-clock-numbers");
    numbers.style.transform = "rotate(" + 30 * i + "deg)";
    // numbers.innerHTML = leftNumber + rightNumber;
    numbers.append(leftNumber);
    numbers.append(rightNumber);

    this.elsObject.elNumberCircle.appendChild(numbers);

    right++;
    left++;
  }
};

mtmAnalogClock.prototype._setClockName = function () {
  this.elsObject.elClockName.innerHTML = "MegaClass";
};

mtmAnalogClock.prototype._setHands = function () {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  this.elsObject.elHour.style.transform = "rotate(" + (h * 30 + m * 0.5) + "deg)";
  this.elsObject.elMinute.style.transform = "rotate(" + m * 6 + "deg)";
  this.elsObject.elSecond.style.transform = "rotate(" + s * 6 + "deg)";
};

///////////////////////////////////////////////////////////
/////////////////////////// URL ///////////////////////////

///////////////////////////////////////////////////////////
///////////////////////// Handler /////////////////////////

///////////////////////////////////////////////////////////
/////////////////////////// API ///////////////////////////
mtmAnalogClock.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmAnalogClock.prototype.start = function (bStart) {
  if (this.interval) clearInterval(this.interval);

  this.interval = null;

  if (bStart) this.interval = setInterval(this._setHands.bind(this), 1000);
};
