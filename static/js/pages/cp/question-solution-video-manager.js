// import * as mQuestionSolutionVideoApi from "../../api/mQuestionSolutionVideoApi";
import { ApiCp } from "../../core/api/api-cp";
import { mtmSolutionVideoEditor } from "./mtm-solution-video-editor";

export const questionSolutionVideoManager = function (options = {}) {
  this.options = options;
  this.isDataChanged = false;
  this._init();
};

questionSolutionVideoManager.prototype._init = function () {
  const editorOptions = {
    onDataChange: this.handleDataChange.bind(this),
  };
  this.clEditor = new mtmSolutionVideoEditor(editorOptions);

  this.api = new ApiCp("cp", "question_solution_video");
};

// ===============================================================
// =========================== Handler ===========================
// ===============================================================
questionSolutionVideoManager.prototype.handleDataChange = function (isDataChanged) {
  this.isDataChanged = isDataChanged;
  if (this.options.onDataChange) {
    const key = "solutionVideo";
    this.options.onDataChange(key, isDataChanged);
  }
};
// ===============================================================
// ============================= URL =============================
// ===============================================================
questionSolutionVideoManager.prototype.urlCreate = async function (data = {}) {
  try {
    // const createdData = await mQuestionSolutionVideoApi.create(data);
    const createdData = await this.api.create(data);
    return createdData;
  } catch (err) {
    console.log("create solution question error", err);
  }
};

questionSolutionVideoManager.prototype.urlGet = async function (id) {
  try {
    // const data = await mQuestionSolutionVideoApi.get(id);
    const data = await this.api.get(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

questionSolutionVideoManager.prototype.urlUpdate = async function (id, dataToUpdate = {}) {
  try {
    if (!id) {
      return;
    }

    // const updatedData = await mQuestionSolutionVideoApi.update(id, dataToUpdate);
    const updatedData = await this.api.update(id, dataToUpdate);
    return updatedData;
  } catch (err) {
    console.log("update solution question error", err);
  }
};

// ===============================================================
// ============================= API =============================
// ===============================================================
questionSolutionVideoManager.prototype.setDataWithId = async function (id) {
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

questionSolutionVideoManager.prototype.saveData = async function (id, q_id) {
  try {
    if (this.isDataChanged === false || !q_id) {
      return;
    }

    const data = this.clEditor.getData();
    if (id) {
      const dataToSave = data;
      const updatedData = await this.updateData(id, dataToSave);
      return updatedData;
    } else {
      const dataToCreate = {
        q_id: q_id,
      };
      Object.assign(dataToCreate, data);
      const createdData = await this.createData(dataToCreate);
      return createdData;
    }
  } catch (error) {
    console.log(error);
  }
};

questionSolutionVideoManager.prototype.createData = async function (dataToCreate) {
  try {
    const createdData = await this.urlCreate(dataToCreate);
    return createdData;
  } catch (error) {
    console.error(error);
  }
};

questionSolutionVideoManager.prototype.updateData = async function (id, dataToUpdate) {
  try {
    const updatedData = await this.urlUpdate(id, dataToUpdate);
    return updatedData;
  } catch (error) {
    console.error(error);
  }
};

questionSolutionVideoManager.prototype.resetData = function () {
  this.clEditor.reset();
  this.isDataChanged = false;
};

questionSolutionVideoManager.prototype.getRootElement = function () {
  return this.clEditor.getRootElement();
};
