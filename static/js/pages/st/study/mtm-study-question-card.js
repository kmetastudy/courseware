// mtvPlayerTestumCard 와 동일한 기능을 한다.
// 여러가지 기능을 넣어야 한다.
// 1) 풀이/정답를 보여줄 것인가?
// 1-1) Text 풀이
// 1-2) Video 풀이
// 2) 단독 제출 가능한가?
// 3) 채점 마크 표시 및 사용자 답 표시 읽기 모드
//
import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

import { mtmStudyAnswerChoice } from "./mtm-study-answer-choice.js";
import { mtmStudyAnswerShort } from "./mtm-study-answer-short.js";
import { mtmStudyAnswerLong } from "./mtm-study-answer-long.js";
import { mtmStudySubmitAction } from "./mtm-study-submit-action.js";
// Todo. Jstar : mtmSolutionListContainer 로 대체
import { mtmStudySolutionList } from "./mtm-study-solution-list.js";

require("./mtm-study-question-card.css");
require("./mtm-study-question-ckeditor.css");
require("../../../../css/core/component/mtm-form.css");

export var mtmStudyQuestionCard = function (options) {
  this.id = "id-mtm-study-question-card-" + mtmStudyQuestionCard.id++;

  this.elThis = null;
  this.elContentArea = null;
  this.elContentItself = null;
  // this.elSolutionProperty = null;
  // this.elDeleteConform = null;

  this.options = {};

  this.elChoiceNumber = [];

  this._copyData(options);

  this.width = mtmStudyQuestionCard.width;
  this.height = mtmStudyQuestionCard.height;
  this.innerHeight = this.height;
  this.content = mtmStudyQuestionCard.content;
  this.widthInner = mtmStudyQuestionCard.width;

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

mtmStudyQuestionCard.id = 0;
mtmStudyQuestionCard.width = 100;
mtmStudyQuestionCard.height = 100;
mtmStudyQuestionCard.content = "내용 없음";

mtmStudyQuestionCard.staticNumberArea = [
  {
    level: 0,
    tag: "div",
    class: "mtv-testum-card-normal-number-area px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
];

mtmStudyQuestionCard.staticNumberItself = [
  {
    level: 0,
    tag: "button",
    class: "mtm-study-question-number-btn mtm-study-question-number py-0",
    attr: { type: "button" },
    prop: { disabled: "true" },
  },
  { level: 1, tag: "span", class: "font-weight-bold", text: "10번" },
];

mtmStudyQuestionCard.staticAnswerArea = [
  {
    level: 0,
    tag: "div",
    class: "row d-flex justify-content-center px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
];

mtmStudyQuestionCard.staticAnswerChoice = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtmStudyQuestionCard.staticChoiceNumber = [
  {
    level: 0,
    tag: "div",
    class: "mtm-study-answer-choice-number text-center",
    attr: { "data-sel": "", "data-clicked": "false" },
  },
  // {'level':1,'tag':'span',},
];

mtmStudyQuestionCard.staticContentArea = [
  {
    level: 0,
    tag: "div",
    class: "mtm-testum-card-normal-container px-0 py-0 my-0",
    attr: { style: "overflow-y:hidden; overflow-x:hidden;" },
  },
];

// 문제 padding 장조
mtmStudyQuestionCard.staticContentItself = [
  { level: 0, tag: "div", class: "px-3 py-0 my-0 mtm-testum-card-normal-normal", attr: { style: "width:100%;" } },
];

// mtvPlayerTestumCard 와 다른 부분
mtmStudyQuestionCard.staticSubmitArea = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtmStudyQuestionCard.staticBody = [
  {
    level: 0,
    tag: "div",
    class: "mtm-testum-card-normal mx-1",
    attr: {
      "data-index": "",
      "data-uid": "",
      // 'style':'width:270px',
    },
  },

  { level: 1, tag: "div", class: "mtm-testum-card-normal-body px-1 py-1" },
  // 번호 영역
  { level: 2, comp: "number-area" },
  { level: 3, comp: "number-itself" },
  { level: 2, tag: "hr", class: "mt-1" },

  // 문제 영역
  { level: 2, comp: "content-area" },
  { level: 3, comp: "content-itself" },

  { level: 2, tag: "hr", class: "mb-1" },
  // 정답 영역
  { level: 2, comp: "answer-area" },
  // 객관식
  { level: 3, comp: "mtm-study-answer-choice" },
  // 단답형
  { level: 3, comp: "mtm-study-answer-short" },
  // 서술형
  { level: 3, comp: "mtm-study-answer-long" },

  // 제출/행위 영역
  { level: 2, comp: "mtm-study-submit-action" },
  // 해설/해답 영역
  { level: 2, comp: "mtm-study-solution-list" },
];

mtmStudyQuestionCard.prototype._renderQuestionKatex = function (el, content) {
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

mtmStudyQuestionCard.prototype._copyData = function (data) {
  if (!data) return;

  // mtvPlayerTestumCard 와 다른 부분
  this.options.bSubmitAction = data.bSubmitAction;
  this.options.submitList = data.submitList;

  // 이부분은 Direct 로 위로 올라 간다.
  // this.options.eventSubmitHandler = data.eventSubmitHandler;
  // this.options.eventCorrectWrongHandler = data.eventCorrectWrongHandler;
  // this.options.eventNextStepHandler = data.eventNextStepHandler;

  this.options.type = data.type;
  // if(data.tag)
  //     console.log('mtmStudyQuestionCard > _copyData : tag',data.tag)
  this.options.tag = data.tag;

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

mtmStudyQuestionCard.prototype._clearChoiceAnswer = function (answer) {
  // for(var i=0;i<this.elChoiceNumber.length;i++)
  // {
  //     this.elChoiceNumber[i].setAttribute('data-clicked',false);
  //     this.elChoiceNumber[i].classList.remove('active');
  // }
  this.clAnswerChoice.clearAnswer();
};

mtmStudyQuestionCard.prototype._clearShortAnswer = function (answer) {
  this.clAnswerShort.setAnswer("");
};

mtmStudyQuestionCard.prototype._clearLongAnswer = function (answer) {
  this.clAnswerLong.setAnswer("");
};

// mtmStudyQuestionCard.prototype.clickChoiceNumberHandler = function(e) {
//     if(!this.enableAnswer)
//         return;

//     var el = e.target;

//     var clicked = el.getAttribute('data-clicked');

//     if(clicked=='false')
//         clicked = true;
//     else
//         clicked = false;

//     el.setAttribute('data-clicked',clicked);
//     // console.log('mtmStudyQuestionCard : clickChoiceNumberHandler > ', el);
//     if(clicked)
//         el.classList.add('active');
//     else
//         el.classList.remove('active');
// }
mtmStudyQuestionCard.prototype.onChangeAnswerChoiceHandler = function (eData) {
  if (this.options && this.options.eventAnswerChangeHandler) this.options.eventAnswerChangeHandler(eData);
};

mtmStudyQuestionCard.prototype.onChangeAnswerShortHandler = function (eData) {
  if (this.options && this.options.eventAnswerChangeHandler) this.options.eventAnswerChangeHandler(eData);
};

mtmStudyQuestionCard.prototype.onChangeAnswerLongHandler = function (eData) {
  if (this.options && this.options.eventAnswerChangeHandler) this.options.eventAnswerChangeHandler(eData);
};

// mtmStudyQuestionCard.prototype.onSubmitHandler = function(eData) {
//     // console.log('mtmStudyQuestionCard > onSubmitHandler : ',this.options.eventSubmitHandler);
//     if(this.options && this.options.eventSubmitHandler)
//         this.options.eventSubmitHandler();
// }

// mtmStudyQuestionCard.prototype.onCorrectWrongHandler = function() {
//     if(this.options && this.options.eventCorrectWrongHandler)
//         this.options.eventCorrectWrongHandler();
// }

// mtmStudyQuestionCard.prototype.onNextStepHandler = function() {
//     if(this.options && this.options.eventNextStepHandler)
//         this.options.eventNextStepHandler();
// }

mtmStudyQuestionCard.prototype.onCancelHandler = function (eData) {
  console.log("mtmStudyQuestionCard > onCancelHandler");
};

mtmStudyQuestionCard.prototype.onSettingHandler = function (eData) {
  console.log("mtmStudyQuestionCard > onSettingHandler");
};

mtmStudyQuestionCard.prototype.create = function (tagList) {
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
        if (tagList[i]["comp"] == "number-area") {
          element = this.elNumberArea = mtvElementBuilder.createComponent(mtmStudyQuestionCard.staticNumberArea);
          // this.elContentArea.style.width = this.width + '%';
          this.elCorrectMark = document.createElement("img");
          this.elWrongMark = document.createElement("img");
          // <img src="{%static 'img/correct.png' %}">
          this.elCorrectMark.src = "/static/img/correct.png";
          this.elCorrectMark.style = "position:absolute;top:-10px;left:-5px;display:none;z-index:10;opacity: 0.8;";

          this.elWrongMark.src = "/static/img/incorrect.png";
          this.elWrongMark.style = "position:absolute;top:-10px;left:-5px;display:none;z-index:10;opacity: 0.8;";
          this.elNumberArea.appendChild(this.elCorrectMark);
          this.elNumberArea.appendChild(this.elWrongMark);
        } else if (tagList[i]["comp"] == "number-itself") {
          element = this.elNumberItself = mtvElementBuilder.createComponent(mtmStudyQuestionCard.staticNumberItself);
          this.elNumber = this.elNumberItself.children[0];
          this.elNumber.innerHTML = this.options.no + "번";
        } else if (tagList[i]["comp"] == "content-area") {
          element = this.elContentArea = mtvElementBuilder.createComponent(mtmStudyQuestionCard.staticContentArea);
          this.elContentArea.style.width = this.width + "%";
          // this.elContentArea.style.height = this.innerHeight + 'px';
        } else if (tagList[i]["comp"] == "content-itself") {
          element = this.elContentItself = mtvElementBuilder.createComponent(mtmStudyQuestionCard.staticContentItself);
          this.elContentItself.style.width = this.widthInner + "%";
          // this.elContentItself.style.height = this.innerHeight + 'px';
          // this.elContentArea.style.width = this.width*2 + 'px';
          // this.elContentArea.style.height = parseInt(this.height/2) + 'px';

          // this.elContentItself.innerHTML = this.content;
          // renderMathInElement(this.elContentItself);
        } else if (tagList[i]["comp"] == "answer-area") {
          element = this.elAnswerArea = mtvElementBuilder.createComponent(mtmStudyQuestionCard.staticAnswerArea);
        } else if (tagList[i]["comp"] == "mtm-study-answer-choice") {
          var options = {};
          options.choice = ["1", "2", "3", "4", "5", "?"];
          options.eventHandler = this.onChangeAnswerChoiceHandler.bind(this);
          this.clAnswerChoice = new mtmStudyAnswerChoice(options);
          element = this.clAnswerChoice.elThis;
          if (this.options.style != "1") this.clAnswerChoice.show(false);
          else this.clAnswerChoice.show(true);
        } else if (tagList[i]["comp"] == "mtm-study-answer-short") {
          var options = {};
          options.eventHandler = this.onChangeAnswerShortHandler.bind(this);
          options.showLabel = false;
          this.clAnswerShort = new mtmStudyAnswerShort(options);
          element = this.clAnswerShort.elThis;
          if (this.options.style != "2")
            // this.clAnswerShort.elThis.style.display = 'none';
            this.clAnswerShort.show(false);
        } else if (tagList[i]["comp"] == "mtm-study-answer-long") {
          var options = {};
          options.showLabel = false;
          options.eventHandler = this.onChangeAnswerLongHandler.bind(this);
          this.clAnswerLong = new mtmStudyAnswerLong(options);
          element = this.clAnswerLong.elThis;

          if (this.options.style != "3")
            // this.clAnswerLong.elThis.style.display = 'none';
            this.clAnswerLong.show(false);
        } else if (tagList[i]["comp"] == "mtm-study-submit-action") {
          var options = {};

          this.clSubmitAction = new mtmStudySubmitAction(options);
          element = this.clSubmitAction.elThis;
          if (this.options && this.options.bSubmitAction) this.clSubmitAction.show(true);
          else this.clSubmitAction.show(false);
        } else if (tagList[i]["comp"] == "mtm-study-solution-list") {
          // 0) 여기서 뭔가 옵션을 조정해서 Solution 보기를 조정해야 할 것 같은데...

          var options = {};
          options.type = 0;
          if (this.options && this.options.type) options.type = this.options.type;

          if (this.options && this.options.bSubmitAction) options.bMarginTop = false;
          else options.bMarginTop = true;
          // 1) Solution 보기에 대한 Handler 설정...
          // if(this.options && this.options.eventSolutionHandler)
          //     options.eventSolutionHandler = this.options.eventSolutionHandler;

          // 2) 만들때, Solution 관련 Data를 가지고 가야하나?
          // 혹은 나중에 라도 Setting을 할 수 있나?

          options.eventSolutionHandler = this.onEventSolutionHandler.bind(this);
          this.clStudySolutionList = new mtmStudySolutionList(options);
          // this.clStudySolutionList.show(false);
          element = this.clStudySolutionList.elThis;

          if (this.options && this.options.bShowSolution) this.clStudySolutionList.show(false);
        }
      } else {
        element = mtvElementBuilder.createElement(tagList[i]);
      }

      level = tagList[i]["level"];

      componentList[level].appendChild(element);
      componentList[level + 1] = element;
    }
  }

  return topElement;
};

mtmStudyQuestionCard.prototype._initEvents = function () {
  // this.elThis.addEventListener('click',this.onSelectHanlder.bind(this));
  // this.elThis.addEventListener('dragstart',this.onDragStartHandler.bind(this));
};

mtmStudyQuestionCard.prototype.prepare = function () {
  mtmStudyQuestionCard.staticBody[0]["data-index"] = this.options.index;
  mtmStudyQuestionCard.staticBody[0]["data-uid"] = this.options.id;
  mtmStudyQuestionCard.staticBody[2]["text"] = this.options.index + 1;

  // mtmStudyQuestionCard.staticBody[3]['text'] = mtvQuestionContainer.Level[parseInt(this.options.level)-1];
  // mtmStudyQuestionCard.staticBody[4]['text'] = mtvQuestionContainer.Style[parseInt(this.options.style)-1];

  // mtmStudyQuestionCard.staticBody[5]['data-index'] = this.options.index;
  // mtmStudyQuestionCard.staticBody[5]['data-uid'] = this.options.id;

  // mtmStudyQuestionCard.staticDeleteConform[0]['attr']['data-index'] = this.options.index+1;
  // mtmStudyQuestionCard.staticDeleteConform[0]['attr']['data-uid'] = this.options.id;
};

mtmStudyQuestionCard.prototype._init = function () {
  this.prepare();

  this.elThis = document.createElement("div");
  this.elThis.setAttribute("style", "align-self:center;");
  this.elThis.setAttribute("id", this.id);
  // this.elThis.setAttribute('class','pl-3');

  var element = this.create(mtmStudyQuestionCard.staticBody);

  if (this.elContentItself) this._renderQuestionKatex(this.elContentItself, this.options.content);

  // this.setSolutionProperty(this.options.bSolutionText,this.options.bSolutionVideo);

  this.elThis.appendChild(element);

  // this._initEvents();

  // 만약 actionList
  // if(this.options.bSubmit) // 1 : normal , 2 == 제출 가능
  //     ;
};
///////////////////////// Event Handler //////////////////////////////////
mtmStudyQuestionCard.prototype.onEventSolutionHandler = function (eData) {
  console.log("mtmStudyQuestionCard > onEventSolutionHandler: ", eData, this.options);
  if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
};

///////////////////////// API //////////////////////////////////

mtmStudyQuestionCard.prototype.setAnswerEnable = function (bEnable) {
  this.bEnableAnswer = bEnable;
  this.clAnswerChoice.setAnswerEnable(bEnable);
  // Todo. Jstar : ShortAnswer
  this.clAnswerShort.setAnswerEnable(bEnable);
};

mtmStudyQuestionCard.prototype.setQuestionData = function (item) {
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

mtmStudyQuestionCard.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmStudyQuestionCard.prototype.setCorrectMark = function () {
  this.elWrongMark.style.display = "none";
  this.elCorrectMark.style.display = "block";
};

mtmStudyQuestionCard.prototype.setWrongMark = function () {
  this.elWrongMark.style.display = "block";
  this.elCorrectMark.style.display = "none";
};

mtmStudyQuestionCard.prototype.hideAllMark = function () {
  this.elWrongMark.style.display = "none";
  this.elCorrectMark.style.display = "none";
};

mtmStudyQuestionCard.prototype.disableAnswer = function () {
  this.enableAnswer = false;
};

mtmStudyQuestionCard.prototype.enableAnswer = function () {
  this.enableAnswer = true;
};

mtmStudyQuestionCard.prototype.disableChoice = function () {};

mtmStudyQuestionCard.prototype.enableChoice = function () {};

mtmStudyQuestionCard.prototype.showSubmitAction = function (bShow) {
  this.clSubmitAction.show(bShow);
};

mtmStudyQuestionCard.prototype.setShowSubmitAction = function (index, bShow, bMargin) {
  this.clSubmitAction.setShow(index, bShow, bMargin);
};

mtmStudyQuestionCard.prototype.setShowSubmitList = function (bShowList) {
  this.clSubmitAction.setShowList(bShowList);
};

mtmStudyQuestionCard.prototype.setEnableSubmitAction = function (index, bShow) {
  this.clSubmitAction.setEnable(index, bShow);
};

mtmStudyQuestionCard.prototype.setSubmitItemList = function (items) {
  this.clSubmitAction.setSubmitItemList(items);
};

mtmStudyQuestionCard.prototype.setAnswer = function (answer) {
  if (answer) this.options.answer = answer;
  if (answer == "") this.options.answer = "";

  if (this.options.style == 1) {
    // 객관식
    console.log("mtmStudyQuestionCard > setAnswer :", answer);
    this.clAnswerChoice.setAnswer(answer);
  }
  // Todo. Jstar : ShortAnswer
  else if (this.options.style == 2) {
    // 단답형
    console.log("mtmStudyQuestionCard > Short setAnswer :", answer);
    this.clAnswerShort.setAnswer(answer);
  }
};

mtmStudyQuestionCard.prototype.setCorrectAnswer = function () {
  // var answer = this.getAnswer();
  this.setAnswer(this.options.answer);
};

mtmStudyQuestionCard.prototype.getAnswer = function () {
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

mtmStudyQuestionCard.prototype.getPoint = function () {
  var tag = this.options.tag;
  if (!tag) tag = 0;
  var value = parseInt(tag);
  if (isNaN(value)) value = 0;
  return value;
};

mtmStudyQuestionCard.prototype.showSolution = function (bShow) {
  // if(bShow)
  this.clStudySolutionList.show(bShow);
};

mtmStudyQuestionCard.prototype.setSolution = function (items) {
  this.clStudySolutionList.setSolution(items);
};
