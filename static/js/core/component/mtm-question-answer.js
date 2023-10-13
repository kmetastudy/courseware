require("../../../css/core/component/mtm-question-answer.css");
export const mtmQuestionAnswer = function (options) {
  this.options = options || {};
  this.elAnswerArray = [];
  this.dataIndex = 0;
  this.answerType = null;
  this.elMultipleInputArray = []; // [inputEl1, inputEl2, ...]
  this.elMultipleInputObject = {}; // inputTagId : labelValue
  this._init();
};

mtmQuestionAnswer.prototype._init = function () {
  this._setOptions();
  this._create();
};

mtmQuestionAnswer.prototype._setOptions = function () {
  this.choiceArray = this.options.choiceArray || ["1", "2", "3", "4", "5"];
};

mtmQuestionAnswer.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-question-answer");

  // 객관식
  this.elTypeMultiple = document.createElement("div");
  this.elTypeMultiple.classList.add("answer-type-multiple");
  this.elTypeMultiple.classList.add("active");
  this.elThis.appendChild(this.elTypeMultiple);

  this.choiceArray.forEach((choice) => {
    this.addMultipleInput(choice);
  });

  // 서술형/주관식
  this.elTypeEssay = document.createElement("div"); // 주관식/서술형
  this.elTypeEssay.classList.add("answer-type-essay");
  this.elThis.appendChild(this.elTypeEssay);

  this.essayInput = document.createElement("input");
  this.essayInput.classList.add("essay-input");
  this.essayInput.setAttribute("type", "text");
  this.essayInput.setAttribute("placeholder", "정답을 입력해주세요.");
  this.elTypeEssay.appendChild(this.essayInput);
};

// ===================================================================
// ============================= Handler =============================
// ===================================================================

// ===============================================================
// ============================= API =============================
// ===============================================================
/**
 *
 * @param {*} choice 객관식 문항(usually 1,2,3,4,5)
 */
mtmQuestionAnswer.prototype.addMultipleInput = function (choice) {
  let multipleFrame = document.createElement("div");
  multipleFrame.classList.add("answer-multiple-frame");

  let multipleInput = document.createElement("input");
  multipleInput.classList.add("multiple-choice");
  multipleInput.setAttribute("type", "checkbox");
  multipleInput.setAttribute("id", `multiple-choice-${this.dataIndex}`);
  this.elMultipleInputArray.push(multipleInput);
  multipleFrame.appendChild(multipleInput);

  let multipleLabel = document.createElement("label");
  multipleLabel.setAttribute("for", multipleInput.id);
  multipleLabel.setAttribute("type", "checkbox");
  multipleLabel.innerHTML = choice;
  multipleFrame.appendChild(multipleLabel);

  this.elMultipleInputObject[choice] = multipleInput;
  this.elTypeMultiple.appendChild(multipleFrame);
  this.dataIndex++;
};
// ===============================================================
// ============================= API =============================
// ==============================================================
mtmQuestionAnswer.prototype.saveAnswer = function (answerType) {
  let answer = [];
  if (answerType === "객관식") {
    for (var key in this.elMultipleInputObject) {
      if (this.elMultipleInputObject[key].checked) {
        answer.push(key);
      }
    }
  } else if (answerType === "주관식" || answerType === "서술형") {
    answer.push(this.essayInput.value);
  }
  this.answer = answer.join(",");
};

mtmQuestionAnswer.prototype.getAnswer = function (answerType) {
  this.saveAnswer(answerType);
  return this.answer;
};

/**
 *
 * @param {String} data ex) '1,2,3' || '123'
 * @param {String} answerType '객관식','주관식','서술형'
 */
mtmQuestionAnswer.prototype.setAnswer = function (data, answerType) {
  this.resetValues();
  if (answerType === "객관식") {
    let dataSplited = data.length != 0 ? data.split(",") : [];
    dataSplited.forEach((answer) => {
      this.elMultipleInputObject[answer].checked = true;
    });
  } else if (answerType === "주관식" || answerType === "서술형") {
    this.essayInput.value = data;
  }
  this.saveAnswer(answerType);
};

// reset values
mtmQuestionAnswer.prototype.resetValues = function () {
  this.answer = null;
  this.resetChecked();
  this.resetEssayValue();
};

mtmQuestionAnswer.prototype.resetChecked = function () {
  this.elMultipleInputArray.forEach((el) => {
    el.checked = false;
  });
};

mtmQuestionAnswer.prototype.resetEssayValue = function () {
  this.essayInput.value = "";
};

mtmQuestionAnswer.prototype.showAnswerArea = function (answerType) {
  this.elTypeMultiple.classList.remove("active");
  this.elTypeEssay.classList.remove("active");
  if (answerType === "객관식") {
    this.elTypeMultiple.classList.add("active");
    this.answerType = answerType;
  } else if (answerType === "서술형" || answerType === "주관식") {
    this.elTypeEssay.classList.add("active");
    this.answerType = answerType;
  } else {
    console.log("문제 유형 선택이 잘못되었습니다.");
  }
};
