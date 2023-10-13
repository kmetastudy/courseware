let mtmPlyrId = 0;

// TODO
// 부사장님의 mtmPlyr로 교체하고, 내가 쓰던 mtmPlyr은 mtm-plyr-mine으로 변경했다.
// 내 cp에 문제가 없나 확인해보자.
require("../../../css/core/component/mtm-plyr.css");
export const mtmPlyr = function (options = {}) {
  this.options = options;
  this.id = `mtm-plyr-${mtmPlyrId++}`;
  this.isActivated = false;

  this._init();
};

mtmPlyr.prototype._init = function () {
  this._initVariable();
  this._create();
  this._initPlyrConfig();
  this._initPlyr();
  this._initEvents();
};

mtmPlyr.prototype._create = function () {
  // HTML5
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-plyr");

  this.elPlayer = document.createElement("video");
  this.elPlayer.setAttribute("id", this.id);
  console.log(this.id);
  this.elThis.appendChild(this.elPlayer);

  this.elSource = document.createElement("source");
  this.elPlayer.appendChild(this.elSource);
};

mtmPlyr.prototype._initVariable = function () {
  this.videoId = this.options.videoId || null;
  this.bAutoPlay = this.options.bAutoPlay || false;

  this.startTime = this.options.startTime || 0;
  this.endTime = this.options.endTime || 0;
  this.forward = this.options.forward || true;
  this.forwardTime = this.options.forwardTime || 0;
};

mtmPlyr.prototype._initPlyrConfig = function () {
  this.plyrConfig = {
    timeShift: {
      enable: true,
      startTime: this.startTime,
      endTime: this.endTime,
      forward: this.forward,
      forwardTime: this.forwardTime,
    },
    debug: true,
    autoplay: false,
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
    settings: ["caption", "quality", "speed"],
    quality: {
      default: 576,
      options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
    },
    // 이걸 false로 두면, timeShift를 변경하는 경우, control에 duration이 업데이트가 안됨(작동은 잘 된다.)
    // 이걸 어떻게 해주는게 좋을까..?
    invertTime: true,
    keyboard: {
      focused: false,
      global: false,
    },
  };
};

mtmPlyr.prototype._initPlyr = function () {
  this.player = new Plyr(this.elPlayer, this.plyrConfig);
};

mtmPlyr.prototype._initEvents = function () {
  this.player.on("ready", this.handleReady.bind(this));
};

// ===============================================================
// =========================== Handler ===========================
// ===============================================================
mtmPlyr.prototype.handleReady = function (e) {
  // When this events happen?
  // first initialization
  // change sources
  if (this.shouldDeactivate(this.player.source) === true) {
    this.deactivate();
    return;
  }
  if (this.endTime === 0 && this.player.duration > 0) {
    this.setTimeShift(0, this.player.duration);
  }
  //
};
// ===============================================================
// ============================= API =============================
// ===============================================================
/**
 *
 * @param {*} id
 */
mtmPlyr.prototype.activate = function (videoId) {
  const id = videoId === "" ? "invalidId" : videoId;
  //   this.setTimeShift(0, 0);
  this.startTime = 0;
  this.endTime = 0;

  this.setSource(id);
  this.show(true);
};

mtmPlyr.prototype.setSource = async function (videoId) {
  this.player.source = {
    type: "video",
    sources: [
      {
        src: videoId,
        provider: "youtube",
      },
    ],
  };
};

mtmPlyr.prototype.deactivate = function () {
  this._initVariable();
  this.show(false);
};

/**
 *
 * @param {Number} start seconds
 * @param {Number} end seconds
 */
mtmPlyr.prototype.setTimeShift = function (start, end) {
  this.startTime = start;
  this.endTime = end;

  const timeShift = {
    startTime: start,
    endTime: end,
    forward: true,
    forwardTime: 0,
  };

  this.player.timeShift = timeShift;

  if (this.options.onTimeShiftChange) {
    this.options.onTimeShiftChange(this.startTime, this.endTime);
  }
};

mtmPlyr.prototype.show = function (shouldShow) {
  const displayValue = shouldShow ? "" : "none";
  this.elThis.setAttribute("style", `display:${displayValue};`);
};

mtmPlyr.prototype.shouldDeactivate = function (source) {
  return source === "https://www.youtube.com/watch";
};

mtmPlyr.prototype.getPoster = function () {
  if (this.player.poster) {
    return this.player.poster;
  }
};

mtmPlyr.prototype.play = function () {
  this.player.play();
};

mtmPlyr.prototype.getRootElement = function () {
  return this.elThis;
};
