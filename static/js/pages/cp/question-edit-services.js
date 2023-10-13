import { questionEditorManager } from "./question-editor-manager";
import { questionSolutionTextManager } from "./question-solution-text-manager";
import { questionSolutionVideoManager } from "./question-solution-video-manager";
// import
import { mtmTab } from "../../core/ui/mtm-tab";
import { mtmButton } from "../../core/ui/mtm-button";

require("../../../css/pages/cp/section-cp-question-edit.css");
export const questionEditServices = function (options = {}) {
  this.options = options;

  this.clCard = null;
  this.data = null;

  // question, solutionText, solutionVideo의 데이터가 변화 -> 저장하기 활성화
  this.dataChangeTracker = {
    question: false,
    solutionText: false,
    solutionVideo: false,
  };

  this._init();
};

questionEditServices.prototype._init = function () {
  this._create();
  this._initManagers();
};

questionEditServices.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("class", "section-cp-question-edit");
  // header
  this.elHeader = document.createElement("header");
  this.elHeader.classList.add("section-cp-question-edit-header");
  this.elThis.appendChild(this.elHeader);
  //문제 입력
  this.questionTabOptions = {
    data: [{ title: "문제입력" }, { title: "해설달기" }, { title: "해설영상" }],
  };
  this.clQuestionTab = new mtmTab(this.questionTabOptions);
  this.elQuestionTab = this.clQuestionTab.elThis;
  this.elQuestionTab.classList.add("question-edit-header-tab");
  this.elHeader.appendChild(this.elQuestionTab);

  // =================== buttons ================
  this.elButtonArea = document.createElement("div");
  this.elButtonArea.setAttribute("class", "question-button-area");
  this.elHeader.appendChild(this.elButtonArea);

  // 저장하기
  this.saveOption = {
    name: "저장하기",
    events: [{ eventType: "click", event: this.handleSaveBtnClick.bind(this) }],
  };
  this.clButtonSave = new mtmButton(this.saveOption);
  this.elButtonSave = this.clButtonSave.getRootElement();
  this.elButtonArea.appendChild(this.elButtonSave);
  this.disableSaveButton(true);

  // =================== body ================
  this.elBody = document.createElement("div");
  this.elBody.classList.add("section-cp-question-edit-body");
  this.elThis.appendChild(this.elBody);
};

questionEditServices.prototype._initManagers = function () {
  const qEditorOptions = {
    onQuestionUpdate: this.handleQuestionUpdate.bind(this),
    onDataChange: this.handleEditorDataChange.bind(this),
  };
  this.clQuestionEditorManager = new questionEditorManager(qEditorOptions);
  this.elEditQuestion = this.clQuestionEditorManager.getRootElement();
  this.elBody.appendChild(this.elEditQuestion);
  this.clQuestionTab.setDisplayTarget("문제입력", this.elEditQuestion);
  // 해설달기
  const solutionTextOption = {
    onDataChange: this.handleEditorDataChange.bind(this),
  };
  this.clQuestionSolutionTextManager = new questionSolutionTextManager(solutionTextOption);
  this.elSolutionText = this.clQuestionSolutionTextManager.getRootElement();
  this.elBody.appendChild(this.elSolutionText);
  this.clQuestionTab.setDisplayTarget("해설달기", this.elSolutionText);
  this.clQuestionTab.disableTarget(1);
  // 해설 영상
  const solutionVideoOption = {
    onDataChange: this.handleEditorDataChange.bind(this),
  };
  this.clQuestionSolutionVideoManager = new questionSolutionVideoManager(solutionVideoOption);
  this.elSolutionVideo = this.clQuestionSolutionVideoManager.getRootElement();
  this.elBody.appendChild(this.elSolutionVideo);
  this.clQuestionTab.setDisplayTarget("해설영상", this.elSolutionVideo);
  this.clQuestionTab.disableTarget(2);
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
questionEditServices.prototype.handleSaveBtnClick = function () {
  console.log(this.dataChangeTracker);
  this.saveData();
  this.disableSaveButton(true);
};

questionEditServices.prototype.handleQuestionUpdate = function (updatedQuestionData) {
  this.clCard.setData(updatedQuestionData);
};

questionEditServices.prototype.handleEditorDataChange = function (key, isDataChanged) {
  this.dataChangeTracker[key] = isDataChanged;
  const shouldDisableSaveButton = this.shouldDisableSaveButton();
  console.log(shouldDisableSaveButton);
  this.disableSaveButton(shouldDisableSaveButton);
};
// ===============================================================
// ============================= API =============================
// ===============================================================
questionEditServices.prototype.assignCard = function (clCard) {
  this.saveData();
  const [nextCard, nextData] = [clCard, clCard.getData()];
  this.reset();
  this.clCard = nextCard;
  this.data = nextData;
  this.setData(nextData);
  this.clQuestionTab.showTargetWithIndex(0);
};

questionEditServices.prototype.setData = function (questionAtomData) {
  const solution_text_id = questionAtomData.solution_text;
  const solution_video_id = questionAtomData.solution_video;

  this.clQuestionEditorManager.setData(questionAtomData);
  this.clQuestionSolutionTextManager.setDataWithId(solution_text_id);
  this.clQuestionSolutionVideoManager.setDataWithId(solution_video_id);
};

questionEditServices.prototype.saveData = async function () {
  if (!this.data || !this.clCard) {
    return;
  }

  const [data, clCard] = [this.data, this.clCard];
  const [questionId, questionSolutionTextId, questionSolutionVideoId] = [
    data.id,
    data.solution_text_id,
    data.solution_video_id,
  ];
  const [isQuestionChanged, isSolutionTextChanged, isSolutionVideoChanged] = [
    this.dataChangeTracker.question,
    this.dataChangeTracker.solutionText,
    this.dataChangeTracker.solutionVideo,
  ];

  if (isQuestionChanged === true) {
    this.saveQuestionData(questionId, clCard);
  }
  if (isSolutionTextChanged === true) {
    this.saveQuestionSolutionTextData(questionSolutionTextId, questionId, clCard);
  }
  if (isSolutionVideoChanged === true) {
    this.saveQuestionSolutionVideoData(questionSolutionVideoId, questionId, clCard);
  }
};

questionEditServices.prototype.reset = function () {
  this.data = null;
  this.clCard = null;
  this.disableSaveButton(true);
  this.resetDataTracker();
};

questionEditServices.prototype.resetDataTracker = function () {
  for (let key in this.dataChangeTracker) {
    this.dataChangeTracker[key] = false;
  }
};

questionEditServices.prototype.getRootElement = function () {
  return this.elThis;
};

questionEditServices.prototype.saveQuestionData = async function (questionAtomId, clCard) {
  try {
    const savedData = await this.clQuestionEditorManager.saveData(questionAtomId);
    clCard.setData(savedData);
  } catch (error) {}
};

questionEditServices.prototype.saveQuestionSolutionTextData = async function (solutionTextId, questionAtomId, clCard) {
  try {
    const savedData = await this.clQuestionSolutionTextManager.saveData(solutionTextId, questionAtomId);
    if (!savedData) {
      return;
    }

    const dataToUpdate = {
      solution_text: savedData.id,
    };
    const updatedData = await this.clQuestionEditorManager.updateData(questionAtomId, dataToUpdate);
    clCard.setData(updatedData);
  } catch (error) {
    console.error(error);
  }
};

questionEditServices.prototype.saveQuestionSolutionVideoData = async function (
  solutionVideoId,
  questionAtomId,
  clCard,
) {
  try {
    const savedData = await this.clQuestionSolutionVideoManager.saveData(solutionVideoId, questionAtomId);

    if (!savedData) {
      return;
    }

    const dataToUpdate = {
      solution_video: savedData.id,
    };
    const updatedData = await this.clQuestionEditorManager.updateData(questionAtomId, dataToUpdate);
    clCard.setData(updatedData);
  } catch (error) {
    console.error(error);
  }
};

// ===============================================================
// ============================= Tool =============================
// ===============================================================
questionEditServices.prototype.activate = function () {
  this.isActivated = true;
};

questionEditServices.prototype.deactivate = function () {
  this.isActivated = false;
  this.data = null;
  this.clCard = null;
  this.resetDataTracker();
};

questionEditServices.prototype.shouldDisableSaveButton = function () {
  for (let key in this.dataChangeTracker) {
    if (this.dataChangeTracker[key] === true) {
      return false;
    }
  }
  return true;
};

questionEditServices.prototype.disableSaveButton = function (shouldDisable) {
  // if (this.isActivated === false) {
  //   return;
  // }
  this.clButtonSave.disable(shouldDisable);
};
