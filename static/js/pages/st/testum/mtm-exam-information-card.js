import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";
import { mtmElapseTimer } from "../../../core/ui/output/mtm-elapse-timer.js";
import { mtmAnalogClock } from "../../../core/ui/clock/mtm-analog-clock.js";
import { mtmDigitalClock } from "../../../core/ui/clock/mtm-digital-clock.js";

import { mtmStudySubmitAction } from "../study/mtm-study-submit-action.js";

// require('../../../../css/mtv/st/study/mtm-study-question-card.css');
// require('../../../../css/mtv/st/study/mtm-study-question-ckeditor.css');
// require('../../../../css/mtv/core/form/mtm-form.css');

export var mtmExamInformationCard = function (options) {
  this.id = "id-mtm-exam-information-card-" + mtmExamInformationCard.id++;

  this.elThis = null;
  this.elContentArea = null;
  this.elContentItself = null;
  // this.elSolutionProperty = null;
  // this.elDeleteConform = null;
  this.options = options;
  if (!this.options) this.options = {};

  this.elChoiceNumber = [];

  // this._copyData(options);

  this.width = mtmExamInformationCard.width;
  this.height = mtmExamInformationCard.height;
  this.innerHeight = this.height;
  this.content = mtmExamInformationCard.content;
  this.widthInner = mtmExamInformationCard.width;

  // set specific value if exist
  if (this.options) {
    if (this.options.width) this.width = this.options.width;

    if (this.options.widthInner) this.widthInner = this.options.widthInner;

    if (this.options.innerHeight) this.innerHeight = this.options.innerHeight;

    if (this.options.content) this.content = this.options.content;
  }

  // mtvPlayerTestumCard 와 다른 부분
  this.bEnableAnswer = true;
  this._init();
};

mtmExamInformationCard.id = 0;
mtmExamInformationCard.width = 100;
mtmExamInformationCard.height = 100;
mtmExamInformationCard.content = "내용 없음";

mtmExamInformationCard.titles = [
  "아직 평가 시간이 아닙니다.",
  "평가 가능한 시간입니다.",
  "아직 평가일이 아닙니다.",
  "평가 시간이 지났습니다.",
];

mtmExamInformationCard.infos = ["남은 시간"];

mtmExamInformationCard.staticTitleArea = [
  {
    level: 0,
    tag: "div",
    class: "mtm-testum-card-normal-title-area px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
];

mtmExamInformationCard.staticTitleItself = [
  { level: 0, tag: "div", class: "d-flex justify-content-center" },
  {
    level: 1,
    tag: "span",
    class: "font-weight-bold",
    text: "아직 평가 시간이 아닙니다.",
    attr: { style: "font-size:20px ; font-weight:900;" },
  },
];

mtmExamInformationCard.staticInputArea = [
  {
    level: 0,
    tag: "div",
    class: "row d-flex justify-content-center px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
];

mtmExamInformationCard.staticAnswerChoice = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtmExamInformationCard.staticChoiceNumber = [
  {
    level: 0,
    tag: "div",
    class: "mtm-study-answer-choice-number text-center",
    attr: { "data-sel": "", "data-clicked": "false" },
  },
  // {'level':1,'tag':'span',},
];

mtmExamInformationCard.staticContentArea = [
  {
    level: 0,
    tag: "div",
    class: "mtm-testum-card-normal-container px-0 py-0 my-0",
    attr: { style: "overflow-y:hidden; overflow-x:hidden; min-width:300px" },
  },
];

// 문제 padding 장조
mtmExamInformationCard.staticContentItself = [
  { level: 0, tag: "div", class: "px-3 py-0 my-0 mtm-testum-card-normal-normal", attr: { style: "width:100%;" } },
];

// 설명란
mtmExamInformationCard.staticDescription = [
  { level: 0, tag: "div", class: "d-flex justify-content-center" },
  {
    level: 1,
    tag: "span",
    class: "font-weight-bold",
    text: "남은 시간",
    attr: { style: "font-size:16px ; font-weight:600;" },
  },
];

// 설명란
mtmExamInformationCard.staticAction = [
  { level: 0, tag: "div", class: "d-flex justify-content-center py-1" },
  // {'level':1,'tag':'span','class':'font-weight-bold','text':'남은 시간',
  //         'attr' : {'style':"font-size:16px ; font-weight:600;",},},
];

// mtvPlayerTestumCard 와 다른 부분
mtmExamInformationCard.staticSubmitArea = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtmExamInformationCard.staticBody = [
  {
    level: 0,
    tag: "div",
    class: "mtm-testum-card-normal mx-1 my-1",
    attr: {
      "data-index": "",
      "data-uid": "",
      // 'style':'width:270px',
    },
  },

  { level: 1, tag: "div", class: "mtm-testum-card-normal-body px-1 py-1" },
  // 번호 영역
  { level: 2, comp: "title-area" },
  { level: 3, comp: "title-itself" },
  { level: 2, tag: "hr", class: "mt-1" },

  // 문제 영역
  { level: 2, comp: "content-area" },
  { level: 3, comp: "content-analog" },
  { level: 3, comp: "content-digital" },

  { level: 2, tag: "hr", class: "mb-1" },
  // 입력란
  { level: 2, comp: "input-area" },
  // 설명
  { level: 3, comp: "description-area" },
  // 남은시간/입력
  { level: 3, comp: "action-area" },

  // 제출/행위 영역
  { level: 2, comp: "mtv-study-submit-action" },
  // // 해설/해답 영역
  // {'level':2,'comp':'mtv-study-solution-list',},
];

mtmExamInformationCard.prototype._renderQuestionKatex = function (el, content) {
  el.innerHTML = content;

  // <script src="{% static 'katex@0.12.0/dist/contrib/auto-render.min.js' %}"></script>
  // katex auto-render required !!!
  renderMathInElement(el, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    // • rendering keys, e.g.:
    throwOnError: false,
  }); // KaTex
};

mtmExamInformationCard.prototype._copyData = function (data) {
  if (!data) return;

  // mtvPlayerTestumCard 와 다른 부분
  this.options.bSubmitAction = data.bSubmitAction;
  this.options.submitList = data.submitList;

  // 이부분은 Direct 로 위로 올라 간다.
  // this.options.eventSubmitHandler = data.eventSubmitHandler;
  // this.options.eventCorrectWrongHandler = data.eventCorrectWrongHandler;
  // this.options.eventNextStepHandler = data.eventNextStepHandler;

  this.options.type = data.type;
  this.options.eventSolutionHandler = data.eventSolutionHandler;

  this.options.id = data.id;
  this.options.no = data.no;
  // this.options.parent_id = data.parent_id;

  this.options.content = data.content;
  this.options.level = data.level;
  this.options.style = data.style;
  this.options.answer = data.answer;
  // this.options.tag = data.tag;

  // 여기에 Solution List 를 보강해야 한다.
  this.options.solution_id = data.solution_id;
  this.options.solution_content = data.solution_content;

  this.options.video_id = data.video_id;
  this.options.video_content = data.video_content;
  this.options.video_title = data.video_title;
  this.options.video_time = data.video_time;

  this.options.bSolutionText = false;
  this.options.bSolutionVideo = false;

  // 솔루션 Text 와 Video 가 List 형태로 되었을 때는 어떻하나?
  if (this.options.solution_id) this.options.bSolutionText = true; // eData.solution_id;
  if (this.options.video_id) this.options.bSolutionVideo = true; // eData.video_id;

  if (data.eventEmitter) this.options.eventEmitter = data.eventEmitter;
  if (data.eventHandler) this.options.eventHandler = data.eventHandler;

  if (data.innerHeight) this.options.innerHeight = data.innerHeight;
};

mtmExamInformationCard.prototype._clearChoiceAnswer = function (answer) {
  // for(var i=0;i<this.elChoiceNumber.length;i++)
  // {
  //     this.elChoiceNumber[i].setAttribute('data-clicked',false);
  //     this.elChoiceNumber[i].classList.remove('active');
  // }
  this.clAnswerChoice.clearAnswer();
};

mtmExamInformationCard.prototype._clearShortAnswer = function (answer) {
  this.clAnswerShort.setAnswer("");
};

mtmExamInformationCard.prototype._clearLongAnswer = function (answer) {
  this.clAnswerLong.setAnswer("");
};

// mtmExamInformationCard.prototype.clickChoiceNumberHandler = function(e) {
//     if(!this.enableAnswer)
//         return;

//     var el = e.target;

//     var clicked = el.getAttribute('data-clicked');

//     if(clicked=='false')
//         clicked = true;
//     else
//         clicked = false;

//     el.setAttribute('data-clicked',clicked);
//     // console.log('mtmExamInformationCard : clickChoiceNumberHandler > ', el);
//     if(clicked)
//         el.classList.add('active');
//     else
//         el.classList.remove('active');
// }

mtmExamInformationCard.prototype.onChangeAnswerShortHandler = function (e) {};

mtmExamInformationCard.prototype.onChangeAnswerLongHandler = function (e) {};

// mtmExamInformationCard.prototype.onSubmitHandler = function(eData) {
//     // console.log('mtmExamInformationCard > onSubmitHandler : ',this.options.eventSubmitHandler);
//     if(this.options && this.options.eventSubmitHandler)
//         this.options.eventSubmitHandler();
// }

// mtmExamInformationCard.prototype.onCorrectWrongHandler = function() {
//     if(this.options && this.options.eventCorrectWrongHandler)
//         this.options.eventCorrectWrongHandler();
// }

// mtmExamInformationCard.prototype.onNextStepHandler = function() {
//     if(this.options && this.options.eventNextStepHandler)
//         this.options.eventNextStepHandler();
// }

mtmExamInformationCard.prototype.onCancelHandler = function (eData) {
  console.log("mtmExamInformationCard > onCancelHandler");
};

mtmExamInformationCard.prototype.onSettingHandler = function (eData) {
  console.log("mtmExamInformationCard > onSettingHandler");
};

mtmExamInformationCard.prototype.create = function (tagList) {
  var topElement = document.createElement("div");

  // topElement.setAttribute('class','mtv-top-element');
  // topElement.setAttribute('style',"width:400px;");

  var componentList = [];
  var level = 0;
  var element = null;

  componentList.push(topElement);

  if (tagList) {
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i]["comp"]) {
        if (tagList[i]["comp"] == "title-area") {
          element = this.elTitleArea = mtoElementBuilder.createComponent(mtmExamInformationCard.staticTitleArea);

          // this.elCorrectMark = document.createElement('img');
          // this.elWrongMark = document.createElement('img');
          // this.elCorrectMark.src = '/static/img/correct.png';
          // this.elCorrectMark.style = "position:absolute;top:-10px;left:-5px;display:none;z-index:10;opacity: 0.8;";

          // this.elWrongMark.src = '/static/img/incorrect.png';
          // this.elWrongMark.style = "position:absolute;top:-10px;left:-5px;display:none;z-index:10;opacity: 0.8;";
          // this.elTitleArea.appendChild(this.elCorrectMark);
          // this.elTitleArea.appendChild(this.elWrongMark);
        } else if (tagList[i]["comp"] == "title-itself") {
          element = this.elTitleItself = mtoElementBuilder.createComponent(mtmExamInformationCard.staticTitleItself);
          this.elTitle = this.elTitleItself.children[0];
          if (this.options && this.options.title) this.elTitle.innerHTML = this.options.title;
          // element.style.visibility = 'hidden';
        } else if (tagList[i]["comp"] == "content-area") {
          element = this.elContentArea = mtoElementBuilder.createComponent(mtmExamInformationCard.staticContentArea);
          this.elContentArea.style.width = this.width + "%";
          this.elContentArea.style.height = "260px";
          this.elContentArea.style.position = "relative";

          // this.elContentArea.style.height = this.innerHeight + 'px';
        } else if (tagList[i]["comp"] == "content-analog") {
          // element = this.elContentItself = mtoElementBuilder.createComponent(mtmExamInformationCard.staticContentItself);
          // this.elContentItself.style.width = this.widthInner + '%';
          var options = {};

          this.clAnalogClock = new mtmAnalogClock(options);
          element = this.clAnalogClock.elThis;
          this.clAnalogClock.start(true);
        } else if (tagList[i]["comp"] == "content-digital") {
          // element = this.elContentItself = mtoElementBuilder.createComponent(mtmExamInformationCard.staticContentItself);
          // this.elContentItself.style.width = this.widthInner + '%';
          var options = {};
          options.eventTimeOutHandler = this.onDigitalTimeOutHandler.bind(this);

          this.clDigitalClock = new mtmDigitalClock(options);
          element = this.clDigitalClock.elThis;
          this.clDigitalClock.show(false);
        } else if (tagList[i]["comp"] == "input-area") {
          element = this.elAnswerArea = mtoElementBuilder.createComponent(mtmExamInformationCard.staticInputArea);
        } else if (tagList[i]["comp"] == "description-area") {
          element = this.elDescriptionArea = mtoElementBuilder.createComponent(
            mtmExamInformationCard.staticDescription,
          );
          this.elDescription = this.elDescriptionArea.children[0];
        } else if (tagList[i]["comp"] == "action-area") {
          element = this.elActionArea = mtoElementBuilder.createComponent(mtmExamInformationCard.staticAction);
          var options = {};
          options.type = 1;
          //------------------------------------------
          // for smart test
          var now = new Date();
          var h = now.getHours();
          var m = now.getMinutes();
          var s = now.getSeconds();
          if (s > 55) m += 2;
          else m++;

          if (m >= 60) {
            h++;
            m = 0;
          }
          if (h >= 24) h = 0;
          now.setHours(h);
          now.setMinutes(m);
          now.setSeconds(0);

          const nowTime = parseInt(now.getTime() / 1000);
          //------------------------------------------

          options.time = nowTime;
          options.enable = true;
          options.text = " 00:00:00";
          options.iClass = "fa-regular fa-clock";
          options.eventTimeOutHandler = this.onTimeOutHandler.bind(this);
          options.eventClickHandler = this.onTimerClickHandler.bind(this);

          this.clRemainTimeClock = new mtmElapseTimer(options);

          element.append(this.clRemainTimeClock.elThis);
          this.clRemainTimeClock.start();
        } else if (tagList[i]["comp"] == "mtm-study-answer-choice") {
          // var options = {};
          // options.choice = ['1','2','3','4','5','?'];
          // this.clAnswerChoice = new mtmStudyAnswerChoice(options);
          // element = this.clAnswerChoice.elThis;
          // if(this.options.style != '1')
          //     this.clAnswerChoice.show(false);
          // else
          //     this.clAnswerChoice.show(true);
        } else if (tagList[i]["comp"] == "mtm-study-answer-short") {
          // var options = {};
          // options.eventHandler = this.onChangeAnswerShortHandler.bind(this);
          // options.showLabel = false;
          // this.clAnswerShort = new mtmStudyAnswerShort(options);
          // element = this.clAnswerShort.elThis;
          // if(this.options.style != '2')
          //     // this.clAnswerShort.elThis.style.display = 'none';
          //     this.clAnswerShort.show(false);
        } else if (tagList[i]["comp"] == "mtm-study-answer-long") {
          // var options = {};
          // options.showLabel = false;
          // options.eventHandler = this.onChangeAnswerLongHandler.bind(this);
          // this.clAnswerLong = new mtmStudyAnswerLong(options);
          // element = this.clAnswerLong.elThis;
          // if(this.options.style != '3')
          //     // this.clAnswerLong.elThis.style.display = 'none';
          //     this.clAnswerLong.show(false);
        } else if (tagList[i]["comp"] == "mtv-study-submit-action") {
          var options = {};
          // options.items = [];
          // var submitList = [
          //     {
          //         enable : true,
          //         text : ' 제출',
          //         icon : 'fa fa-check',
          //         eventHandler:this.onSubmitHandler.bind(this),
          //     },
          //     {
          //         enable : true,
          //         text : ' 오답 하기',
          //         icon : 'fa fa-check',
          //         eventHandler:this.onCorrectWrongHandler.bind(this),
          //     },
          //     {
          //         enable : true,
          //         text : ' 다음 하기',
          //         icon : 'fa fa-external-link',
          //         eventHandler:this.onNextStepHandler.bind(this),
          //     },
          // ];

          // if(this.options && this.options.submitList && this.options.bSubmitAction)
          // {
          //     for(var j=0;j<this.options.submitList.length;j++)
          //     {
          //         if(j>= 3)
          //             break;
          //         if(this.options.submitList[j])
          //             options.items.push(submitList[j]);
          //     }
          // }

          this.clSubmitAction = new mtmStudySubmitAction(options);
          element = this.clSubmitAction.elThis;
          if (this.options && this.options.bSubmitAction) this.clSubmitAction.show(true);
          else this.clSubmitAction.show(false);
        }
      } else {
        element = mtoElementBuilder.createElement(tagList[i]);
      }

      level = tagList[i]["level"];

      componentList[level].appendChild(element);
      componentList[level + 1] = element;
    }
  }

  return topElement;
};

mtmExamInformationCard.prototype._initEvents = function () {
  // this.elThis.addEventListener('click',this.onSelectHanlder.bind(this));
  // this.elThis.addEventListener('dragstart',this.onDragStartHandler.bind(this));
};

mtmExamInformationCard.prototype.prepare = function () {
  mtmExamInformationCard.staticBody[0]["data-index"] = this.options.index;
  mtmExamInformationCard.staticBody[0]["data-uid"] = this.options.id;
  mtmExamInformationCard.staticBody[2]["text"] = this.options.index + 1;
};

mtmExamInformationCard.prototype._init = function () {
  this.prepare();

  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);

  this.elFlex = document.createElement("div");
  this.elFlex.setAttribute("class", "row d-flex justify-content-center mt-2");

  this.elWrapper = document.createElement("div");
  // Todo. 문제의 크기 조정
  this.elWrapper.setAttribute("class", "col-12 col-md-10 col-lg-9 col-xl-8 d-flex justify-content-center");

  var element = this.create(mtmExamInformationCard.staticBody);
  // element.style.minWidth = '300px';

  this.elWrapper.appendChild(element);
  this.elFlex.appendChild(this.elWrapper);

  this.elThis.appendChild(this.elFlex);
};
///////////////////////// Event Handler //////////////////////////////////
mtmExamInformationCard.prototype.onDigitalTimeOutHandler = function () {
  // 평가가 완료 되었습니다.
  // 최종적으로 제출하시겠습니까?
  // ...
  console.log("mtmExamInformationCard > onDigitalTimeOutHandler");
  if (this.options && this.options.eventRemainEndHandler) this.options.eventRemainEndHandler();
};

mtmExamInformationCard.prototype.onTimeOutHandler = function () {
  this.timeOut = true;
  this.elDescription.style.visibility = "hidden";
  var options = {};
  options.text = "평가 시작하기";
  options.iClass = "fa fa-check";
  this.clRemainTimeClock.setTitle(options);
  this.setTitle("평가 가능한 시간입니다.");
};

mtmExamInformationCard.prototype.onTimerClickHandler = function () {
  if (this.timeOut || this.already) {
    console.log("mtmExamInformationCard > onTimerClickHandler : go Exam");
    this.timeOut = false;
    if (this.options.eventTimerClick) this.options.eventTimerClick();
  }
};

mtmExamInformationCard.prototype.onEventSolutionHandler = function (eData) {
  console.log("mtmExamInformationCard > onEventSolutionHandler: ", eData, this.options);
  if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
};

///////////////////////// API //////////////////////////////////
mtmExamInformationCard.prototype.setAnswerEnable = function (bEnable) {
  this.bEnableAnswer = bEnable;
  this.clAnswerChoice.setAnswerEnable(bEnable);
  // Todo. Jstar : ShortAnswer
  this.clAnswerShort.setAnswerEnable(bEnable);
};

mtmExamInformationCard.prototype.setQuestionData = function (item) {
  this._copyData(item);

  this._clearChoiceAnswer();
  this._clearShortAnswer();
  this._clearLongAnswer();

  this.elNumber.innerHTML = this.options.no + "번";

  if (this.elContentItself) this._renderQuestionKatex(this.elContentItself, this.options.content);

  this.clAnswerChoice.show(false);
  this.clAnswerShort.show(false);
  this.clAnswerLong.show(false);

  if (this.options.style == "1") this.clAnswerChoice.show(true);
  else if (this.options.style == "2") this.clAnswerShort.show(true);
  else if (this.options.style == "3") this.clAnswerLong.show(true);
};

mtmExamInformationCard.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmExamInformationCard.prototype.setCorrectMark = function () {
  this.elWrongMark.style.display = "none";
  this.elCorrectMark.style.display = "block";
};

mtmExamInformationCard.prototype.setWrongMark = function () {
  this.elWrongMark.style.display = "block";
  this.elCorrectMark.style.display = "none";
};

mtmExamInformationCard.prototype.hideAllMark = function () {
  this.elWrongMark.style.display = "none";
  this.elCorrectMark.style.display = "none";
};

mtmExamInformationCard.prototype.disableAnswer = function () {
  this.enableAnswer = false;
};

mtmExamInformationCard.prototype.enableAnswer = function () {
  this.enableAnswer = true;
};

mtmExamInformationCard.prototype.disableChoice = function () {};

mtmExamInformationCard.prototype.enableChoice = function () {};

mtmExamInformationCard.prototype.showSubmitAction = function (bShow) {
  this.clSubmitAction.show(bShow);
};

mtmExamInformationCard.prototype.setShowSubmitAction = function (index, bShow, bMargin) {
  this.clSubmitAction.setShow(index, bShow, bMargin);
};

mtmExamInformationCard.prototype.setShowSubmitList = function (bShowList) {
  this.clSubmitAction.setShowList(bShowList);
};

mtmExamInformationCard.prototype.setEnableSubmitAction = function (index, bShow) {
  this.clSubmitAction.setEnable(index, bShow);
};

mtmExamInformationCard.prototype.setSubmitItemList = function (items) {
  this.clSubmitAction.setSubmitItemList(items);
};

mtmExamInformationCard.prototype.setAnswer = function (answer) {
  if (answer) this.options.answer = answer;
  if (answer == "") this.options.answer = "";

  if (this.options.style == 1) {
    // 객관식
    console.log("mtmExamInformationCard > setAnswer :", answer);
    this.clAnswerChoice.setAnswer(answer);
  }
  // Todo. Jstar : ShortAnswer
  else if (this.options.style == 2) {
    // 단답형
    console.log("mtmExamInformationCard > Short setAnswer :", answer);
    this.clAnswerShort.setAnswer(answer);
  }
};

mtmExamInformationCard.prototype.setCorrectAnswer = function () {
  // var answer = this.getAnswer();
  this.setAnswer(this.options.answer);
};

mtmExamInformationCard.prototype.getAnswer = function () {
  var answer = "";
  if (this.options.style == 1)
    // 객관식
    answer = this.clAnswerChoice.getAnswer();
  else if (this.options.style == 2)
    // 단답형
    answer = this.clAnswerShort.getAnswer();
  else if (this.options.style == 3)
    // 객관식
    answer = this.clAnswerLong.getAnswer();
  return answer;
};

mtmExamInformationCard.prototype.showSolution = function (bShow) {
  // if(bShow)
  this.clStudySolutionList.show(bShow);
};

mtmExamInformationCard.prototype.setSolution = function (items) {
  this.clStudySolutionList.setSolution(items);
};

mtmExamInformationCard.prototype.showAnanlogClock = function (bShow) {
  this.clAnalogClock.show(bShow);
};

mtmExamInformationCard.prototype.showDigitalClock = function (bShow) {
  this.clDigitalClock.show(bShow);
};

mtmExamInformationCard.prototype.setNewInformation = function (options) {
  this.elDescription.style.visibility = "visible";
  this.elTitle.innerHTML = "아직 평가 시간이 아닙니다.";
  var options = {};
  options.type = 1;
  //------------------------------------------
  // for smart test
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  if (s > 55) m += 2;
  else m++;

  if (m >= 60) {
    h++;
    m = 0;
  }
  if (h >= 24) h = 0;
  now.setHours(h);
  now.setMinutes(m);
  now.setSeconds(0);

  const nowTime = parseInt(now.getTime() / 1000);
  //------------------------------------------

  options.time = nowTime;
  options.enable = true;
  options.text = " 00:00:00";
  options.iClass = "fa-regular fa-clock";

  this.clRemainTimeClock.setOptions(options);
  this.clRemainTimeClock.start();
};

mtmExamInformationCard.prototype.setTitle = function (title) {
  this.elTitle.innerHTML = title;
};

mtmExamInformationCard.prototype.setDescription = function (description) {
  this.elDescription.innerHTML = description;
};

mtmExamInformationCard.prototype.showDescription = function (bShow) {
  if (bShow) {
    this.elDescription.style.display = "";
    this.elDescription.style.visibility = "visible";
  } else {
    this.elDescription.style.display = "none";
  }
};

mtmExamInformationCard.prototype.setActionTitle = function (action) {
  // action.text = ' 00:00:00';
  // action.iClass = 'fa-regular fa-clock';
  this.clRemainTimeClock.stop();
  this.already = true;
  this.clRemainTimeClock.setTitle(action);
};

mtmExamInformationCard.prototype.showActionTitle = function (bShow) {
  this.clRemainTimeClock.show(bShow);
};

mtmExamInformationCard.prototype.setRemainClock = function (options) {
  this.clRemainTimeClock.setOptions(options);
  this.already = false;
  this.timeOut = false;
  this.clRemainTimeClock.start();
};

mtmExamInformationCard.prototype.setDigitalClockCountDown = function (time) {
  this.clDigitalClock.setCountDownTimer(time, 0);
};

mtmExamInformationCard.prototype.setDigitalClock = function (time) {
  // this.clDigitalClock.setCountDownTimer(time,0);
  this.clDigitalClock.setDigitalClock(time);
};
