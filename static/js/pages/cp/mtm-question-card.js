import { mtoSVGBuilder } from "../../core/utils/mto-svg-builder";
// import { mtmToggle } from "./mtm-toggle";
require("../../../css/pages/cp/mtm-question-card.css");
/**
 *
 * @param {object} options {{cardData},}
 */
export const mtmQuestionCard = function (options = {}) {
  this.options = options;
  this.type = "question";
  this.data = null; // question atom data

  if (Number.isInteger(this.options.index) && this.options.index >= 0) {
    this.index = this.options.index;
  }

  this.setterMap = {
    content: this.setContent.bind(this),
    answer: this.setAnswer.bind(this),
    level: this.setLevel.bind(this),
  };

  this.styleMap = {
    1: "객관식",
    2: "주관식",
    3: "서술형",
  };

  this.levelMap = {
    1: "하",
    2: "중",
    3: "상",
    4: "극상",
  };
  this._init();
};

mtmQuestionCard.prototype._init = function () {
  this._create();
  this._initEvents();
};

mtmQuestionCard.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-question-card");

  // header
  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("question-card-header");
  this.elThis.appendChild(this.elHeader);

  this.elIndex = document.createElement("button");
  this.elIndex.classList.add("btn-outline-success");
  this.elHeader.appendChild(this.elIndex);

  this.elLevel = document.createElement("button");
  this.elLevel.classList.add("btn-primary");
  this.elHeader.appendChild(this.elLevel);

  this.elAnswer = document.createElement("button");
  this.elAnswer.classList.add("btn-outline-success");
  this.elHeader.appendChild(this.elAnswer);

  this.elDelete = document.createElement("div");
  this.elHeader.appendChild(this.elDelete);

  const clSvgCreator = new mtoSVGBuilder("default");
  const elDelIcon = clSvgCreator.create("fa-solid fa-xmark");
  this.elDelete.appendChild(elDelIcon);

  this.elWrapper = document.createElement("div");
  this.elWrapper.classList.add("card-wrapper");
  this.elWrapper.setAttribute("data-simplebar", "");
  this.elThis.appendChild(this.elWrapper);

  this.elBody = document.createElement("div");
  this.elBody.classList.add("question-card-body");
  // this.elBody.setAttribute("data-simplebar", "");
  // this.elThis.appendChild(this.elBody);
  this.elWrapper.appendChild(this.elBody);
};

mtmQuestionCard.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this.handleCardClick.bind(this));
  // this._initDelConfirm();
};

mtmQuestionCard.prototype._initDelConfirm = function () {
  const self = this;
  $(function () {
    $(self.elDelete)
      .jConfirm({
        question: "카드를 삭제하시겠습니까?",
        confirm_text: "예",
        deny_text: "아니요",
      })
      .on(
        "confirm",
        function (e) {
          self.handleCardDelete();
        }.bind(this),
      );
  });
};
// ===================================================================
// ============================= Handler =============================
// ===================================================================
mtmQuestionCard.prototype.handleCardClick = function () {
  console.log(this.data);
  if (this.options.onCardClick) {
    this.options.onCardClick(this);
  }
};

mtmQuestionCard.prototype.handleCardDelete = function () {
  if (this.options.onCardDelete) {
    this.options.onCardDelete(this);
  }
};

// TOGGLE
mtmQuestionCard.prototype.handleToggleClick = function (isToggleActivated) {
  if (this.options.onCardToggleClick) {
    this.options.onCardToggleClick(isToggleActivated, this.data.id);
  }
};

mtmQuestionCard.prototype.handleToggleActivate = function () {
  if (this.options.onCardToggleActivate) {
    this.options.onCardToggleActivate();
  }
};

mtmQuestionCard.prototype.handleToggleDeActivate = function () {
  if (this.options.onCardToggleDeActivate) {
    this.options.onCardToggleDeActivate();
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================
mtmQuestionCard.prototype.setData = function (data) {
  console.log("mtm-question-card > setData : ", data);
  this.data = data;
  for (let key in this.setterMap) {
    if (data[key]) {
      this.setterMap[key](data[key]);
    }
  }
};

mtmQuestionCard.prototype.setContent = function (questionEl) {
  this.resetChildNodes(this.elBody);
  this.elBody.innerHTML = questionEl;
  this.renderLatex(this.elBody);
};

mtmQuestionCard.prototype.setLevel = function (qDiff) {
  if (!qDiff) {
    this.elLevel.innerHTML = "";
    return;
  }
  this.elLevel.innerHTML = `난이도: ${qDiff}`;
};

mtmQuestionCard.prototype.setAnswer = function (qAnswer) {
  if (qAnswer) {
    this.elAnswer.innerHTML = `정답: ${qAnswer}`;
  }
};

mtmQuestionCard.prototype.setIndex = function (index) {
  if (Number.isInteger(index) && index >= 0) {
    this.index = index;
    this.elIndex.innerHTML = this.index + 1;
  }
};

mtmQuestionCard.prototype.getData = function () {
  return this.data;
};

mtmQuestionCard.prototype.getType = function () {
  return this.type;
};

mtmQuestionCard.prototype.getIndex = function () {
  return this.index;
};

mtmQuestionCard.prototype.getRootElement = function () {
  return this.elThis;
};

mtmQuestionCard.prototype.select = function () {
  this.elThis.classList.add("selected");
};

mtmQuestionCard.prototype.unselect = function () {
  this.elThis.classList.remove("selected");
};

// ===============================================================
// ============================= Tool ============================
// ===============================================================
mtmQuestionCard.prototype.resetChildNodes = function (parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.lastChild);
  }
};

mtmQuestionCard.prototype.activateKl = function () {
  const toggleOptions = {
    onToggleClick: this.handleToggleClick.bind(this),
    onToggleActivate: this.handleToggleActivate.bind(this),
    onToggleDeActivate: this.handleToggleDeActivate.bind(this),
  };
  this.clToggle = this.clToggle || new mtmToggle(toggleOptions);
  this.elToggle = this.clToggle.elThis;
  this.elHeader.insertBefore(this.elToggle, this.elHeader.children[2]);
};

mtmQuestionCard.prototype.deActivateKl = function () {
  if (this.elToggle) {
    this.elToggle.remove();
  }
};

mtmQuestionCard.prototype.activateToggle = function () {
  this.clToggle.activate();
};

mtmQuestionCard.prototype.deActivateToggle = function () {
  this.clToggle.deActivate();
};

mtmQuestionCard.prototype.renderLatex = function (el) {
  renderMathInElement(el, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
};
