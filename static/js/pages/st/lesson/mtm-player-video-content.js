import { mtoVideoTime } from "../../../core/utils/mto-video-time.js";
import { mtmPlyr } from "../../../core/component/mtm-plyr.js";

require("../../../../css/pages/st/lesson/mtm-player-video-content.css");
export var mtmPlayerVideoContent = function (options) {
  this.id = "id-mtm-player-video-content-" + mtmPlayerVideoContent.id++;

  this.elThis = null;
  this.options = options;
  if (!this.options) this.options = {};

  this.slides = [];
  this.activeIndex = -1;
  this._init();
};

mtmPlayerVideoContent.id = 0;

mtmPlayerVideoContent.staticSlide = [{ level: 0, tag: "div", class: "swiper-slide" }];

mtmPlayerVideoContent.staticItem = [
  {
    level: 0,
    tag: "div",
    class: "testum-question-card",
    text: "",
    attr: { "data-id": "", "data-index": "" },
    // 'attr':{'style' : 'width:30px;height:30px;color:#fff;background:#01353c;border-radius:100%',
    //         'data-id':'','data-index':'' },
  },
];

mtmPlayerVideoContent.staticBody = [
  // col-12 d-flex justify-content-center
  { step: 0, tag: "div", class: "col-12 d-flex justify-content-center" },
  { step: 1, tag: "div", class: "col-12 col-md-9" },
];

mtmPlayerVideoContent.staticPlayArea = [];

mtmPlayerVideoContent.prototype.resizeWindowHandler = function (e) {};

mtmPlayerVideoContent.prototype.onVideoCompleted = function () {
  // console.log('mtmPlayerVideoContent > onVideoCompleted');
  //
  if (this.options && this.options.eventVideoHandler) setTimeout(this.options.eventVideoHandler, 0);
};

mtmPlayerVideoContent.prototype._init = function () {
  console.log("mtmPlayerVideoContent > _init ");

  this.elThis = document.createElement("div");

  this.elFlex = document.createElement("div");
  this.elFlex.setAttribute("class", "mtm-player-video-content-flexbox");

  this.elWrapper = document.createElement("div");
  this.elWrapper.setAttribute("class", "mtm-player-video-content-wrapper");

  this.elFlex.appendChild(this.elWrapper);
  this.elThis.appendChild(this.elFlex);

  this.elVideoWrapper = document.createElement("div");
  this.elVideoWrapper.classList.add("mtm-player-video-wrapper");

  this.elWrapper.appendChild(this.elVideoWrapper);

  var options = {
    videoId: this.options.videoId,
    controls: 0,
    eventVideoHandler: this.onVideoCompleted.bind(this),
    bAutoPlay: true,
  };
  // var options = {videoId:null,controls:1,};
  // this.clPlayerVideo = new mtvYoutubePlayer(options);
  this.clPlayerVideo = new mtmPlyr(options);

  this.clPlayerVideo.show(true);

  this.elVideoWrapper.appendChild(this.clPlayerVideo.elThis);
  // 816 504
  // console.log(this.elThis.getBoundingClientRect());
  setTimeout(() => {
    // console.log(this.elThis.getBoundingClientRect());
    // const offsetTop = this.elThis.getBoundingClientRect()?.top;
    // const windowHeight = window.innerHeight;
    // this.elThis.setAttribute("style", `height:${windowHeight - offsetTop}px`);
  });
};

////////////////////// API //////////////////////////////
mtmPlayerVideoContent.prototype.show = function (bShow) {
  // Todo. Jstar 나중에 VideoComplete 이중 발생
  this.bShow = bShow;
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmPlayerVideoContent.prototype.play = function (videoId, time) {
  // this.clPlayerVideo.playVideo();
  var times = time.split("-");
  var startTime = mtoVideoTime.getTime(times[0]);
  var endTime = mtoVideoTime.getTime(times[1]);
  this.clPlayerVideo.setVideoId(videoId);
  this.clPlayerVideo.setVideoTime(startTime, endTime);
  this.clPlayerVideo.playVideo();
};

mtmPlayerVideoContent.prototype.stop = function () {
  this.clPlayerVideo.stopVideo();
};

//
mtmPlayerVideoContent.prototype.start = function () {};
