// Reference
// https://mui.com/x/react-date-pickers/time-field/
// 기능만 참고했다.
require("../../../css/pages/cp/mtm-time.css");
export const mtmTime = function (options) {
  this.options = options || {};
  if (!this.options.timeFormat) {
    this.options.timeFormat = "HH:mm:ss";
  }

  this.timeData = {
    hour: null,
    minute: null,
    second: null,
  };

  this.selectionRange = {
    hour: [0, 2],
    minute: [3, 5],
    second: [6, 8],
  };

  this.defaultInputValue = "00:00:00";
  // 바꾸고 싶은 자리수
  // 1 -> 2
  // 값이 56분인 경우 digit1 = 5, digit2 = 6
  this.digitToChange = 1;

  this._init();
};

mtmTime.prototype._init = function () {
  this._create();
  this._initEvents();
};

mtmTime.prototype._create = function () {
  this.elThis = document.createElement("input");
  this.elThis.classList.add("mtm-time");
  this.elThis.setAttribute("aria-invalid", "false");
  this.elThis.setAttribute("autocomplete", "off");
  this.elThis.setAttribute("placeholder", "hh:mm:ss");
  this.elThis.setAttribute("type", "text");
  this.elThis.setAttribute("inputmode", "text");
  this.elThis.setAttribute("value", this.defaultInputValue);

  this.timeData.hour = this.elThis.value.substring(0, 2);
  this.timeData.minute = this.elThis.value.substring(3, 5);
  this.timeData.second = this.elThis.value.substring(6, 8);
};

mtmTime.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this.onClickHandler.bind(this));
  this.elThis.addEventListener("input", this.onInputHandler.bind(this));
  this.elThis.addEventListener("keydown", this.onKeydownHandler.bind(this));
  this.elThis.addEventListener("blur", this.onBlurHandler.bind(this));
};
// ===================================================================
// ============================= Handler =============================
// ===================================================================
// 선택된 영역을 한번 더 누르면 선택이 풀리고, 경우에따라는 잘못된 cursorPosition이 나온다.
mtmTime.prototype.onClickHandler = function (event) {
  const cursorPosition = this.elThis.selectionStart;
  if (cursorPosition >= 0 && cursorPosition < 3) {
    this.activate("hour");
  } else if (cursorPosition >= 3 && cursorPosition < 6) {
    this.activate("minute");
  } else if (cursorPosition >= 6 && cursorPosition < 9) {
    this.activate("second");
  }
};

mtmTime.prototype.onKeydownHandler = function (event) {
  const keyValue = event.key;

  if (!/^[0-9]$/.test(keyValue)) {
    event.preventDefault();
    return;
  }
  this.keyValue = keyValue;
};

mtmTime.prototype.onInputHandler = function (event) {
  const isValid = this.isTimeValid(this.timeUnit, this.digitToChange, this.keyValue);

  // change timeData
  if (this.digitToChange === 1 || !isValid) {
    this.timeData[this.timeUnit] = "0" + this.keyValue;
  } else if (this.digitToChange === 2 && isValid) {
    this.timeData[this.timeUnit] = this.timeData[this.timeUnit][1] + this.keyValue;
  }

  const changedValue = `${this.timeData.hour}:${this.timeData.minute}:${this.timeData.second}`;
  this.updateInputValue(changedValue);

  // activate?
  const nextTimeUnit = {
    hour: "minute",
    minute: "second",
    second: null,
  };

  if (this.digitToChange === 1 && isValid) {
    this.digitToChange = 2;
    this.elThis.setSelectionRange(...this.selectionRange[this.timeUnit]);
  } else {
    const nextTarget = nextTimeUnit[this.timeUnit];
    this.activate(nextTarget);
  }
  // console.log(this.digitToChange, isValid);
};

mtmTime.prototype.onBlurHandler = function () {
  if (this.options && this.options.eventBlur) {
    this.options.eventBlur(this.getValue("seconds"));
  }
};
// ===================================================================
// =============================== API ===============================
// ===================================================================
mtmTime.prototype.activate = function (timeUnit) {
  if (timeUnit === null) {
    this.deActivate();
  }

  if (timeUnit in this.selectionRange) {
    this.elThis.setSelectionRange(...this.selectionRange[timeUnit]);
    this.digitToChange = 1;
    this.timeUnit = timeUnit;
  }
};

/**
 *
 * @param {string} timeUnit 'hour' || 'minute' || 'second'
 * @param {number} digitToChange 1 or 2
 * @param {string} value value to check
 * @returns {Boolean}
 */
mtmTime.prototype.isTimeValid = function (timeUnit, digitToChange, keyValue) {
  // 0~9가 아닌 다른 값을 비교하고 싶으면 int로 바꿔줘야된다.
  const value = parseInt(keyValue);
  if (timeUnit === "hour") {
    if (digitToChange === 1) {
      return value >= 0 && value <= 2;
    } else if (digitToChange === 2) {
      const hourFirstDigit = parseInt(this.timeData.hour[1]);
      if (hourFirstDigit === 0 || hourFirstDigit === 1) {
        return value >= 0 && value <= 9;
      } else if (hourFirstDigit === 2) {
        return value >= 0 && value <= 3;
      }
    }
  } else if (timeUnit === "minute" || timeUnit === "second") {
    if (digitToChange === 1) {
      return value >= 0 && value <= 5;
    } else if (digitToChange === 2) {
      return value >= 0 && value <= 9;
    }
  }
  console.log("isTimeValid Error");
  return false;
};
// 00~60

mtmTime.prototype.deActivate = function () {
  this.digitToChange = 1;
  this.elThis.blur();
};

/**
 * get value of time
 * @param {string} format
 * @returns
 */
mtmTime.prototype.getValue = function (format) {
  const [hour, minute, second] = [this.timeData.hour, this.timeData.minute, this.timeData.second];
  if (!format) {
    return `${hour}:${minute}:${second}`;
  }

  if (format === "seconds") {
    return parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
  }
};

mtmTime.prototype.updateInputValue = function (value) {
  this.elThis.value = value;
};

mtmTime.prototype.resetValue = function () {
  this.deActivate();
  this.updateInputValue(this.defaultInputValue);
  this.timeData.hour = this.elThis.value.substring(0, 2);
  this.timeData.minute = this.elThis.value.substring(3, 5);
  this.timeData.second = this.elThis.value.substring(6, 8);
};

mtmTime.prototype.setTime = function (strTime) {
  this.resetValue();
  this.updateInputValue(strTime);
  this.timeData.hour = this.elThis.value.substring(0, 2);
  this.timeData.minute = this.elThis.value.substring(3, 5);
  this.timeData.second = this.elThis.value.substring(6, 8);
};
