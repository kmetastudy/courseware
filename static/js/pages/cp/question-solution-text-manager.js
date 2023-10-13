// import * as mQuestionSolutionTextApi from "../../api/mQuestionSolutionTextApi";
import { ApiCp } from "../../core/api/api-cp";
import { mtmSolutionTextEditor } from "./mtm-solution-text-editor";

export const questionSolutionTextManager = function (options = {}) {
  this.options = options;
  this.isDataChanged = false;

  this._init();
};

questionSolutionTextManager.prototype._init = function () {
  const editorOption = {
    onDataChange: this.handleDataChange.bind(this),
  };
  this.clEditor = new mtmSolutionTextEditor(editorOption);

  this.api = new ApiCp("cp", "question_solution_text");
};

// ===============================================================
// =========================== Handler ===========================
// ===============================================================
questionSolutionTextManager.prototype.handleDataChange = function (isDataChanged) {
  this.isDataChanged = isDataChanged;
  if (this.options.onDataChange) {
    const key = "solutionText";
    this.options.onDataChange(key, isDataChanged);
  }
};
// ===============================================================
// ============================= URL =============================
// ===============================================================
questionSolutionTextManager.prototype.urlCreate = async function (data = {}) {
  try {
    // const createdData = await mQuestionSolutionTextApi.create(data);
    const createdData = await this.api.create(data);
    return createdData;
  } catch (err) {
    console.log("create solution question error", err);
  }
};

questionSolutionTextManager.prototype.urlGet = async function (id) {
  try {
    // const data = await mQuestionSolutionTextApi.get(id);
    const data = await this.api.get(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

questionSolutionTextManager.prototype.urlUpdate = async function (id, dataToUpdate = {}) {
  try {
    if (!id) {
      return;
    }

    // const updatedData = await mQuestionSolutionTextApi.update(id, dataToUpdate);
    const updatedData = await this.api.update(id, dataToUpdate);
    return updatedData;
  } catch (err) {
    console.log("update solution question error", err);
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
questionSolutionTextManager.prototype.setDataWithId = async function (id) {
  try {
    this.resetData();
    if (!id) {
      return;
    }
    const data = await this.urlGet(id);
    this.clEditor.setData(data);
  } catch (err) {
    console.log(err);
  }
};

questionSolutionTextManager.prototype.saveData = async function (id, q_id) {
  try {
    if (this.isDataChanged === false || !q_id) {
      return;
    }
    const content = this.clEditor.getData();
    if (id) {
      const dataToSave = content;
      const updatedData = await this.updateData(id, dataToSave);
      return updatedData;
    } else {
      const dataToCreate = {
        q_id: q_id,
        content: this.clEditor.getData(),
      };
      const createdData = await this.createData(dataToCreate);
      return createdData;
    }
  } catch (error) {
    console.log(error);
  }
};

questionSolutionTextManager.prototype.createData = async function (dataToCreate) {
  try {
    const createdData = await this.urlCreate(dataToCreate);
    return createdData;
  } catch (error) {
    console.error(error);
  }
};

questionSolutionTextManager.prototype.updateData = async function (id, dataToUpdate) {
  try {
    const updatedData = await this.urlUpdate(id, dataToUpdate);
    return updatedData;
  } catch (error) {
    console.error(error);
  }
};

questionSolutionTextManager.prototype.resetData = function () {
  this.clEditor.resetData();
  this.isDataChanged = false;
};

questionSolutionTextManager.prototype.getRootElement = function () {
  return this.clEditor.elThis;
};
