import { mtvInputSelectScroll } from "../../core/ui/mtv-input-select-scroll";
import { mtmQuestionAnswer } from "../../core/component/mtm-question-answer";

require("../../../css/pages/cp/mtm-question-editor.css");
export let mtmQuestionEditor = function (options) {
  this.options = options || {};
  this.data = {
    style: "0",
    level: "0",
    answer: null,
    content: "",
  };

  this.setDataMap = {
    style: this.setStyle.bind(this),
    level: this.setLevel.bind(this),
    answer: this.setAnswer.bind(this),
    content: this.setContent.bind(this),
  };

  this.styleObject = {
    객관식: "1",
    주관식: "2",
    서술형: "3",
  };

  this.styleTitleObject = {
    1: "객관식",
    2: "주관식",
    3: "서술형",
  };

  this.levelObject = {
    하: "1",
    중: "2",
    상: "3",
    극상: "4",
  };

  this.levelTitleObject = {
    1: "하",
    2: "중",
    3: "상",
    4: "극상",
  };

  this.dataChangeTracker = {
    style: false,
    level: false,
    answer: false,
    content: false,
  };

  this.isDataChanged = false;
  this._init();
};

mtmQuestionEditor.prototype._init = function () {
  this._setOptions();
  this._create();
  this._initCkEditor();
};

mtmQuestionEditor.prototype._setOptions = function () {
  this.LevelScrollOption = {
    items: ["난이도"],
    eventHandler: this.handleLevelScrollSelect.bind(this),
  };
  this.levelListItem = ["하", "중", "상", "극상"];

  this.TypeScrollOption = {
    items: ["문제유형"],
    eventHandler: this.handleTypeScrollSelect.bind(this),
  };
  this.typeListItem = ["객관식", "주관식", "서술형"];
};

mtmQuestionEditor.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("class", "question-editor");

  // =================== scrolls ================
  this.elScrollArea = document.createElement("div");
  this.elScrollArea.setAttribute("class", "question-scroll-area");
  this.elThis.appendChild(this.elScrollArea);

  this.clLevelScroll = new mtvInputSelectScroll(this.LevelScrollOption);
  this.clLevelScroll.setList(this.levelListItem);
  this.elScrollArea.appendChild(this.clLevelScroll.elThis);

  this.clTypeScroll = new mtvInputSelectScroll(this.TypeScrollOption);
  this.clTypeScroll.setList(this.typeListItem);
  this.elScrollArea.appendChild(this.clTypeScroll.elThis);

  // =================== answer =================
  this.clQuestionAnswer = new mtmQuestionAnswer();
  this.elThis.appendChild(this.clQuestionAnswer.elThis);

  // =================== body(editor) ================
  this.elEditorArea = document.createElement("div");
  this.elEditorArea.setAttribute("class", "question-editor-area");
  this.elThis.appendChild(this.elEditorArea);

  this.elEditor = document.createElement("div");
  this.elEditor.setAttribute("class", "editor");
  this.elEditorArea.appendChild(this.elEditor);

  // =================== tag ===================
  this.elTagArea = document.createElement("div");
  this.elTagArea.classList.add("question-tag-area");
  this.elThis.appendChild(this.elTagArea);

  this.elTag = document.createElement("input");
  this.elTag.classList.add("question-tag-input");
  this.elTag.setAttribute("type", "text");
  this.elTag.setAttribute("placeholder", "태그를 입력해주세요");
  this.elTagArea.appendChild(this.elTag);
};

mtmQuestionEditor.prototype._initCkEditor = function () {
  this.editor = ClassicEditor.create(this.elEditor)
    .then((editor) => {
      this.editor = editor;
      editor.model.document.on("change:data", (evt, data) => {
        let contentData = editor.getData();
        this.handleDataChange("content", contentData !== this.data.content);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

// ===================================================================
// ============================= Handler =============================
// ===================================================================
mtmQuestionEditor.prototype.handleLevelScrollSelect = function (text, index) {
  this.handleDataChange("level", this.levelObject[text] !== this.data.level);
};

mtmQuestionEditor.prototype.handleTypeScrollSelect = function (text, index) {
  this.clQuestionAnswer.showAnswerArea(text);
  this.data.styleTitle = text;
  this.clQuestionAnswer.resetValues();
  this.handleDataChange("style", this.styleObject[text] !== this.data.style);
};

mtmQuestionEditor.prototype.handleDataChange = function (key, isKeyDataChanged) {
  this.dataChangeTracker[key] = isKeyDataChanged;
  this.isDataChanged = false;
  for (let key in this.dataChangeTracker) {
    if (this.dataChangeTracker[key] === true) {
      this.isDataChanged = true;
      break;
    }
  }
  if (this.options.onDataChange) {
    this.options.onDataChange(this.isDataChanged);
  }
};
// ================================================================
// ============================= API =============================
// ================================================================
mtmQuestionEditor.prototype.getData = function () {
  this.saveData();
  return this.data;
};

mtmQuestionEditor.prototype.setData = function (data = {}) {
  this.resetData();
  this.setDataWithMap(data);
};

mtmQuestionEditor.prototype.saveData = function () {
  this.data.level = this.levelObject[this.clLevelScroll.elsObject.elSelect.innerHTML];
  this.data.style = this.styleObject[this.clTypeScroll.elsObject.elSelect.innerHTML];
  this.data.answer = this.clQuestionAnswer.getAnswer(this.data.styleTitle);
  this.data.content = this.editor.getData();
};

mtmQuestionEditor.prototype.resetData = function () {
  this.clQuestionAnswer.resetValues();
  this.data.content = "";
  this.editor.setData("");
  this.resetDataChange();
  // level
  // type
};

mtmQuestionEditor.prototype.resetDataChange = function () {
  for (let key in this.dataChangeTracker) {
    this.dataChangeTracker[key] = false;
  }
  this.isDataChanged = false;
};

mtmQuestionEditor.prototype.setDataWithMap = function (data) {
  for (var key in this.setDataMap) {
    if (data[key]) {
      const targetData = data[key];
      this.setDataMap[key](targetData);
    }
  }
};

mtmQuestionEditor.prototype.setLevel = function (levelData) {
  this.data.level = levelData;
  this.levelTitle = this.levelTitleObject[levelData];
  this.clLevelScroll.setTitle(this.levelTitle);
};

/**
 *
 * @param {*} styleData '1', '2', '3'
 */
mtmQuestionEditor.prototype.setStyle = function (styleData) {
  this.data.style = styleData;
  this.data.styleTitle = this.styleTitleObject[styleData]; // 객관식/주관식/서술형
  this.clTypeScroll.setTitle(this.data.styleTitle);
  this.clQuestionAnswer.showAnswerArea(this.data.styleTitle);
};

mtmQuestionEditor.prototype.setAnswer = function (answerData) {
  this.data.answer = answerData;
  this.clQuestionAnswer.setAnswer(answerData, this.data.styleTitle);
};

/**
 * set data to ckeditor
 * @param {*} contentData
 */
mtmQuestionEditor.prototype.setContent = function (contentData) {
  this.data.content = contentData;
  this.editor.setData(contentData);
};
