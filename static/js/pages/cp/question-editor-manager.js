import { ApiCp } from "../../core/api/api-cp";
import { mtmQuestionEditor } from "./mtm-question-editor";
// import * as mQuestionAtomApi from "../../api/mQuestionAtomApi";
export const questionEditorManager = function (options = {}) {
  this.options = options;
  this.isDataChanged = false;
  this._init();
};

questionEditorManager.prototype._init = function () {
  const editorOptions = {
    onDataChange: this.handleDataChange.bind(this),
  };
  this.clEditor = new mtmQuestionEditor(editorOptions);

  this.api = new ApiCp("cp", "question_atom");
};

// ===============================================================
// =========================== Handler ===========================
// ===============================================================
questionEditorManager.prototype.handleDataChange = function (isDataChanged) {
  this.isDataChanged = false;
  if (this.options.onDataChange) {
    const key = "question";
    this.options.onDataChange(key, isDataChanged);
  }
};
// ===============================================================
// ============================= URL =============================
// ===============================================================
questionEditorManager.prototype.urlUpdate = async function (id, dataToUpdate = {}) {
  try {
    // const updatedData = await mQuestionAtomApi.update(id, dataToUpdate);
    const updatedData = await this.api.update(id, dataToUpdate);
    return updatedData;
  } catch (err) {
    console.log("update question error", err);
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
questionEditorManager.prototype.setData = function (questionAtomData) {
  this.clEditor.setData(questionAtomData);
};

questionEditorManager.prototype.saveData = async function (id) {
  try {
    if (!id) {
      return;
    }
    const dataToSave = this.clEditor.getData();
    console.log("qemanager", id, dataToSave);
    const updatedData = await this.updateData(id, dataToSave);
    return updatedData;
  } catch (error) {
    console.error(error);
  }
};

questionEditorManager.prototype.updateData = async function (id, dataToUpdate) {
  const updatedData = await this.urlUpdate(id, dataToUpdate);
  return updatedData;
};

questionEditorManager.prototype.resetData = function () {
  this.clEditor.resetData();
};

questionEditorManager.prototype.getRootElement = function () {
  return this.clEditor.elThis;
};
