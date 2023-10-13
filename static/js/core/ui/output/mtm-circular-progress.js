// require('../../../../css/mtv/core/output/mtm-circular-progress.css');
require("../../../../css/core/ui/output/mtm-circular-progress-v2.css");

// How to make Circular Progress Bar in HTML CSS & JavaScript | Skills Bar
// https://www.youtube.com/watch?v=SKU2gExpkPI

export var mtmCircularProgress = function (options) {
  this.id = "id-mtm-circular-progress-" + mtmCircularProgress.id++;
  this.options = options;
  this.elThis = null;
  this._init();
};

mtmCircularProgress.id = 0;

mtmCircularProgress.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-circular-progress");

  this.elProgressBar = document.createElement("div");
  this.elProgressBar.classList.add("progress-bar");
  this.elThis.appendChild(this.elProgressBar);

  this.elProgressValue = document.createElement("span");
  this.elProgressValue.classList.add("progress-value");
  // this.elProgressValue.innerHTML = '0%';
  this.elProgressBar.appendChild(this.elProgressValue);
};

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API ////////////////////////////////////////////
mtmCircularProgress.prototype.setProgress = function (value, unit, bAni) {
  this.elProgressBar.style.background =
    "conic-gradient(var(--theme-color-v2-c3-rgb) " + value * 3.6 + "deg, rgba(0,0,0,0) 0deg)";

  this.elProgressValue.innerHTML = value + unit;
};
