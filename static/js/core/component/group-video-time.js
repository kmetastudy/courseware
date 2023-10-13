// group
// button + mtmTime

import { mtmButton } from "../ui/mtm-button";
import { mtmTime } from "../../pages/cp/mtm-time";

require("../../../css/core/component/group-video-time.css");
export const groupVideoTime = function (options) {
  this.currentTime = null;
  this.options = options || {};
  this._init();
};

groupVideoTime.prototype._init = function () {
  this._setOptions();
  this._create();
  this._initEvents();
};

groupVideoTime.prototype._setOptions = function () {
  this.buttonOptions = this.options.buttonOptions || {};
  this.buttonOptions.name = this.buttonOptions.name || "시간";
  this.buttonOptions.style = this.buttonOptions.style || {
    borderRadius: "5px",
    backgroundColor: "#D7E0FF",
  };
};

groupVideoTime.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("group-video-time");

  this.clButton = new mtmButton(this.buttonOptions);
  this.elButton = this.clButton.elThis;
  this.elThis.appendChild(this.elButton);

  const options = {
    eventBlur: this.onBlurHandler.bind(this),
  };
  this.clTime = new mtmTime(options);
  this.elTime = this.clTime.elThis;
  this.elThis.appendChild(this.elTime);
};

groupVideoTime.prototype._initEvents = function () {
  this.elButton.addEventListener("click", this.onButtonClickHandler.bind(this));
};

// ===================================================================
// ============================= Handler =============================
// ===================================================================
groupVideoTime.prototype.onButtonClickHandler = function () {
  if (this.options.buttonClickEvent) {
    this.options.buttonClickEvent();
  }

  this.resetValue();
};

groupVideoTime.prototype.onBlurHandler = function (seconds) {
  if (this.options && this.options.eventBlur) {
    this.options.eventBlur(seconds);
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================
groupVideoTime.prototype.getValue = function (timeFormat) {
  return this.clTime.getValue(timeFormat);
};

groupVideoTime.prototype.setTime = function (strTime) {
  this.clTime.setTime(strTime);
};

groupVideoTime.prototype.resetValue = function () {
  this.clTime.resetValue();
};
