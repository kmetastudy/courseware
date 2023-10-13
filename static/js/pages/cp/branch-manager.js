import { mtmButton } from "../../core/ui/mtm-button";
import { mtmLesson } from "./lesson";
import { mtmTestum } from "./testum";

// require("../../../../css/core/view/component/section-cp-course-unit.css");
export const branchManager = function (options = {}) {
  this.options = options;

  this.id = null;
  this.type = null; // 11/12

  this._init();
};

branchManager.prototype._init = function () {
  this._create();
  this._initManager();
  this._initVariable();
};
branchManager.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("section-cp-course-unit");

  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("section-unit-header");
  this.elThis.appendChild(this.elHeader);
  this.createOption = {
    name: "새 유닛 만들기",
    events: [{ eventType: "click", event: this.handleCreateBtnClick.bind(this) }],
    id: "unit-create-btn",
  };
  this.clCreateUnitBtn = new mtmButton(this.createOption);
  this.elHeader.appendChild(this.clCreateUnitBtn.elThis);

  this.deleteOption = {
    name: "유닛 삭제하기",
    id: "unit-delete-btn",
  };
  this.clDeleteUnitBtn = new mtmButton(this.deleteOption);
  this.elHeader.appendChild(this.clDeleteUnitBtn.elThis);

  this.elBodyContainer = document.createElement("div");
  this.elBodyContainer.classList.add("course-unit-body-container");
  this.elThis.appendChild(this.elBodyContainer);

  this.elSimpleBar = document.createElement("div");
  this.elSimpleBar.classList.add("course-unit-simplebar");
  this.elSimpleBar.setAttribute("data-simplebar", "");
  this.elBodyContainer.appendChild(this.elSimpleBar);

  this.elBody = document.createElement("div");
  this.elBody.classList.add("section-unit-body");
  this.elBody.classList.add("no-unit");

  this.elSimpleBar.appendChild(this.elBody);
  // this._initUnitDelJConfirm();
  this._initSortable();
};

branchManager.prototype._initManager = function () {
  const branchOption = {
    onUnitClick: this.handleUnitClick.bind(this),
    onCardClick: this.handleCardClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
  };

  this.clTestum = new mtmTestum(this.elBody, branchOption);
  this.clLesson = new mtmLesson(this.elBody, branchOption);

  this.branchManagerMap = {
    11: this.clTestum,
    12: this.clLesson,
  };
};

branchManager.prototype._initVariable = function () {
  this.id = null;
  this.type = null;
  this.branchManager = null; //11: clTestum, 12: clLesson
};

branchManager.prototype._initUnitDelJConfirm = function () {
  const self = this;
  $(function () {
    $(`#${self.clDeleteUnitBtn.elThis.id}`)
      .jConfirm({
        question: "유닛을 삭제하시겠습니까?",
        confirm_text: "예",
        deny_text: "아니요",
      })
      .on(
        "confirm",
        function (e) {
          self.handleUnitDeleteBtnClick();
        }.bind(this),
      );
  });
};

branchManager.prototype._initSortable = function () {
  const self = this;
  let clSortable = new Sortable(this.elBody, {
    // group: 'shared',
    ghostClass: "highlight",
    animation: 150,
    onUpdate: function (evt) {
      self.handleUnitShift(evt.oldIndex, evt.newIndex);
    },
  });
};

branchManager.prototype.setBranchManager = function (branchType) {
  if (!this.isValidBranchType(branchType)) {
    this.deactivate();
    return;
  }
  this.type = branchType;
  this.branchManager = this.branchManagerMap[branchType];
};

branchManager.prototype.isValidBranchType = function (branchType) {
  return branchType === 11 || branchType === 12;
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
branchManager.prototype.handleCreateBtnClick = function () {
  this.branchManager.createUnit();
};

branchManager.prototype.handleUnitDeleteBtnClick = function () {
  this.branchManager.deleteUnit();
};

branchManager.prototype.handleUnitShift = function (oldIndex, newIndex) {
  this.branchManager.shiftUnit(oldIndex, newIndex);
};

branchManager.prototype.handleUnitClick = function (cardsNum) {
  // is it necessary?
};

branchManager.prototype.handleCardClick = function (clCard) {
  if (this.options.onCardClick) {
    this.options.onCardClick(clCard);
  }
};
branchManager.prototype.handleCardDelete = function () {
  // remove assigned card in editor
  if (this.options.onCardDelete) {
    this.options.onCardDelete();
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================
branchManager.prototype.activate = function (branchId, branchType) {
  this.elThis.classList.add("activate");
  this.setBranchManager(branchType);
  this.branchManager.activate(branchId);
};

branchManager.prototype.deactivate = function () {
  this.branchManager.deactivate();
  this.elThis.classList.remove("activate");

  this._initVariable();
};

branchManager.prototype.getRootElement = function () {
  return this.elThis;
};
