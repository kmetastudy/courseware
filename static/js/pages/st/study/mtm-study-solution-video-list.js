// HTML and CSS Project – How to Build A YouTube Clone Step by Step
// https://www.freecodecamp.org/news/how-to-build-a-website-with-html-and-css-step-by-step/

// How To Design A YouTube Clone With HTML/CSS
// https://www.youtube.com/watch?v=rhPSo4_Tgi0

// How to Build Responsive YouTube Clone using HTML & CSS - Beginners Tutorial | Part 1
// https://www.youtube.com/watch?v=pOAwQ0FkVz8

// How to create youtube clone. Youtube clone with HTML, CSS, JS.
// https://dev.to/kunaal438/create-working-youtube-clone-with-search-box-youtube-api-2a6e

// How to Create a YouTube Clone — YouTube API
// https://enlear.academy/how-to-create-a-youtube-clone-f6f7a5ff996e

// youtube-clone
// https://github.com/DanCarl857/youtube-clone

// Youtube
// https://github.com/durgeshsoni/Youtube

// HTML and CSS Clone - Youtube Video Player (2 컬럼 리스트)
// https://github.com/timkellytk/project-youtube-clone

// Flexbox and Truncated Text
// https://css-tricks.com/flexbox-truncated-text/
import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";

require("./mtm-study-solution-video-list.css");

export var mtmStudySolutionVideoList = function (options) {
  this.id = "mtm-study-solution-video-list-" + mtmStudySolutionVideoList.id++;
  this.options = options;
  if (!options) this.options = {};
  this.elThis = null;

  this.elCompList = null;
  this.elsArray = [
    "elThis",
    "elThumbnail",
    "elImgWrapper",
    "elImage",
    null,
    "elTitle",
    "elAuthor",
    "elInfo",
    "elDuration",
    "elViews",
    "elDate",
  ];
  this.elsObject = {};

  this.data = {};

  this._init();
};

mtmStudySolutionVideoList.id = 0;

mtmStudySolutionVideoList.staticPreUrl = ["https://i.ytimg.com/vi/", "https://"];

mtmStudySolutionVideoList.staticPostUrl = ["/hqdefault.jpg"];

// 헤더 영역
// {'level':0,'comp':'number-area',},
//     {'level':1, 'comp':'number-itself',},
// {'level':0,'tag':'hr','class':'mt-1'},
mtmStudySolutionVideoList.areaHeader = [
  { step: 0, tag: "div", class: "px-0 py-0 my-0", attr: { style: "overflow-y:hidden; overflow-x:hidden;" } },
  {
    step: 1,
    tag: "button",
    class: "btn btn-outline-primary py-0",
    attr: { type: "button", style: "background-color:transparent;border:2px solid dodgerblue;" },
    prop: { disabled: "true" },
  },
  { step: 1, tag: "span", class: "font-weight-bold", text: "영상" },
  { step: -2, tag: "hr", class: "mb-1" },
];

// 해설 영역
// {'level':0,'comp':'content-area',},
//      {'level':1,'comp':'content-itself',},
// {'level':0,'tag':'hr','class':'mb-1'},

mtmStudySolutionVideoList.areaBody = [
  { step: 0, tag: "div", class: "px-0 py-0 my-0", attr: { style: "overflow-y:hidden; overflow-x:hidden;" } },
  { step: 1, tag: "div", class: "px-0 py-0 my-0", attr: { style: "width:100%;" } },
  { step: -1, tag: "hr", class: "mb-1" },
];

// .cl-yt-item-wrapper
// {
//     display: flex;
//     flex-direction: row;
// }

mtmStudySolutionVideoList.staticBody = [
  { step: 0, tag: "div", class: "cl-yt-solution-video-item-wrapper" },
  // {'step':0,'tag':'div','class':'cl-solution-video-item-wrapper',},
  { step: 1, tag: "div", class: "thumb-nail" },
  // {'step':1,'tag':'div','class':'img-div','attr':{'style':"width:100%;"}},
  {
    step: 1,
    tag: "div",
    class: "img-wrapper",
    attr: { style: "overflow:hidden;position:relative;padding-top:56.25%;" },
  },
  { step: 1, tag: "img" },
  { step: -2, tag: "div", class: "details" },
  { step: 1, tag: "div", class: "title" },
  { step: 0, tag: "div", class: "author" },
  { step: 0, tag: "div", class: "info" },
  { step: 1, tag: "span" }, // duration
  { step: 0, tag: "span" }, // views
  { step: 0, tag: "span" }, // date
];

mtmStudySolutionVideoList.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmStudySolutionVideoList.staticBody, true);
  // Component List Matching
  this.elThis = this.elCompList[0];

  // {
  //     indicator : 100,
  //     url : 'xPuYbmmPdEM',
  //     time : '00:00:00-00:00:10',
  // }
};

mtmStudySolutionVideoList.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtmStudySolutionVideoList.prototype._prepareOptions = function () {
  var src = mtmStudySolutionVideoList.staticPreUrl[0] + this.options.url + mtmStudySolutionVideoList.staticPostUrl[0];

  this.options.videoId = this.options.url;

  this.elsObject.elImage.setAttribute("src", src);
  if (!this.options.title) this.options.title = "제목 없음";
  this.elsObject.elTitle.innerHTML = this.options.title;

  if (!this.options.author) this.options.author = "메가 테스트";
  this.elsObject.elAuthor.innerHTML = this.options.author;
};

mtmStudySolutionVideoList.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this._onClickHandler.bind(this));
  // this.elThis.style.cursor = "pointer";
};

mtmStudySolutionVideoList.prototype._init = function () {
  this._create();
  this._matchElements();
  this._prepareOptions();
  this._initEvents();
};

/////////////////////////////////// Event Handler //////////////////////////////////
mtmStudySolutionVideoList.prototype._onClickHandler = function (e) {
  var eData = {};
  eData.videoId = this.options.videoId;
  eData.time = this.options.time;
  if (this.options && this.options.eventClickHandler) this.options.eventClickHandler(eData);
};

/////////////////////////////////////// API ////////////////////////////////////
mtmStudySolutionVideoList.prototype.setVideoData = function (data) {
  // id,title,author,duration,views,date
  this.options.videoId = data.id;
  this.options.videoTitle = data.title;
  this.options.videoAuthor = data.author;
  this.options.videoDuration = data.duration;
  this.options.views = data.views;
  this.options.date = data.date;
};

mtmStudySolutionVideoList.prototype.setVideoId = function (videoId) {
  this.options.videoId = videoId;
};
