import { Card } from "./card.js";
import { Editor } from "./editor.js";
export const AppGuideline = function () {
  this._init();
};

AppGuideline.prototype._init = function () {
  this._create();
  this._initEditor();
  this._initCard();
};

AppGuideline.prototype._create = function () {
  this.elGuideline = document.createElement("div");
  this.elGuideline.classList.add("index");
};

AppGuideline.prototype.getRootElement = function () {
  return this.elGuideline;
};

AppGuideline.prototype._initEditor = function () {
  const editorOption = {
    onEditorSave: this.handleEditorSave.bind(this),
  };
  this.clEditor = new Editor(editorOption);
  this.elEitor = this.clEditor.getRootElement();
  this.elGuideline.appendChild(this.elEitor);
};

AppGuideline.prototype._initCard = function () {
  this.clCard = new Card();
  this.elCard = this.clCard.getRootElement();
  this.elGuideline.appendChild(this.elCard);
};

// ============================= Handler =============================
AppGuideline.prototype.handleEditorSave = function (data) {
  this.setCardData(data);
};
// ============================= API =============================

AppGuideline.prototype.setEditorData = function (data) {
  this.clEditor.setData(data);
};

AppGuideline.prototype.setCardData = function (data) {
  this.clCard.setData(data);
};
