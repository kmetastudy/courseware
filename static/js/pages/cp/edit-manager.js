import { branchManager } from "./branch-manager";
import { mtmTreeManager } from "./mtm-tree-manager";
import { CourseManager } from "./course-manager";
import { sectionCpEdit } from "./section-cp-edit";

require("../../../css/pages/cp/edit-manager.css");
export const EditManager = function (options = {}) {
  this.options = options;

  this.create();
  this.initialize();
};

EditManager.prototype.create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("edit-section");

  this.elHeader = document.createElement("div");
  this.elHeader.classList.add("edit-header");
  this.elThis.appendChild(this.elHeader);

  this.elBody = document.createElement("div");
  this.elBody.classList.add("edit-body");
  this.elThis.appendChild(this.elBody);

  // left
  this.elLeft = document.createElement("div");
  this.elLeft.classList.add("edit-left");
  this.elBody.appendChild(this.elLeft);

  this.elTree = document.createElement("div");
  this.elTree.classList.add("edit-tree");
  this.elLeft.appendChild(this.elTree);

  //right
  this.elRight = document.createElement("div");
  this.elRight.classList.add("edit-right");
  this.elBody.appendChild(this.elRight);

  this.elBranch = document.createElement("div");
  this.elBranch.classList.add("edit-branch");
  this.elRight.appendChild(this.elBranch);

  this.elEditor = document.createElement("div");
  this.elEditor.classList.add("edit-editor");
  this.elRight.appendChild(this.elEditor);
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
EditManager.prototype.handleBranchClick = function (data = {}) {
  console.log(data);
  if (data.type && (data.type === 11 || data.type === 12)) {
    console.log(data);
    const [branchId, branchType] = [data.id, data.type];
    this.clBranchManager.activate(branchId, branchType);
  }
};

EditManager.prototype.handleCardClick = function (clCard) {
  this.clSectionCpEdit.assignCardToEditor(clCard);
};

EditManager.prototype.handleCardDelete = function () {
  // TODO
  // card 빼기
};
// ===============================================================
// ============================= API =========================
// ===============================================================
EditManager.prototype.initialize = function () {
  const treeOption = {
    onBranchClick: this.handleBranchClick.bind(this),
  };
  this.clTreeManager = new mtmTreeManager(treeOption);
  this.clBranchManager = new branchManager({
    onCardClick: this.handleCardClick.bind(this),
    onCardDelete: this.handleCardDelete.bind(this),
  });
  this.clCourseManager = new CourseManager();

  this.clSectionCpEdit = new sectionCpEdit();

  this.elHeader.appendChild(this.clCourseManager.getElement());
  this.elBranch.appendChild(this.clBranchManager.getRootElement());
  this.elTree.appendChild(this.clTreeManager.getElement());
  this.elEditor.appendChild(this.clSectionCpEdit.getElement());
  //
};

EditManager.prototype.getElement = function () {
  return this.elThis;
};
