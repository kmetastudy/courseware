import { groupVideoTime } from "../../core/component/group-video-time";
import { textInputOutlined } from "../../core/ui/text-input-outlined";

require("../../../css/pages/cp/mtm-solution-video-editor.css");
export const mtmSolutionVideoEditor = function (options = {}) {
  this.options = options;
  this.isDataChanged = false;

  this._init();
  const testUrl = "3rc-GxA9Ppo";
};

mtmSolutionVideoEditor.prototype._init = function () {
  this._initVariables();
  this._create();
  this._initPlyr();
};

mtmSolutionVideoEditor.prototype._initVariables = function () {
  this.data = {
    url: "",
    title: "",
    time: "",
  };

  this.setterMap = {
    url: this.setUrl.bind(this),
    title: this.setTitle.bind(this),
    time: this.setTime.bind(this),
  };

  this.dataChangeTracker = {
    title: false,
    startTime: false,
    endTime: false,
    url: false,
  };
};

mtmSolutionVideoEditor.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-video-editor-container");

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
  this.elVideoEditorArea = document.createElement("div");
  this.elVideoEditorArea.classList.add("video-area");
  this.elThis.appendChild(this.elVideoEditorArea);

  this.elPlyr = document.createElement("div");
  this.elPlyr.classList.add("video-plyr");

  this.elEditor = document.createElement("video");
  this.elEditor.setAttribute("id", "solution-video-player");
  this.elVideoEditorArea.appendChild(this.elEditor);

  this.elSource = document.createElement("source");
  this.elEditor.appendChild(this.elSource);
};

mtmSolutionVideoEditor.prototype._initPlyr = function () {
  this.player = new Plyr(this.elEditor, {
    youtube: {
      noCookie: true,
      rel: 0,
      showinfo: 0,
    },
    timeShift: {
      enable: true,
      foward: true,
      fowardTime: 0,
    },
    debug: false,
    autoplay: false,
  });

  // this.player.on("ready", () => {
  //   this.duration = this.player.duration;
  // });
  this.player.on("ready", this.handlePlyrReady.bind(this));

  this.player.on("statechange", (event) => {
    console.log(event.detail.code);
  });
};
// ===============================================================
// =========================== Handler ===========================
// ===============================================================
mtmSolutionVideoEditor.prototype.handlePlyrReady = function () {
  let startTime, endTime;
  if (this.data.time === "") {
    [startTime, endTime] = [0, this.player.duration];
  } else {
    [startTime, endTime] = this.composeStartEnd(this.data.time);
  }
  console.log(startTime, endTime, this.data);
  this.setTimeShift(startTime, endTime);
};
mtmSolutionVideoEditor.prototype.handleUrlBlur = function (url) {
  if (this.data.url === url) {
    return;
  }

  // 이걸 적용시켜줘야되나..?
  if (this.data.url && url === "") {
    this.resetPlyr();
    return;
  }
  this.setPlyr(url);
};

mtmSolutionVideoEditor.prototype.handleUrlInput = function (url) {
  const isDataChanged = url != this.data.url ? true : false;
  this.handleDataChange("url", isDataChanged);
};

mtmSolutionVideoEditor.prototype.handleTitleInput = function (title) {
  const isDataChanged = title != this.data.title ? true : false;
  this.handleDataChange("title", isDataChanged);
};

/**
 *
 * @param {Number} startTime seconds
 * @returns
 */
mtmSolutionVideoEditor.prototype.handleStartTimeBlur = function (startTime) {
  const isDataChanged = startTime != this.startTime ? true : false;
  this.handleDataChange("startTime", isDataChanged);
};

/**
 *
 * @param {Number} endTime seconds
 * @returns
 */
mtmSolutionVideoEditor.prototype.handleEndTimeBlur = function (endTime) {
  const isDataChanged = endTime != this.endTime ? true : false;
  this.handleDataChange("endTime", isDataChanged);
};

mtmSolutionVideoEditor.prototype.handleDataChange = function (name, isDataChanged) {
  this.dataChangeTracker[name] = isDataChanged;
  // let isTotalDataChanged = false;
  // for (const key in this.dataChangeTracker) {
  //   if (this.dataChangeTracker[key] === true) {
  //     isTotalDataChanged = true;
  //   }
  // }
  for (const key in this.dataChangeTracker) {
    if (this.dataChangeTracker[key] === true) {
      this.isDataChanged = true;
      break;
    }
  }

  if (this.options.onDataChange) {
    this.options.onDataChange(this.isDataChanged);
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================
/**
 *
 * @param {Object} data {url, title, time}
 * @returns
 */
mtmSolutionVideoEditor.prototype.setData = async function (data) {
  if (!data) {
    this.reset();
    return;
  }
  this.reset();
  this.saveData(data);
  this.setValues(data);

  const url = data.url;
  this.setPlyr(url);
};

mtmSolutionVideoEditor.prototype.saveData = function (data) {
  for (let key in data) {
    if (this.data.hasOwnProperty(key)) {
      this.data[key] = data[key];
    }
  }
  this.resetDataChange();
};

mtmSolutionVideoEditor.prototype.setValues = function (data) {
  for (var key in data) {
    if (this.setterMap.hasOwnProperty(key)) {
      this.setterMap[key](data[key]);
    }
  }
};

mtmSolutionVideoEditor.prototype.setPlyr = function (url) {
  this.player.source = {
    type: "video",
    sources: [
      {
        src: url,
        provider: "youtube",
      },
    ],
  };
};

mtmSolutionVideoEditor.prototype.getData = function () {
  const dataToSave = {
    url: this.clUrl.getValue(),
    title: this.clTitle.getValue(),
    time: this.clStartTime.getValue() + "-" + this.clEndTime.getValue(),
  };
  this.saveData(dataToSave);
  return this.data;
};

mtmSolutionVideoEditor.prototype.reset = function () {
  this.resetData();
  this.resetVariables();
  this.resetDataChange();
  this.resetPlyr(); // TODO
};

mtmSolutionVideoEditor.prototype.resetData = function () {
  for (const key in this.data) {
    this.data[key] = "";
  }
};

mtmSolutionVideoEditor.prototype.resetVariables = function () {
  this.clStartTime.resetValue();
  this.clEndTime.resetValue();
  this.clTitle.resetValue();
  this.clUrl.resetValue();
  this.startTime = 0;
  this.endTime = 0;
};

mtmSolutionVideoEditor.prototype.resetDataChange = function () {
  for (let key in this.dataChangeTracker) {
    this.dataChangeTracker[key] = false;
  }

  this.isDataChanged = false;
  if (this.options.onDataChange) {
    this.options.onDataChange(this.isDataChanged);
  }
};

mtmSolutionVideoEditor.prototype.resetPlyr = function () {
  // TODO
  // Reset Plyr
  this.player.enabled = false;
  //this.player.timeShift?
};

mtmSolutionVideoEditor.prototype.setUrl = function (url) {
  this.clUrl.setValue(url);
};

mtmSolutionVideoEditor.prototype.setTitle = function (title) {
  this.clTitle.setValue(title);
};

mtmSolutionVideoEditor.prototype.setTime = function (time) {
  if (typeof time !== "string" || time === "") {
    return;
  }

  const [strStartTime, strEndTime] = time.split("-");
  this.clStartTime.setTime(strStartTime);
  this.clEndTime.setTime(strEndTime);
};

mtmSolutionVideoEditor.prototype.setTimeShift = function (startTime, endTime) {
  const timeShift = {
    startTime: startTime,
    endTime: endTime,
    forward: true,
    forwardTime: 0,
  };
  this.player.timeShift = timeShift;
};

mtmSolutionVideoEditor.prototype.getRootElement = function () {
  return this.elThis;
};
// ===============================================================
// ============================= Tool =============================
// ===============================================================
/**
 * translate string time into int seconds
 * @param {string} time
 */
mtmSolutionVideoEditor.prototype.HMStoSeconds = function (time) {
  const [hours, minute, seconds] = time.split(":");
  const translatedTime = parseInt(hours) * 3600 + parseInt(minute) * 60 + parseInt(seconds);
  return translatedTime;
};

mtmSolutionVideoEditor.prototype.secondsToHMS = function (seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

mtmSolutionVideoEditor.prototype.composeStartEnd = function (time) {
  const [strStartTime, strEndTime] = time.split("-");
  return [this.HMStoSeconds(strStartTime), this.HMStoSeconds(strEndTime)];
};

mtmSolutionVideoEditor.prototype.resetChildNodes = function (parentNode) {
  while (parentNode.lastElementChild) {
    parentNode.removeChild(parentNode.lastElementChild);
  }
};
