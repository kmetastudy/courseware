import { mtmButton } from "../../core/ui/mtm-button";
import { mtmQuestionCard } from "./mtm-question-card";
import { mtmVideoCard } from "./mtm-video-card";
require("../../../css/pages/cp/mtm-box.css");

/**
 *
 * @param {Object} options {data:[{cardOptions}]}
 */
export const mtmBox = function (options = {}) {
  this.options = options;

  this.clCards = [];
  this.clSelectedCard = null;

  this._init();
};

mtmBox.prototype._init = function () {
  this._create();
  this._initEvents();
  this._initCardOption();
};

mtmBox.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-box");

  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("box-header");
  this.elThis.appendChild(this.elHeader);

  this.elTitle = document.createElement("span");
  this.elTitle.classList.add("box-title");
  this.elHeader.appendChild(this.elTitle);

  this.elButtonArea = document.createElement("div");
  this.elButtonArea.classList.add("box-button-container");
  this.elHeader.appendChild(this.elButtonArea);

  this.createButtonOptions = {
    name: "create",
    events: [{ eventType: "click", event: this.handleCreateButtonClick.bind(this) }],
  };
  this.clCreateButton = new mtmButton(this.createButtonOptions);
  this.elCreateButton = this.clCreateButton.elThis;
  this.elButtonArea.appendChild(this.elCreateButton);

  // Body
  this.elSimplebarBody = document.createElement("div");
  this.elSimplebarBody.classList.add("box-simple-bar");
  this.elSimplebarBody.setAttribute("data-simplebar", "");
  this.elSimplebarBody.setAttribute("data-simplebar-auto-hide", "false");
  this.elThis.appendChild(this.elSimplebarBody);

  this.elBody = document.createElement("div");
  this.elBody.classList.add("box-body");
  this.elSimplebarBody.appendChild(this.elBody);

  this._initSortable();
};

mtmBox.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this.handleClick.bind(this));
};

mtmBox.prototype._initSortable = function () {
  const self = this;
  this.elSortable = new Sortable(this.elBody, {
    ghostClass: "highlight",
    animation: 150,
    filter: ".sortable-filter",
    onUpdate(evt) {
      self.handleCardShift(evt.oldIndex, evt.newIndex);
    },
    onMove(evt) {
      return evt.related.className.indexOf("sortable-filter") === -1;
    },
  });
};

mtmBox.prototype._initCardOption = function () {
  this.questionCardOption = {
    onCardClick: this.handleCardClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
    onCardToggleClick: this.handleCardToggleClick.bind(this),
    onCardToggleActivate: this.handleCardToggleActivate.bind(this),
    onCardToggleDeActivate: this.handleCardToggleDeActivate.bind(this),
  };

  this.videoCardOption = {
    onCardClick: this.handleCardClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
  };
};
// ===================================================================
// ============================= Handler =============================
// ===================================================================
mtmBox.prototype.handleClick = function (event) {
  this.select();
  if (this.options.onBoxClick) {
    this.options.onBoxClick(this);
  }
};

mtmBox.prototype.handleCreateButtonClick = function (evt) {
  if (this.options.onCardCreateBtnClick) {
    this.options.onCardCreateBtnClick();
  }
};

mtmBox.prototype.handleCardClick = function (clCard) {
  this.selectCard(clCard);
  if (this.options.onCardClick) {
    this.options.onCardClick(clCard);
  }
};

mtmBox.prototype.handleCardDelete = function (clCard) {
  const indexToRemove = clCard.getIndex();
  if (indexToRemove < 0 || indexToRemove >= this.clCards.length) {
    return;
  }
  this.elBody.removeChild(clCard.getRootElement());
  this.clCards.splice(indexToRemove, 1);
  this.resetCardIndex();
  if (this.options.onCardDelete) {
    this.options.onCardDelete(clCard);
  }
};

mtmBox.prototype.handleCardShift = function (oldIndex, newIndex) {
  if (oldIndex >= 0 && oldIndex < this.clCards.length && newIndex >= 0 && newIndex < this.clCards.length) {
    this.swapMethods(this.clCards, oldIndex, newIndex);
    this.resetCardIndex();
    if (this.options.onCardShift) {
      this.options.onCardShift(oldIndex, newIndex);
    }
  }
};

mtmBox.prototype.handleKlBtnClick = function () {
  // TODO
  // 한번에 kl 등록하기 , 해제하기.
};

mtmBox.prototype.handleCardToggleClick = function (isToggleActivated, atomId) {
  if (this.options.onCardToggleClick) {
    this.options.onCardToggleClick(isToggleActivated, atomId);
  }
};

mtmBox.prototype.handleCardToggleActivate = function () {
  if (this.options.onCardToggleActivate) {
    this.options.onCardToggleActivate();
  }
};

mtmBox.prototype.handleCardToggleDeActivate = function () {
  if (this.options.onCardToggleDeActivate) {
    this.options.onCardToggleDeActivate();
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
mtmBox.prototype.activate = function () {
  this.resetCards();
  this.elThis.setAttribute("style", "display:block");
  // this.select();
};

mtmBox.prototype.deactivate = function () {
  this.elThis.setAttribute("style", "none");
  this.resetCards();
  this.unselect();
};

/**
 *
 * @param {number} cardIndex >=0
 * @returns
 */
mtmBox.prototype.createQuestionCard = function (cardIndex) {
  const index = this.getValidIndex(cardIndex);
  const option = {};

  option.index = index;
  Object.assign(option, this.questionCardOption);

  const clCard = new mtmQuestionCard(option);

  this.elBody.insertBefore(clCard.elThis, this.elBody.children[index]);
  this.clCards.splice(option.index, 0, clCard);
  return clCard;
};

/**
 *
 * @param {number} cardIndex >=0
 * @returns
 */
mtmBox.prototype.createVideoCard = function (cardIndex) {
  const index = this.getValidIndex(cardIndex);
  const option = {};
  option.index = index;
  Object.assign(option, this.videoCardOption);

  const clCard = new mtmVideoCard(option);
  this.elBody.insertBefore(clCard.elThis, this.elBody.children[index]);
  this.clCards.splice(option.index, 0, clCard);
  return clCard;
};

mtmBox.prototype.getRootElement = function () {
  return this.elThis;
};

mtmBox.prototype.getCardsNum = function () {
  return this.clCards.length;
};
// ===================================================================
// ============================= tool ================================
// ===================================================================
mtmBox.prototype.resetCards = function () {
  this.clCards = [];
  this.clSelectedCard = null;
  this.resetChildNodes(this.elBody);
};

mtmBox.prototype.scrollToEnd = function () {
  const contentWrapper = this.elSimplebarBody.querySelector(".simplebar-content-wrapper");

  if (contentWrapper) {
    contentWrapper.scrollLeft = contentWrapper.scrollWidth;
  }
};

mtmBox.prototype.resetChildNodes = function (parentNode) {
  while (parentNode.lastElementChild) {
    parentNode.removeChild(parentNode.lastElementChild);
  }
};

mtmBox.prototype.resetCardIndex = function () {
  this.clCards.forEach((clCard, cardIndex) => {
    clCard.setIndex(cardIndex);
  });
};

mtmBox.prototype.select = function () {
  this.elThis.classList.add("selected");
};

mtmBox.prototype.unselect = function () {
  this.elThis.classList.remove("selected");
  this.unselectCard();
};

mtmBox.prototype.selectCard = function (clCard) {
  this.unselectCard();

  clCard.select();
  this.clSelectedCard = clCard;
};

mtmBox.prototype.unselectCard = function () {
  if (this.clSelectedCard) {
    this.clSelectedCard.unselect();
  }
  this.clSelectedCard = null;
};

mtmBox.prototype.swapMethods = function (array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};

mtmBox.prototype.getValidIndex = function (index) {
  return typeof index === "number" && index >= 0 ? index : this.clCards.length;
};
