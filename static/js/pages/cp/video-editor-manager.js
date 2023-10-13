// import { videoEditor } from "./video-editor";
import { videoEditor } from "../../core/component/video-editor-new";
// import * as mVideoAtomApi from "../../api/mVideoAtomApi";
import { ApiCp } from "../../core/api/api-cp";

export const videoEditorManager = function (options = {}) {
  this.options = options;
  this.api = new ApiCp("cp", "video_atom");
  this.init();
};

videoEditorManager.prototype.init = function () {
  this._initManager();
  this._initVariable();
};

videoEditorManager.prototype._initManager = function () {
  const option = {
    onSaveBtnClick: this.handleSaveBtnClick.bind(this),
  };
  this.clEditor = new videoEditor(option);
};

videoEditorManager.prototype._initVariable = function () {
  this.data = null;
  this.id = null;

  this.clCard = null;
};
// ===============================================================
// =========================== Handler ===========================
// ===============================================================
videoEditorManager.prototype.handleSaveBtnClick = function (data) {
  this.saveData(data);
};
// ===============================================================
// ============================= URL =============================
// ===============================================================
videoEditorManager.prototype.urlUpdate = async function (id, dataToUpdate = {}) {
  try {
    if (!id) {
      return;
    }
    // const updatedData = await mVideoAtomApi.update(id, dataToUpdate);
    const updatedData = await this.api.update(id, dataToUpdate);
    return updatedData;
  } catch (err) {
    console.log("update solution question error", err);
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================
videoEditorManager.prototype.assignCard = async function (clCard) {
  await this.saveData();
  this.reset();

  this.clCard = clCard;

  const data = clCard.getData();
  this.setData(data);
};

videoEditorManager.prototype.saveData = async function (dataToSave) {
  try {
    if (!this.data || !this.clCard) {
      return;
    }
    const [id, clCard] = [this.data.id, this.clCard];
    const nextData = await this.urlUpdate(id, dataToSave);

    this.data = nextData;
    clCard.setData(nextData);
  } catch (error) {
    console.log(error);
  }
};

videoEditorManager.prototype.setData = function (data) {
  this.clEditor.setData(data);
  this.data = data;
  this.id = data.id;
};

videoEditorManager.prototype.reset = function () {
  this._initVariable();
};

videoEditorManager.prototype.resetData = function () {
  this.clEditor.resetData();
  this._initVariable();
};

videoEditorManager.prototype.getRootElement = function () {
  return this.clEditor.getRootElement();
};

videoEditorManager.prototype.activate = function () {
  this.clEditor.activate();
};

videoEditorManager.prototype.deactivate = function () {
  this.clEditor.deactivate();
};

// ===============================================================
// ============================= TOOL ============================
// ===============================================================
