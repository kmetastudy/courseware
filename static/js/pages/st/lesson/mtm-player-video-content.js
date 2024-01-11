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
  this.elFlex.setAttribute("class", "row d-flex justify-content-center mt-2");

  // {'level':1,'tag':'div', 'class':'card-body px-0 py-0 my-0', },
  //         // <div class="col-12 mb-4" style="position:relative;padding-top:56.25%;border-radius:10px;border:3px solid rgba(0,123,255,255);" id="div_id_yt_root">
  //         {'level':2 , 'tag':'div', 'class':'col-12 px-0', 'attr' : {'style' : 'position:relative;padding-top:56.25%;border-radius:10px;border:3px solid rgba(0,123,255,255);',},},

  this.elWrapper = document.createElement("div");
  // this.elWrapper.setAttribute('class','col-12 col-md-10 col-lg-9 col-xl-8 justify-content-center');
  // 나중에 매우 작은 width 에서는 px-0 을 추가 하자.
  this.elWrapper.setAttribute("class", "col-12 px-4 py-2 justify-content-center");

  this.elFlex.appendChild(this.elWrapper);
  this.elThis.appendChild(this.elFlex);

  this.elVideoWrapper = document.createElement("div");
  // this.elVideoWrapper.setAttribute('class','col-12');
  // 'position:relative;padding-top:56.25%;border-radius:10px;border:3px solid rgba(0,123,255,255);'

  // this.elVideoWrapper.setAttribute('style','position:relative;padding-top:56.25%;border-radius:10px;border:0px solid rgba(0,123,255,255);');
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

  // this.elVideoWrapper.appendChild(this.clPlayerVideo.elThis);
  this.elThis.appendChild(this.clPlayerVideo.elThis);
  // 816 504
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
