import { mtoVideoTime } from "../../../core/utils/mto-video-time.js";
import { mtmPlyr } from "../../../core/component/mtm-plyr.js";

require("../../../../css/pages/st/lesson/mtm-player-video-content.css");
export class mtmPlayerVideoContent {
  static id = 0;
  constructor(options = {}) {
    this.id = "id-mtm-player-video-content-" + mtmPlayerVideoContent.id++;

    this.elThis = null;
    this.options = options;

    this.slides = [];
    this.activeIndex = -1;

    this._init();
  }

  _init() {
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

    const options = {
      videoId: this.options.videoId,
      controls: 0,
      eventVideoHandler: this.onVideoCompleted.bind(this),
      bAutoPlay: true,
    };

    this.clPlayerVideo = new mtmPlyr(options);

    this.clPlayerVideo.show(true);
    this.elVideoWrapper.appendChild(this.clPlayerVideo.elThis);
    // 816 504
    // console.log(this.elThis.getBoundingClientRect());
    // inital

    // this.setHeight();
    // this.set
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    setTimeout(() => {
      let offsetTop = this.elThis.getBoundingClientRect().top;
      document.documentElement.style.setProperty("--video-offset-top", `${offsetTop}px`);
    });

    window.addEventListener("resize", () => {
      console.log("resize event occur");
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      let offsetTop = this.elThis.getBoundingClientRect().top;
      document.documentElement.style.setProperty("--video-offset-top", `${offsetTop}px`);
    });
  }
  // ============ Handler ============
  onVideoCompleted() {
    if (this.options?.eventVideoHandler) {
      setTimeout(this.options.eventVideoHandler, 0);
    }
  }

  ////////////////////// API //////////////////////////////
  show(bShow) {
    // Todo. Jstar 나중에 VideoComplete 이중 발생
    this.bShow = bShow;
    if (bShow) this.elThis.style.display = "block";
    else this.elThis.style.display = "none";
  }
  play(videoId, time) {
    // this.clPlayerVideo.playVideo();
    var times = time.split("-");
    var startTime = mtoVideoTime.getTime(times[0]);
    var endTime = mtoVideoTime.getTime(times[1]);
    this.clPlayerVideo.setVideoId(videoId);
    this.clPlayerVideo.setVideoTime(startTime, endTime);
    this.clPlayerVideo.playVideo();
  }
  stop() {
    this.clPlayerVideo.stopVideo();
  }
  //
  start() {}
}

mtmPlayerVideoContent.staticSlide = [{ level: 0, tag: "div", class: "swiper-slide" }];

mtmPlayerVideoContent.staticItem = [
  {
    level: 0,
    tag: "div",
    class: "testum-question-card",
    text: "",
    attr: { "data-id": "", "data-index": "" },
  },
];
