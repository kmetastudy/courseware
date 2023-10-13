// Simple Confirmation Popup
// https://codepen.io/adventuresinmissions/pen/ExwoWL

// cls-mtv-message-popup -> 주변 어두운 배경 (position - fixed)
// cls-mtv-message-popup-container -> 실제 보이는 dialog

// CodePen Home - Login/Signup Modal Window
// https://codepen.io/adventuresinmissions/pen/poWpWw
import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";
import { mtvStudySubmitAction } from "./mtv-study-submit-action.js";

export var mtvStudyMessagePopup = function (options) {
  this.id = "id-mtv-study-message-popup-" + mtvStudyMessagePopup.id++;

  this.elThis = null;
  this.options = options;

  this.elMessageArea = null;
  this.elMessageItself = null;

  this.init();
};

mtvStudyMessagePopup.id = 0;

mtvStudyMessagePopup.staticTitleArea = [
  {
    level: 0,
    tag: "div",
    class: "mtv-testum-card-normal-number-area px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;background-color:dodgerblue;" },
  },
];

mtvStudyMessagePopup.staticTitleItself = [
  {
    level: 0,
    tag: "div",
    class: "d-flex justify-content-center px-1 py-1 my-0",
    attr: { style: "background-color:dodgerblue; border:2px solid dodgerblue;" },
  },
  { level: 1, tag: "span", class: "font-weight-bold", text: "메세지 타이틀", attr: { style: "color:white" } },
];

mtvStudyMessagePopup.staticMessageItself = [
  { level: 0, tag: "div", class: "d-flex justify-content-center px-1 py-1 my-0", attr: { style: "min-height:200px" } },
  {
    level: 1,
    tag: "div",
    class: "font-weight-bold",
    text: "메세지",
    attr: {
      style:
        "color:dodgerblue;margin: 0;position: absolute;top: 50%;-ms-transform: translateY(-50%);transform: translateY(-50%);",
    },
  },
  // {'level':2,'tag':'p','text':'메세지'}
];

mtvStudyMessagePopup.staticChoiceArea = [
  {
    level: 0,
    tag: "div",
    class: "row d-flex justify-content-center px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
];

mtvStudyMessagePopup.staticChoiceReview = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtvStudyMessagePopup.staticChoiceNext = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtvStudyMessagePopup.staticChoiceFirst = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtvStudyMessagePopup.staticChoiceWrong = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "row d-flex justify-content-center", attr: { style: "" } },
];

mtvStudyMessagePopup.staticBody = [
  {
    level: 0,
    tag: "div",
    class: "mtv-testum-card-normal mx-1 my-1",
    attr: { "data-index": "", "data-uid": "", style: "width:460px" },
  },

  { level: 1, tag: "div", class: "mtv-testum-card-normal-body card-body px-1 py-1" },
  // 제목 영역
  // {'level':2,'comp':'title-area',},
  { level: 2, comp: "title-itself" },
  { level: 2, tag: "hr", class: "mt-1" },

  // // 메세지 영역
  // {'level':2,'comp':'message-area',},
  { level: 2, comp: "message-itself" },
  // {'level':2,'tag':'hr','class':'mt-1'},

  // {'level':2,'tag':'hr','class':'mb-1'},
  // // 선택 영역
  // {'level':2,'comp':'choice-area',},
  //     // 영상 다시 보기, 오답하기
  //     {'level':3,'comp':'choice-review',},
  //         {'level':4,'comp':'mtv-input-button','kind':'watch-video'},
  //         {'level':4,'comp':'mtv-input-button','kind':'retry-wrong'},

  { level: 2, comp: "mtv-study-submit-action" },
  //     // 영상 다시 보기, 다음 하기 ,오답하기
  //     {'level':3,'comp':'choice-next',},
  //         {'level':4,'comp':'mtv-input-button','kind':'watch-video'},
  //         {'level':4,'comp':'mtv-input-button','kind':'try-next'},
  //         {'level':4,'comp':'mtv-input-button','kind':'retry-wrong'},

  //     // 레슨 이어하기 , 처음 부터 다시
  //     {'level':3,'comp':'choice-first',},
  //         {'level':4,'comp':'mtv-input-button','kind':'start-first'},
  //         {'level':4,'comp':'mtv-input-button','kind':'do-continue'},

  //     // 오답하기
  //     {'level':3,'comp':'choice-wrong',},
  //         {'level':4,'comp':'mtv-input-button','kind':'try-wrong'},
];

mtvStudyMessagePopup.prototype.onQuestionSubmitHandler = function () {
  this.doDismiss();
};

mtvStudyMessagePopup.prototype.onCorrectWrongHandler = function () {
  this.doDismiss();
};

mtvStudyMessagePopup.prototype.onNextStepHandler = function () {
  this.doDismiss();
};

mtvStudyMessagePopup.prototype.create = function (tagList) {
  var topElement = document.createElement("div");

  topElement.classList.add("cls-mtv-message-popup-container", "d-flex", "justify-content-center");

  var componentList = [];
  var level = 0;
  var element = null;

  componentList.push(topElement);

  if (tagList) {
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i]["comp"]) {
        if (tagList[i]["comp"] == "title-area") {
          element = this.elTitleArea = mtvElementBuilder.createComponent(mtvStudyMessagePopup.staticTitleArea);
        } else if (tagList[i]["comp"] == "title-itself") {
          element = this.elTitleItself = mtvElementBuilder.createComponent(mtvStudyMessagePopup.staticTitleItself);
        } else if (tagList[i]["comp"] == "message-itself") {
          element = this.elMessageItself = mtvElementBuilder.createComponent(mtvStudyMessagePopup.staticMessageItself);
        } else if (tagList[i]["comp"] == "mtv-study-submit-action") {
          var options = {};
          options.items = [
            {
              enable: true,
              text: "제출",
              icon: "fa fa-check",
              eventHandler: this.onQuestionSubmitHandler.bind(this),
            },
            {
              enable: true,
              text: " 오답 하기",
              icon: "fa fa-check",
              eventHandler: this.onCorrectWrongHandler.bind(this),
            },
            {
              enable: true,
              text: " 다음 하기",
              icon: "fa fa-external-link",
              eventHandler: this.onNextStepHandler.bind(this),
            },
          ];

          this.clSubmitAction = new mtvStudySubmitAction(options);
          element = this.clSubmitAction.elThis;
          // if(this.options && this.options.bSubmitAction)
          this.clSubmitAction.show(true);
          // else
          //     this.clSubmitAction.show(false);
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

mtvStudyMessagePopup.prototype.onDocumentKeyUp = function (e) {
  if (e.which == "27") {
    this.elThis.classList.remove("is-visible");
  }
};

mtvStudyMessagePopup.prototype.onClickOutside = function (e) {
  if (e.target == this.elThis) {
    this.elThis.classList.remove("is-visible");
  }
};

mtvStudyMessagePopup.prototype.init = function () {
  this.elThis = document.createElement("div");

  this.elThis.classList.add("cls-mtv-message-popup");
  this.elContainer = this.create(mtvStudyMessagePopup.staticBody);

  this.elThis.appendChild(this.elContainer);
  // $('.cd-popup').on('click', function(event){
  // 	if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
  // 		event.preventDefault();
  // 		$(this).removeClass('is-visible');
  // 	}
  // });
  this.elThis.addEventListener("click", this.onClickOutside.bind(this));

  document.addEventListener(
    "keyup",
    // function(event){
    //     if(event.which=='27'){
    //         $('.cd-popup').removeClass('is-visible');
    //     }
    // }
    this.onDocumentKeyUp.bind(this),
  );
};

///////////////////////////// API //////////////////////////////
mtvStudyMessagePopup.prototype.setPosition = function (pos) {
  if (pos.width >= 460) {
    // >= 460px
    // left
    var left = pos.left + parseInt((pos.width - 460) / 2) + "px";
    var top = pos.top + parseInt((pos.height - 460) / 2) + "px";
    this.elContainer.style.margin = top + " auto auto " + left;
  }
};

mtvStudyMessagePopup.prototype.doModal = function () {
  this.elThis.classList.add("is-visible");
};

mtvStudyMessagePopup.prototype.doDismiss = function () {
  this.elThis.classList.remove("is-visible");
};

mtvStudyMessagePopup.prototype.setTitle = function (title) {};

mtvStudyMessagePopup.prototype.setMessage = function (message) {};

mtvStudyMessagePopup.prototype.setChoice = function (choice) {};
