import { mtmSortableTree } from "../../core/ui/mtm-sortable-tree";
import { mtoEvents } from "../../core/utils/mto-events";

export const mtmTreeManager = function (options = {}) {
  this.options = options;
  this.data = null;
  this._init();
};

mtmTreeManager.prototype._init = function () {
  this._initVariable();
  this._create();
  this.initTree();
  // this._initEvents();
};

mtmTreeManager.prototype._initVariable = function () {
  if (this.options.data) {
    this.data = this.options.data;
  }
};

mtmTreeManager.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("tree-manager");
};

mtmTreeManager.prototype.initTree = function () {
  const treeOption = {
    onItemClick: this.handleBranchClick.bind(this),
  };
  this.clTree = new mtmSortableTree(this.elThis, this.data, treeOption);

  mtoEvents.on("onCourseBookSelect", this.activate.bind(this)); // course-manager > initializeBranch
};
// ===============================================================
// =========================== Handler ===========================
// ===============================================================
mtmTreeManager.prototype.handleBranchClick = function (data) {
  // -> branch manager.
  if (this.options.onBranchClick) {
    this.options.onBranchClick(data);
  }
};
// ===============================================================
// ============================= URL =============================
// ===============================================================

// ===============================================================
// ============================= API =============================
// ===============================================================

mtmTreeManager.prototype.activate = function (data) {
  console.log(data);
  // const treeData = this.composeTreeData(data);
  // const treeData = this.composeTreeData(data);
  const arrayData = [];
  arrayData.push(data);
  this.clTree.render(arrayData);
};

mtmTreeManager.prototype.composeTreeData = function (data) {
  let treeData = [];
  const chapterSize = data.children.length;
  for (var i = 0; i < chapterSize; i++) {
    const chapter = data.children;
    let chapterData = {
      label: chapter.title,
      children: chapter.children,
    };
  }
};

mtmTreeManager.prototype.getElement = function () {
  return this.elThis;
};
