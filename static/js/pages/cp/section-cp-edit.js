import { questionEditServices } from "./question-edit-services";
import { videoEditorManager } from "./video-editor-manager";
import { uiUnderlineTab } from "../../core/ui/ui-underline-tab";
// require("../../../css/pages/cp/section-cp-edit.css");
require("../../../css/pages/cp/section-cp-edit.css");
export const sectionCpEdit = function (options) {
  this.options = options || {};
  this._create();
};

sectionCpEdit.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("cp-edit-area");

  // Tab
  this.contentsTabOptions = {
    onTabClick: this.handleEditTabClick.bind(this),
  };

  this.clEditTab = new uiUnderlineTab(["문제 제작", "비디오 제작", "KL"], this.elThis, this.contentsTabOptions);
  this.elEditTab = this.clEditTab.elThis;

  // Question Editor
  this.questionEditServices = new questionEditServices();
  this.elSectionCpQuestionEdit = this.questionEditServices.getRootElement();
  this.elThis.appendChild(this.elSectionCpQuestionEdit);
  this.clEditTab.setTarget("문제 제작", this.elSectionCpQuestionEdit);

  // Video Editor
  this.editVideoArea = document.createElement("div");
  this.editVideoArea.classList.add("mtm-edit-video-area");
  this.elThis.appendChild(this.editVideoArea);
  this.clEditTab.setTarget("비디오 제작", this.editVideoArea);

  this.videoEditorManager = new videoEditorManager();
  this.elVideo = this.videoEditorManager.getRootElement();
  this.editVideoArea.appendChild(this.elVideo);
  // KL
  this.klSelectArea = document.createElement("div");
  this.klSelectArea.classList.add("mtm-edit-select-kl-area");
  this.elThis.appendChild(this.klSelectArea);
  this.clEditTab.setTarget("KL", this.klSelectArea);
};

// ===================================================================
// ============================= Handler =============================
// ===================================================================
sectionCpEdit.prototype.handleEditTabClick = function (selectedTabIndex) {
  if (selectedTabIndex === 2) {
    this.isKlActivated = true;
  } else {
    this.isKlActivated = false;
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================
sectionCpEdit.prototype.assignCardToEditor = function (clCard) {
  const cardType = clCard.type;
  if (cardType === "question") {
    this.questionEditServices.assignCard(clCard);
    this.activateQuestionTab();
  } else if (cardType === "video") {
    this.videoEditorManager.assignCard(clCard);
    this.activateVideoTab();
  }
};

sectionCpEdit.prototype.getElement = function () {
  return this.elThis;
};

// ============================= Tool =============================
sectionCpEdit.prototype.activateQuestionTab = function () {
  this.clEditTab.show("문제 제작");
  // this.clEditTab.disable("비디오 제작");
};

sectionCpEdit.prototype.activateVideoTab = function () {
  this.clEditTab.show("비디오 제작");
  // this.clEditTab.disable("문제 제작");
};

sectionCpEdit.prototype.deactivateQuestionTab = function () {
  this.clEditTab.disable("문제 제작");
};

sectionCpEdit.prototype.deactivateVideoTab = function () {
  this.clEditTab.disable("비디오 제작");
  // this.clEditTab.disable("문제 제작");
};
