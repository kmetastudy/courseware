// 순수 CSS만으로 아코디언 탭 메뉴 구현하기
// https://allthatcode.com/entry/순수-CSS만으로-아코디언-탭-메뉴-구현하기

// CSS3 Accordion (No Javascript) - Vertical - Multiple Visible
// http://jsfiddle.net/m_raffaele/E4acF/

// Responsive Accordion Menu using only HTML & CSS
// https://www.codingnepalweb.com/responsive-accordion-menu-html-css/
// max-height: 0px;
// max-height: 100vh;

// CodePen Home / AccordionMenu
// https://codepen.io/narae/pen/QWEJQWo

// [HTML&CSS&JS] 자연스럽게 슬라이딩되는 아코디언 메뉴
// https://pro-pennek.tistory.com/entry/HtmlCSSJS-자연스럽게-슬라이딩되는-아코디언-메뉴

// [HTML/CSS] 아코디언 만들기
// https://stickode.tistory.com/504
import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

import { mtvStudySolutionVideoList } from "./mtv-study-solution-video-list.js";
import { mtvStudySolutionTextList } from "./mtv-study-solution-text-list.js";

require("../../../../css/mtv/st/study/mtv-study-solution-list.css");

export var mtvStudySolutionList = function (options) {
  this.id = "mtv-study-solution-list-" + mtvStudySolutionList.id++;
  this.options = options;
  this.elThis = null;

  this.clSolutionVideoList = [];
  this.clSolutionTextList = [];

  // this.checkInput = 0;
  // this.elCheckInput = [];
  this._init();
};

mtvStudySolutionList.id = 0;

// 헤더 영역
// {'level':0,'comp':'number-area',},
//     {'level':1, 'comp':'number-itself',},
// {'level':0,'tag':'hr','class':'mt-1'},
mtvStudySolutionList.areaTextHeader = [
  { step: 0, tag: "div", class: "px-0 py-0 my-0", attr: { style: "overflow-y:hidden; overflow-x:hidden;" } },
  {
    step: 1,
    tag: "button",
    class: "btn btn-outline-primary py-0",
    attr: { type: "button", style: "background-color:transparent;border:2px solid dodgerblue;" },
    prop: { disabled: "true" },
  },
  { step: 1, tag: "span", class: "font-weight-bold", text: "해설" },
  { step: -2, tag: "hr", class: "mb-1" },
];

// 문제 영역
// {'level':0,'comp':'content-area',},
//      {'level':1,'comp':'content-itself',},
// {'level':0,'tag':'hr','class':'mb-1'},

mtvStudySolutionList.video = [
  {
    indicator: 100,
    // Build Layouts with CSS Grid #5 - Masonry Style Layout (part 2)
    url: "xPuYbmmPdEM",
    time: "00:00:00-00:28:13",
  },
  {
    indicator: 100,
    // Make a Wordle Clone with React #16 - Making a Modal
    url: "jkUn_FsyNqc",
    time: "00:00:00-00:10:31",
  },
  {
    indicator: 100,
    // Complete MongoDB Tutorial #25 - MongoDB Atlas
    url: "084rmLU1UgA",
    time: "00:00:00-00:07:23",
  },
  {
    indicator: 100,
    // Build a Static Site with Figma & Astro #9 - Finishing up & Deployment
    url: "0PoKUrILs4U",
    time: "00:00:00-00:23:59",
  },
];

mtvStudySolutionList.datum = {
  // content : "<p><span class=\"math-tex\">\\(\\displaystyle \\lim_{x \\to \\infin}{6x^2+2x+1 \\over 3x^2+4 }\\)</span>의 값은 ?</p><p>①&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 3}\\)</span>&nbsp; &nbsp; &nbsp;②&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 2}\\)</span>&nbsp; &nbsp; &nbsp;③&nbsp;<span class=\"math-tex\">\\(1\\)</span>&nbsp; &nbsp; &nbsp;④&nbsp;<span class=\"math-tex\">\\(2\\)</span>&nbsp; &nbsp; &nbsp;⑤&nbsp;<span class=\"math-tex\">\\(3\\)</span>&nbsp; &nbsp; &nbsp;</p>"
  //             + "<p><span class=\"math-tex\">\\(\\displaystyle \\lim_{x \\to \\infin}{6x^2+2x+1 \\over 3x^2+4 }\\)</span>의 값은 ?</p><p>①&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 3}\\)</span>&nbsp; &nbsp; &nbsp;②&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 2}\\)</span>&nbsp; &nbsp; &nbsp;③&nbsp;<span class=\"math-tex\">\\(1\\)</span>&nbsp; &nbsp; &nbsp;④&nbsp;<span class=\"math-tex\">\\(2\\)</span>&nbsp; &nbsp; &nbsp;⑤&nbsp;<span class=\"math-tex\">\\(3\\)</span>&nbsp; &nbsp; &nbsp;</p>"
  //             + "<p><span class=\"math-tex\">\\(\\displaystyle \\lim_{x \\to \\infin}{6x^2+2x+1 \\over 3x^2+4 }\\)</span>의 값은 ?</p><p>①&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 3}\\)</span>&nbsp; &nbsp; &nbsp;②&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 2}\\)</span>&nbsp; &nbsp; &nbsp;③&nbsp;<span class=\"math-tex\">\\(1\\)</span>&nbsp; &nbsp; &nbsp;④&nbsp;<span class=\"math-tex\">\\(2\\)</span>&nbsp; &nbsp; &nbsp;⑤&nbsp;<span class=\"math-tex\">\\(3\\)</span>&nbsp; &nbsp; &nbsp;</p>",
  // style : "2",
  // answer : "1",
  solution_text: [
    {
      indicator: 100,
      content:
        '<p><span class="math-tex">\\(\\displaystyle \\lim_{x \\to \\infin}{6x^2+2x+1 \\over 3x^2+4 }\\)</span>의 값은 ?</p><p>①&nbsp;<span class="math-tex">\\(\\displaystyle {1 \\over 3}\\)</span>&nbsp; &nbsp; &nbsp;②&nbsp;<span class="math-tex">\\(\\displaystyle {1 \\over 2}\\)</span>&nbsp; &nbsp; &nbsp;③&nbsp;<span class="math-tex">\\(1\\)</span>&nbsp; &nbsp; &nbsp;④&nbsp;<span class="math-tex">\\(2\\)</span>&nbsp; &nbsp; &nbsp;⑤&nbsp;<span class="math-tex">\\(3\\)</span>&nbsp; &nbsp; &nbsp;</p>',
      // + "<p><span class=\"math-tex\">\\(\\displaystyle \\lim_{x \\to \\infin}{6x^2+2x+1 \\over 3x^2+4 }\\)</span>의 값은 ?</p><p>①&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 3}\\)</span>&nbsp; &nbsp; &nbsp;②&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 2}\\)</span>&nbsp; &nbsp; &nbsp;③&nbsp;<span class=\"math-tex\">\\(1\\)</span>&nbsp; &nbsp; &nbsp;④&nbsp;<span class=\"math-tex\">\\(2\\)</span>&nbsp; &nbsp; &nbsp;⑤&nbsp;<span class=\"math-tex\">\\(3\\)</span>&nbsp; &nbsp; &nbsp;</p>"
      // + "<p><span class=\"math-tex\">\\(\\displaystyle \\lim_{x \\to \\infin}{6x^2+2x+1 \\over 3x^2+4 }\\)</span>의 값은 ?</p><p>①&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 3}\\)</span>&nbsp; &nbsp; &nbsp;②&nbsp;<span class=\"math-tex\">\\(\\displaystyle {1 \\over 2}\\)</span>&nbsp; &nbsp; &nbsp;③&nbsp;<span class=\"math-tex\">\\(1\\)</span>&nbsp; &nbsp; &nbsp;④&nbsp;<span class=\"math-tex\">\\(2\\)</span>&nbsp; &nbsp; &nbsp;⑤&nbsp;<span class=\"math-tex\">\\(3\\)</span>&nbsp; &nbsp; &nbsp;</p>",
    },
    {
      indicator: 10,
      content:
        '<p>함수&nbsp;<span class="math-tex">\\(f(x)\\)</span>가 모든 실수&nbsp;<span class="math-tex">\\(x\\)</span>에 대하여&nbsp;<span class="math-tex">\\(4x-4\\le f(x) \\le x^2\\)</span>&nbsp;을 만족시킬 때,&nbsp;<span class="math-tex">\\(\\displaystyle \\lim_{x\\to 2} f(x)\\)</span>의 값을 구하시오.</p>',
      // + "<p>함수&nbsp;<span class=\"math-tex\">\\(f(x)\\)</span>가 모든 실수&nbsp;<span class=\"math-tex\">\\(x\\)</span>에 대하여&nbsp;<span class=\"math-tex\">\\(4x-4\\le f(x) \\le x^2\\)</span>&nbsp;을 만족시킬 때,&nbsp;<span class=\"math-tex\">\\(\\displaystyle \\lim_{x\\to 2} f(x)\\)</span>의 값을 구하시오.</p>",
    },
  ],
  solution_video: [
    {
      indicator: 100,
      title: "Build Layouts with CSS Grid #1 - CSS Grid Basics - 좀 더 길게 해볼까?",
      author: "",
      url: "xPuYbmmPdEM",
      time: "00:00:00-00:00:10",
    },
    {
      indicator: 100,
      title: "Make a Wordle Clone with React #16 - Making a Modal : Make Some longer",
      author: "",
      url: "jkUn_FsyNqc",
      time: "00:00:00-00:00:10",
    },
  ],
};

mtvStudySolutionList.areaTextBody = [
  { step: 0, tag: "div", class: "px-0 py-0 my-0", attr: { style: "overflow-y:hidden; overflow-x:hidden;" } },
  { step: 1, tag: "div", class: "px-0 py-0 my-0", attr: { style: "width:100%;" } },
  { step: -1, tag: "hr", class: "mb-1" },
];

mtvStudySolutionList.staticHeader = [
  {
    step: 0,
    tag: "div",
    class: "px-1 py-1 my-0 cl-solution-list-header",
    attr: { style: "overflow-y:hidden; overflow-x:hidden;" },
  },
  {
    step: 1,
    tag: "div",
    class: "btn cl-solution-list-btn py-0 px-2",
    // 'attr' : {
    //         'style':'cursor:pointer;background-color:transparent;border:2px solid dodgerblue;color:dodgerblue;',
    //     },
  },
  { step: 1, tag: "span", class: "font-weight-bold", text: "해설" },
];
////////////////////////// Handler //////////////////////////
mtvStudySolutionList.prototype._onVideoClickHandler = function (eData) {
  console.log("mtvStudySolutionList > _onVideoClickHandler : ", eData, this.options);
  // var eData = {};
  // eData.id = videoId;
  // eData.type = this.options.type;
  // mtvEvents.emit('OnPlayerVideo',eData);
  if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
};

mtvStudySolutionList.prototype._onTextClickHandler = function (textId) {
  console.log("mtvStudySolutionList > _onTextClickHandler : ", textId);
};

mtvStudySolutionList.prototype._onSolutionClickHandler = function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("mtvStudySolutionList > _onSolutionClickHandler :", this.elSolutionGroup.style.display);
  if (this.elSolutionGroup.style.display == "none") this.elSolutionGroup.style.display = "";
  else this.elSolutionGroup.style.display = "none";

  return false;
};

mtvStudySolutionList.prototype._onSolutionButtonClickHandler = function (e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("mtvStudySolutionList > _onSolutionButtonClickHandler :", this.elSolutionGroup.style.display);
  if (this.elSolutionGroup.style.display == "none") this.elSolutionGroup.style.display = "";
  else this.elSolutionGroup.style.display = "none";

  return false;
};

mtvStudySolutionList.prototype._testPreCreate = function () {
  //
  this.options.solution_video = mtvStudySolutionList.datum.solution_video;
  this.options.solution_text = mtvStudySolutionList.datum.solution_text;
};

mtvStudySolutionList.prototype._create = function () {
  if (!this.options.solution_video) this.options.solution_video = [];

  if (!this.options.solution_text) this.options.solution_text = [];

  // 무조건 만든다.
  // if( this.options.solution_video.length + this.options.solution_text.length > 0)
  {
    var elDivider = document.createElement("div");
    elDivider.setAttribute("class", "cl-yt-solution-video-header-divider");
    if (this.options.bMarginTop) elDivider.style.marginTop = "10px";

    this.elThis.appendChild(elDivider);

    this.elCompList = mtvElementBuilder.buildComponent(mtvStudySolutionList.staticHeader, true);
    // Component List Matching
    // this.elThis = this.elCompList[0];
    this.elsArray = ["elHeader", "elButton", "elTitle"];
    this.elsObject = {};
    for (var i = 0; i < this.elsArray.length; i++) {
      if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    this.elsObject.elTitle.innerHTML = "해설 없음";
    this.elsObject.elHeader.addEventListener("click", this._onSolutionClickHandler.bind(this));
    this.elsObject.elButton.addEventListener("click", this._onSolutionButtonClickHandler.bind(this));
    // this.elsObject.elTitle.addEventListener('click',this._onSolutionClickHandler.bind(this));

    this.elThis.appendChild(this.elsObject.elHeader);
  }

  this.elSolutionGroup = document.createElement("div");
  this.elThis.appendChild(this.elSolutionGroup);

  for (var i = 0; i < this.options.solution_video.length; i++) {
    var options = this.options.solution_video[i];
    options.eventClickHandler = this._onVideoClickHandler.bind(this);
    var clSoutionVideo = new mtvStudySolutionVideoList(options);
    this.clSolutionVideoList.push(clSoutionVideo);

    this.elSolutionGroup.appendChild(clSoutionVideo.elThis);

    this.elsObject.elTitle.innerHTML = "해설 보기";
  }

  // Text Solution
  if (this.options.solution_text.length > 0) {
    var elDivider = document.createElement("div");
    elDivider.setAttribute("class", "cl-solution-text-header-divider");
    this.elSolutionGroup.appendChild(elDivider);
  }

  var text_no = 0;
  if (this.options.solution_text.length > 1) text_no = 1;

  for (var i = 0; i < this.options.solution_text.length; i++) {
    var options = this.options.solution_text[i];
    options.no = text_no++;
    options.eventClickHandler = this._onTextClickHandler.bind(this);
    var clSoutionText = new mtvStudySolutionTextList(options);
    this.clSolutionTextList.push(clSoutionText);

    this.elSolutionGroup.appendChild(clSoutionText.elThis);

    this.elsObject.elTitle.innerHTML = "해설 보기";
  }

  // if(this.elSolutionGroup)
  this.elSolutionGroup.style.display = "none";
};

mtvStudySolutionList.prototype._init = function () {
  this.elThis = document.createElement("div");
  // Fixed. Jstar : 이것 때문에 처음에 이상한 jpg 가 딸려 왔구만.
  // this._testPreCreate();
  this._create();
};

mtvStudySolutionList.prototype._setSolution = function (items) {};

////////////////////////////////// API ///////////////////////////////
mtvStudySolutionList.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtvStudySolutionList.prototype.setSolution = function (items) {
  // if(items && items.bShow)

  this.elsObject.elTitle.innerHTML = "해설 없음";

  if (items) {
    // console.log('mtvStudySolutionList > setSolution :', items.solution_video,items.solution_text);
    this.options.solution_video = items.solution_video;
    this.options.solution_text = items.solution_text;

    if (!this.options.solution_video) this.options.solution_video = [];

    if (!this.options.solution_text) this.options.solution_text = [];

    this.clSolutionVideoList = [];
    while (this.elSolutionGroup.firstChild) this.elSolutionGroup.removeChild(this.elSolutionGroup.firstChild);

    for (var i = 0; i < this.options.solution_video.length; i++) {
      var options = this.options.solution_video[i];
      options.eventClickHandler = this._onVideoClickHandler.bind(this);
      var clSoutionVideo = new mtvStudySolutionVideoList(options);
      this.clSolutionVideoList.push(clSoutionVideo);
      this.elSolutionGroup.appendChild(clSoutionVideo.elThis);

      this.elsObject.elTitle.innerHTML = "해설 보기";
    }

    // Text Solution
    if (this.options.solution_text.length > 0) {
      var elDivider = document.createElement("div");
      elDivider.setAttribute("class", "cl-solution-text-header-divider");
      this.elSolutionGroup.appendChild(elDivider);

      this.elsObject.elTitle.innerHTML = "해설 보기";
    }

    var text_no = 0;
    if (this.options.solution_text.length > 1) text_no = 1;

    for (var i = 0; i < this.options.solution_text.length; i++) {
      var options = this.options.solution_text[i];
      options.no = text_no++;
      options.eventClickHandler = this._onTextClickHandler.bind(this);
      var clSoutionText = new mtvStudySolutionTextList(options);
      this.clSolutionTextList.push(clSoutionText);

      this.elSolutionGroup.appendChild(clSoutionText.elThis);
    }
  }
  // default hide
  this.elSolutionGroup.style.display = "none";
};
