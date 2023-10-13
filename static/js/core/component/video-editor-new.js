import { mtmPlyr } from "./mtm-plyr-mine";
import { groupVideoTime } from "./group-video-time";
import { textInputOutlined } from "../ui/text-input-outlined";
import { mtmButton } from "../ui/mtm-button";

require("../../../css/core/component/mtm-video-editor.css");
export const videoEditor = function (options = {}) {
  this.options = options;
  this.setterMap = {
    url: this.setUrl.bind(this),
    title: this.setTitle.bind(this),
    time: this.setTime.bind(this),
    tag: this.setTag.bind(this),
  };
  this._init();
  const testUrl = "3rc-GxA9Ppo";
};

videoEditor.prototype._init = function () {
  this._initVariable();
  this._create();
};

videoEditor.prototype._initVariable = function () {
  this.isActivated = false;
  this.data = {
    url: "",
    title: "",
    time: "",
    tag: "",
  };
  this.startTime = 0; //seconds
  this.endTime = 0; // seconds

  this.dataChangeTracker = {
    title: false,
    startTime: false,
    endTime: false,
    url: false,
    tag: false,
  };
};

videoEditor.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-video-editor-container");

  // =================== buttons ================
  this.elButtonArea = document.createElement("div");
  this.elButtonArea.classList.add("video-button-area");
  this.elThis.appendChild(this.elButtonArea);

  const saveOption = {
    name: "저장하기",
    events: [{ eventType: "click", event: this.handleSaveBtnClick.bind(this) }],
  };
  this.clSaveBtn = new mtmButton(saveOption);
  this.elSaveBtn = this.clSaveBtn.elThis;

  this.clSaveBtn.disable(true);
  this.elButtonArea.appendChild(this.elSaveBtn);

  // =================== title ================
  this.titleArea = document.createElement("div");
  this.titleArea.classList.add("video-title-area");
  this.elThis.appendChild(this.titleArea);

  const titleOptions = {
    label: "Title",
    eventInput: this.handleTitleInput.bind(this),
  };
  this.clTitle = new textInputOutlined(titleOptions);
  this.elVideoTitle = this.clTitle.getRootElement();
  this.titleArea.appendChild(this.elVideoTitle);

  // =================== url ==================å
  this.urlArea = document.createElement("div");
  this.urlArea.classList.add("video-url-area");
  this.elThis.appendChild(this.urlArea);

  const videoUrlOptions = {
    label: "Url",
    eventBlur: this.handleUrlBlur.bind(this),
    eventInput: this.handleUrlInput.bind(this),
  };
  this.clUrl = new textInputOutlined(videoUrlOptions);
  this.elUrl = this.clUrl.getRootElement();
  this.urlArea.appendChild(this.elUrl);

  // =================== time ==================
  this.elTimeArea = document.createElement("div");
  this.elTimeArea.classList.add("video-time-area");
  this.elThis.appendChild(this.elTimeArea);

  const startOptions = {
    buttonOptions: {
      name: "시작",
    },
    eventBlur: this.handleStartTimeBlur.bind(this),
  };
  this.clStartTime = new groupVideoTime(startOptions);
  this.elTimeArea.appendChild(this.clStartTime.elThis);

  const endOptions = {
    buttonOptions: {
      name: "끝",
    },
    eventBlur: this.handleEndTimeBlur.bind(this),
  };
  this.clEndTime = new groupVideoTime(endOptions);
  this.elTimeArea.appendChild(this.clEndTime.elThis);

  // =================== videoEditor ==================
  this.elVideoArea = document.createElement("div");
  this.elVideoArea.classList.add("video-area");
  this.elThis.appendChild(this.elVideoArea);

  this.clMtmPlyr = new mtmPlyr();
  this.elPlyr = this.clMtmPlyr.getRootElement();
  this.elVideoArea.appendChild(this.elPlyr);
};

// ===============================================================
// =========================== Handler ===========================
// ===============================================================
videoEditor.prototype.handleSaveBtnClick = function () {
  this.saveData();
  this.disableSaveButton(true);
  if (this.options.onSaveBtnClick) {
    this.options.onSaveBtnClick(this.data);
  }
};

videoEditor.prototype.handleUrlBlur = function (url) {
  if (this.data.url === url) {
    return;
  }
  if (!this.data.url && url === "") {
    return;
  }

  if (this.data.url && url === "") {
    return;
  }
  this.setUrl(url);
};

videoEditor.prototype.handleUrlInput = function (url) {
  const isDataChanged = url != this.data.url ? true : false;
  this.handleDataChange("url", isDataChanged);
};

videoEditor.prototype.handleTitleInput = function (title) {
  const isDataChanged = title != this.data.title ? true : false;
  this.handleDataChange("title", isDataChanged);
};

/**
 *
 * @param {Number} startTime seconds
 * @returns
 */
videoEditor.prototype.handleStartTimeBlur = function (startTime) {
  const isDataChanged = startTime != this.startTime ? true : false;
  this.handleDataChange("startTime", isDataChanged);
};

/**
 *
 * @param {Number} endTime seconds
 * @returns
 */
videoEditor.prototype.handleEndTimeBlur = function (endTime) {
  const isDataChanged = endTime != this.endTime ? true : false;
  this.handleDataChange("endTime", isDataChanged);
};

videoEditor.prototype.handleDataChange = function (name, isDataChanged) {
  this.dataChangeTracker[name] = isDataChanged;

  for (const key in this.dataChangeTracker) {
    if (this.dataChangeTracker[key] === true) {
      this.disableSaveButton(false);
      return;
    }
  }

  this.disableSaveButton(true);
};
// ===============================================================
// ============================= API =============================
// ===============================================================
videoEditor.prototype.getData = function () {
  this.saveData();
  return this.data;
};

videoEditor.prototype.setData = function (data) {
  this.resetData();
  if (!data) {
    return;
  }

  for (var key in data) {
    if (key in this.setterMap) {
      this.setterMap[key](data[key]);
    }
    if (key in this.data) {
      this.data[key] = data[key];
    }
  }
};

videoEditor.prototype.saveData = function () {
  const dataToSave = {
    url: this.clUrl.getValue(),
    title: this.clTitle.getValue(),
    time: this.clStartTime.getValue() + "-" + this.clEndTime.getValue(),
  };

  for (let key in dataToSave) {
    if (this.data[key] !== dataToSave[key]) {
    }
    this.data[key] = dataToSave[key];
  }
};

videoEditor.prototype.resetData = function () {
  this.clStartTime.resetValue();
  this.clEndTime.resetValue();
  this.clTitle.resetValue();
  this.clUrl.resetValue();
  this.startTime = 0;
  this.endTime = 0;
  this.clMtmPlyr.deactivate();

  for (const key in this.data) {
    this.data[key] = "";
  }

  for (const key in this.dataChangeTracker) {
    this.dataChangeTracker[key] = false;
  }
};

videoEditor.prototype.activate = function () {
  this.isActivated = true;
};

videoEditor.prototype.deactivate = function () {
  this.isActivated = false;
  // this.
};

videoEditor.prototype.disableSaveButton = function (shouldDisable) {
  // if (this.isActivated === false) {
  //   return;
  // }
  this.clSaveBtn.disable(shouldDisable);
};

videoEditor.prototype.setTime = function (time) {
  if (!time || time === "") {
    return;
  }
  const [strStartTime, strEndTime] = time.split("-");

  this.clStartTime.setTime(strStartTime);
  this.clEndTime.setTime(strEndTime);

  const startTime = this.composeHMSToSeconds(strStartTime);
  const endTime = this.composeHMSToSeconds(strEndTime);

  this.setTimeShift(startTime, endTime);
};

videoEditor.prototype.setUrl = function (url) {
  this.clUrl.setValue(url);
  this.clMtmPlyr.activate(url);
};

videoEditor.prototype.setTitle = function (title) {
  this.clTitle.setValue(title);
};

videoEditor.prototype.setTag = function (tag) {
  // this.elTag.value = tag;
};
videoEditor.prototype.setTimeShift = function (startTime, endTime) {
  this.clMtmPlyr.setTimeShift(startTime, endTime);
};

videoEditor.prototype.getRootElement = function () {
  return this.elThis;
};
// ===============================================================
// ============================= Tool =============================
// ===============================================================
/**
 * translate "hh:mm:ss" to "int seconds"
 * @param {string} time
 * @returns
 */
videoEditor.prototype.composeHMSToSeconds = function (time) {
  const [hours, minute, seconds] = time.split(":");
  const translatedTime = parseInt(hours) * 3600 + parseInt(minute) * 60 + parseInt(seconds);
  return translatedTime;
};

videoEditor.prototype.composeSecondsToHMS = function (seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

videoEditor.prototype.resetChildNodes = function (parentNode) {
  while (parentNode.lastElementChild) {
    parentNode.removeChild(parentNode.lastElementChild);
  }
};
