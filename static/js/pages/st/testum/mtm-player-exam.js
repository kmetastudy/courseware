// 1) Testum 처음 시작시.
//  1-1) 본(!= 오답) 문제 모드 이다.
//  1-2) 본 문제 모드는 '제출' 버튼을 Click 해야 채점을 한다.
//  1-3) '제출'시 , 맞으면 'O', 틀리면 'X' , 정답 미기입 '?' 으로 결과표 생성
//  1-4) 본 문제의 'X' 결과는 , 오답 모드의 '?' 가 된다.
//  1-5) 본 문제의 'O' 결과는 , 오답 모드의 '' 가 된다.
//  1-6) 본 문제의 '?' 결과는 , 오답 모드의 '' 가 된다.
//  1-6) 본 문제의 결과 중 'X' 는 Click 불가능 , 나머지 'O'/'?'는 Click 가능

// 1) '테스트'를 처음 시작해서, '제출' 하면,
//  1-1) 본 결과 테이블에 'O'-정답, 'X'-오답 , '?'-미답 으로 표시 된다.
//  1-2) 본 결과의 'X' 시, 오답 결과는 '?' 가 되고, 오답 모드 테이블 버튼 가능.
//  1-3) 본 결과의 'O','?'는, 오답 결과에 반영 안됨.
//  1-4) 테이블 버튼 클릭시, 모드에 상관 없이 '?' 결과만 제시.
//  1-5) 테스텀 Unit 완료 에 따른, 다음 Unit 가능 제시.

// 1) 오답하기 : 개별 제출시
//  1-1) 맞으면 : O 표시 -> (확인,해설보기 On)
//  1-2) 틀리면 : X 표시 -> (오답하기,해설보기 On)
// 2) 오답하기 : 틀린 문제 접근시
// 테스텀 세로 문제 -> 테스텀 가로 문제
import { mtoContentFormat } from "../../../core/utils/mto-content-format";
import { mtoConfirmPopup } from "../../../core/ui/output/mto-confirm-popup.js";
import { mtoEvents } from "../../../core/utils/mto-events.js";

import { mtmPlayerExamTitle } from "./mtm-player-testum-title.js";
import { mtmPlayerExamSubmitAction } from "./mtm-player-testum-submit-action.js";

import { mtmPlayerExamResultAction } from "./mtm-player-testum-result-action.js";
import { mtmPlayerExamResultTable } from "./mtm-player-testum-result-table.js";
import { mtmPlayerExamResultTable } from "./mtm-player-exam-result-table.js";

// Exam Truth Table
import { mtmListTableStatisticsCourseTruth } from "../../../core/component/mtm-list-table-statistics-course-truth";

import { mtmPlayerExamViewer } from "./mtm-player-testum-viewer.js";

import { mtmPlayerExamProgress } from "./mtm-player-testum-progress.js";
import { mtmPlayerExamIndicator } from "./mtm-player-testum-indicator.js";

// Fixed. Jstar : Testum 문제 동영상 해설보기
import { mtmPlayerVideoContent } from "../lesson/mtm-player-video-content.js";

// clinic content 와 normal content 를 왜 굳이 구별했을까?
// playMode == contentKind  :    0 --> normal Class Content
//                              1 --> clinic content
// playMode == action_request (DB)
export var mtmPlayerExam = function (options) {
  this.id = "id-mtm-player-exam-" + mtmPlayerExam.id++;
  this.elThis = null;

  this.options = options;

  if (!this.options) this.options = {};

  this.index = -1;
  // this.playMode = 0;
  this.content_type = mtoContentFormat.TESTUM;
  this.course_type = mtoContentFormat.COURSE_NORMAL;

  this.bShowResult = false;

  this.resultList = [];
  this.player = {};
  this._init();
};

mtmPlayerExam.id = 0;
mtmPlayerExam.MaxTwinNum = 2;
mtmPlayerExam.MaxIndex = 3;
mtmPlayerExam.MaxTestumContentNum = 6;

////////////////////////////////////////////////////////////////////////////////////////////

mtmPlayerExam.prototype._initTest = function () {
  var len = mtmPlayerExam.questionList.length;
  this.player.testIndicator = [];
  this.player.testCard = [];
  for (var i = 0; i < len * 3; i++) {
    this.player.testIndicator.push({
      index: i + 1,
      active: i == 0,
      id: i + 1,
    });

    this.player.testCard.push({
      no: i + 1,
      content: mtmPlayerExam.questionList[i % len].content,
      id: mtmPlayerExam.questionList[i % len].id,
      style: mtmPlayerExam.questionList[i % len].style,
      level: mtmPlayerExam.questionList[i % len].level,
    });
  }
};

mtmPlayerExam.prototype._createTestumTitle = function (parent) {
  var options = {};
  options.title = "테스트 제목";

  this.clTestumTitle = new mtmPlayerExamTitle(options);
  parent.appendChild(this.clTestumTitle.elThis);
};

mtmPlayerExam.prototype._createTestumProgress = function (parent) {
  var options = {};
  options.items = [];

  this.clPlayerTestumProgress = new mtmPlayerExamProgress(options);

  parent.appendChild(this.clPlayerTestumProgress.elThis);
};

mtmPlayerExam.prototype._createTestumSubmitAction = function (parent) {
  var options = {};
  (options.eventTimerHandler = this.onElapseTimer.bind(this)),
    (options.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this)),
    (options.eventNextStepHandler = this.onNextStepHandler.bind(this)),
    (options.eventStatusHandler = this.onTableStatusHandler.bind(this)),
    (this.clTestumSubmitAction = new mtmPlayerExamSubmitAction(options));
  parent.appendChild(this.clTestumSubmitAction.elThis);
};

mtmPlayerExam.prototype._createTestumIndicator = function (parent) {
  var options = {};

  options.items = this.player.testIndicator;

  options.eventClickHandler = this.clickIndicatorHandler.bind(this);
  this.clTestumIndicator = new mtmPlayerExamIndicator(options);

  parent.appendChild(this.clTestumIndicator.elThis);
};

mtmPlayerExam.prototype._createTestumViewer = function (parent) {
  var options = {};
  options.items = this.player.testCard;
  options.eventActiveIndexChangeHandler = this.onActiveIndexChangeHandler.bind(this);
  options.eventSolutionHandler = this.onEventSolutionHandler.bind(this);

  // 테스트에서는 각 문제를 Submit 할 수 없기 때문에 이는 의미가 없다.
  // Fix. 오답하기에서는 각문제를 Submit 할 수 있기 때문에...,
  // Testum Submit Event 가 된다.
  options.eventSubmitHandler = this.onEventSubmitHandlerNew.bind(this);
  options.eventConfirmHandler = this.onConfirmHandler.bind(this);
  options.eventExamStartHandler = this.onExamStartHandler.bind(this);
  options.eventExamEndHandler = this.onExamEndHandler.bind(this);
  options.eventTimeOutHandler = this.onExamTimeOutHandler.bind(this);
  options.eventAnswerChangeHandler = this.onAnswerChangeHandler.bind(this);
  this.clPlayerTestumViewer = new mtmPlayerExamViewer(options);

  parent.appendChild(this.clPlayerTestumViewer.elThis);
};

// 이것을 안쓰는 것 같음.
mtmPlayerExam.prototype._createTestumResultAction = function (parent) {
  var options = {};
  (options.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this)),
    (options.eventNextStepHandler = this.onNextStepHandler.bind(this)),
    (options.eventStatusHandler = this.onSliderStatusHandler.bind(this)),
    (this.clTestumResultAction = new mtmPlayerExamResultAction(options));
  parent.appendChild(this.clTestumResultAction.elThis);
  this.clTestumResultAction.show(false);
};

mtmPlayerExam.prototype._createTestumResultTable = function (parent) {
  var options = {};
  // 현재 기능 없음
  options.eventQuestionMarkClick = this.onQuestionMarkClickHandler.bind(this);
  options.eventTableButtonClick = this.onTableButtonClickHandlerNew.bind(this);
  options.eventCellClick = this.onCellClickHandlerNew.bind(this);

  this.clTestumResultTable = new mtmPlayerExamResultTable(options);
  parent.appendChild(this.clTestumResultTable.elThis);
  this.clTestumResultTable.show(false);
};

mtmPlayerExam.prototype._createExamResultTable = function (parent) {
  var options = {};
  options.type = 1;
  // options.eventQuestionMarkClick = this.onQuestionMarkClickHandler.bind(this);
  // options.eventTableButtonClick = this.onTableButtonClickHandler.bind(this);
  options.eventCellClick = this.onExamCellClickHandler.bind(this);

  // this.clExamResultTable = new mtmListTableStatisticsCourseTruth(options);
  this.clExamResultTable = new mtmPlayerExamResultTable(options);
  parent.appendChild(this.clExamResultTable.elThis);
  this.clExamResultTable.show(false);
};

mtmPlayerExam.prototype._createGradeButton = function (parent) {
  // Todo. Button 포커스에 따른 부작용 처리
  this.elGradingButton = document.createElement("button");
  this.elGradingButton.classList.add(
    "mtm-input-button",
    "mtm-input-button-fixed",
    "mtm-input-button-theme",
    "mtm-input-button-hover-theme",
    "px-4",
  );
  this.elGradingButton.setAttribute(
    "style",
    "z-index: 10;position: fixed; bottom: 20px; right: 40px; font-weight:600;",
  );
  this.elGradingButton.setAttribute("type", "button");
  this.elGradingButton.setAttribute("tabindex", "-1");
  this.elGradingButton.innerHTML = '<i class="fa-solid fa-check"></i> 채점';
  this.elGradingButton.addEventListener("click", this.onGradingHandler.bind(this));
  this.elGradingButton.style.display = "none";

  parent.appendChild(this.elGradingButton);
};

mtmPlayerExam.prototype._init = function () {
  this.player.testIndicator = [];
  this.player.testCard = [];

  // this._initTest();

  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);
  this.elThis.classList.add("col-12", "mtm-player-testum");

  this._createTestumTitle(this.elThis);
  this._createTestumProgress(this.elThis);
  this._createTestumSubmitAction(this.elThis);
  this._createTestumIndicator(this.elThis);
  this._createTestumViewer(this.elThis);

  this._createTestumResultAction(this.elThis);
  this._createTestumResultTable(this.elThis);
  this._createExamResultTable(this.elThis);

  this._createGradeButton(this.elThis);

  // Fixed. Jstar : Testum 문제 동영상 해설보기
  // this.clStudyPlayerVideo = null;
  this.clPlayerVideoContent = null;

  mtoEvents.on("OnOnePanel", this.onOnePanelHandler.bind(this));
  mtoEvents.on("OnTwoPanel", this.onTwoPanelHandler.bind(this));
};

// 1) setTestumData : 테스텀 콘텐츠와 결과를 설정한다.
// 2) Testum Result 가 존재하면, TestumResult(결과)를 보여준다.
// 3) Testum Result 가 존재하지 않으면, TestumViewer 를 보여준다.
mtmPlayerExam.prototype._showPlayer = function (bShow) {
  if (this.clTestumNavi) this.clTestumNavi.show(true);
  this.clTestumIndicator.show(true);

  this.clTestumSubmitAction.show(true);

  if (!this.bGradingResult) {
    this.clTestumSubmitAction.showCorrectWrong(false);
    this.clTestumSubmitAction.showNextStep(false);
    this.clTestumSubmitAction.showTotalResult(false);

    // this.clTestumSubmitAction.timerReset();
    // this.clTestumSubmitAction.timerStart();

    // Fixed. Jstar : Timer
    // this.clPlayerTestumViewer.timerReset();
    // this.clPlayerTestumViewer.timerStart();
  }

  this.clPlayerTestumViewer.show(true);

  // if(this.playMode == 2) // exam mode
  if (this.playOptions.content_type == mtoContentFormat.EXAM) {
  } else {
    // Todo. Jstar : Grading Button
    this.elGradingButton.style.display = "";

    if (this.bShowResult) this.elGradingButton.style.display = "none";
    else this.elGradingButton.style.display = "block";

    this.clTestumResultAction.show(false);
    this.clTestumResultTable.show(false);
  }
};

mtmPlayerExam.prototype._showResult = function () {
  if (this.clTestumNavi) this.clTestumNavi.show(false);
  this.clTestumIndicator.show(false);

  this.clTestumSubmitAction.show(false);
  this.clPlayerTestumViewer.show(false);

  this.elGradingButton.style.display = "none";

  this.clTestumResultAction.show(true);
  this.clTestumResultAction.showCorrectWrong(false);
  this.clTestumResultAction.showNextStep(false);

  if (this.bCorrectWrong) this.clTestumResultAction.showCorrectWrong(true);
  else this.clTestumResultAction.showNextStep(true);

  this.clTestumResultTable.show(true);
  this.elGradingButton.style.display = "none";
};

mtmPlayerExam.prototype._checkTestumOneGradeNew = function (eData) {
  console.log("mtmPlayerExam > _checkTestumOneGradeNew : ", eData);

  if (eData.correct) {
    this.player.testum_result_new[this.player.currentUnitIndex].result[eData.itemIndex] = "O";
    this.player.testum_result_new[this.player.currentUnitIndex].second[eData.itemIndex] = "O";
    this.player.testum_result_new[this.player.currentUnitIndex].repeat[eData.itemIndex]++;
  } else {
    this.player.testum_result_new[this.player.currentUnitIndex].result[eData.itemIndex] = "X";
    this.player.testum_result_new[this.player.currentUnitIndex].second[eData.itemIndex] = "X";
    this.player.testum_result_new[this.player.currentUnitIndex].repeat[eData.itemIndex]++;
  }
  this._checkProgressPoint();
};

// // 채점한다. - 현재 사용 안함.
// mtmPlayerExam.prototype._checkGrade = function()
// {
//     if(this.playMode == 2)  // Exam Mode
//         this._checkExamGrade();
//     else
//         this._checkTestumGrade();
// }

mtmPlayerExam.prototype._checkProgressPoint = function () {
  this.player.total_item_num = 0;
  this.player.study_item_num = 0;
  this.player.total_question_num = 0;
  this.player.correct_question_num = 0;
  this.player.progress = 0;
  this.player.point = 0;

  for (var i = 0; i < this.player.testum_unit_new.length; i++) {
    this.player.total_item_num += this.player.testum_unit_new[i].types.length;
    for (var j = 0; j < this.player.testum_unit_new[i].types.length; j++) {
      if (this.player.testum_unit_new[i].types[j] == "q") this.player.total_question_num++;
    }

    for (var j = 0; j < this.player.testum_result_new[i].result.length; j++) {
      this.player.study_item_num++;
      if (this.player.testum_unit_new[i].types[j] == "q" && this.player.testum_result_new[i].result[j] == "O")
        this.player.correct_question_num++;
    }
  }

  if (this.player.total_item_num > 0)
    this.player.progress = parseInt((this.player.study_item_num * 100) / this.player.total_item_num);
  if (this.player.total_question_num > 0)
    this.player.point = parseInt((this.player.correct_question_num * 100) / this.player.total_question_num);

  console.log(
    "mtmPlayerExam > _checkProgressPoint : total_item_num = ",
    this.player.total_item_num,
    ", study_item_num =  ",
    this.player.study_item_num,
    ", total_question_num = ",
    this.player.total_question_num,
    ", correct_question_num = ",
    this.player.correct_question_num,
    ", progress = ",
    this.player.progress,
    ", point = ",
    this.player.point,
  );
};

mtmPlayerExam.prototype._checkTestumGradeNew = function () {
  // console.log('mtmPlayerExam > _checkTestumGrade : ',this.player.questionCard,,this.player.currentResult);
  var results = this.player.testum_result_new;
  var units = this.player.testum_unit_new;
  var unitIndex = this.player.currentUnitIndex;

  if (units.length <= 0) return;

  // 결과가 없으면, 초기(empty) 결과 준비
  if (results.length <= unitIndex) {
    // 결과가 없으면
    var data = { repeat: [], result: [], first: [], second: [] };
    for (var i = 0; i < units[unitIndex].types.length; i++) {
      data.repeat.push(0);
      data.result.push("");
      // data.first.push('');
      // data.second.push('');
    }
    results.push(data);
  }

  for (var i = 0; i < this.player.questionCard.length; i++) {
    // i 와 index 의 차이
    // i 는 보이는 순서이고,
    // index 는 unit 에서의 순서이다.
    var index = this.player.questionCard[i].no - 1;
    var answer = this.player.questionCard[i].answer;
    var value = this.clPlayerTestumViewer.getAnswer(i);

    if (answer == value) {
      // 이미 맞았나?
      if (results[unitIndex].result[index] != "O") {
        results[unitIndex].result[index] = "O";
        results[unitIndex].repeat[index]++;
      }
    } else {
      value.trim();
      // 답을 안했냐?
      if (!value) {
        if (results[unitIndex].result[index] != "?") results[unitIndex].result[index] = "?";
      } else {
        if (results[unitIndex].result[index] != "X") {
          results[unitIndex].result[index] = "X";
          results[unitIndex].repeat[index]++;
        }
      }
    }
  }

  // 여기에 first second 조율
  if (results[unitIndex].first.length <= 0) {
    // first 채움
    for (var i = 0; i < results[unitIndex].result.length; i++) {
      results[unitIndex].first.push(results[unitIndex].result[i]);
      if (results[unitIndex].result[i] == "X") results[unitIndex].second.push("?");
      else results[unitIndex].second.push("");
    }
  }
  // else if(results[unitIndex].second.length <= 0)
  else {
    for (var i = 0; i < results[unitIndex].result.length; i++) {
      if (results[unitIndex].first[i] == "X") {
        // if(results[unitIndex].second[i] == '?')
        results[unitIndex].second[i] = results[unitIndex].result[i];
        results[unitIndex].repeat[i]++;
        // else if(results[unitIndex].second[i] == '')
        //     results[unitIndex].second[i] = '?';
        // else
        //     results[unitIndex].second[i] = results[unitIndex].result[i];
      } else if (results[unitIndex].first[i] == "?") {
        if (results[unitIndex].result[i] == "X") {
          results[unitIndex].first[i] = "X";
          results[unitIndex].second[i] = "?";
          results[unitIndex].repeat[i]++;
        } else if (results[unitIndex].result[i] == "O") {
          results[unitIndex].first[i] = "O";
          results[unitIndex].repeat[i]++;
        }
      }
    }
  }

  console.log("mtmPlayerExam > _checkTestumGradeNew : ", this.player.testum_result_new);

  this._checkProgressPoint();
};

mtmPlayerExam.prototype._checkExamAnswerState = function () {
  var question_num = this.player.questionCard.length;
  var answer_num = 0;
  for (var i = 0; i < this.player.questionCard.length; i++) {
    // var index = this.player.questionCard[i].no - 1;
    // var answer = this.player.questionCard[i].answer;
    var value = this.clPlayerTestumViewer.getAnswer(i);
    if (value != "") answer_num++;
  }

  // var retval = {};
  this.exam_state = {};
  this.exam_state.question_num = question_num;
  this.exam_state.answer_num = answer_num;
  // return retval;
};

mtmPlayerExam.prototype._checkExamGrade = function () {
  // console.log('_checkExamGrade : ',this.player.questionCard);
  // console.log('_checkExamGrade : ',this.player.currentResult);
  this.examAnswers = [];
  this.examPoint = 0;
  for (var i = 0; i < this.player.questionCard.length; i++) {
    var index = this.player.questionCard[i].no - 1;
    var answer = this.player.questionCard[i].answer;
    var value = this.clPlayerTestumViewer.getAnswer(i);
    var point = this.clPlayerTestumViewer.getPoint(i);

    this.examAnswers.push(value);

    if (answer == value) {
      this.player.currentResult[index] = "O";
      this.player.current_qr_list[index] = "O";
      this.player.current_rc_list[index]++;
      this.examPoint += point;
    } else {
      value.trim();
      // 답을 안했냐?
      if (!value) {
        this.player.currentResult[index] = "?";
        this.player.current_qr_list[index] = "?";
      } else {
        this.player.currentResult[index] = "X";
        this.player.current_qr_list[index] = "X";
        this.player.current_rc_list[index]++;
      }
    }
  }
};

mtmPlayerExam.prototype._prepareTestumQuestion = function (index, list) {
  this.player.questionCard = [];
  this.player.questionIndicator = [];
  var bFirstIndicator = true;
  var indicatorIndex = 0;
  index = parseInt(index / 2);
  // 모든 문제를 보여라... 즉 처음 문제를 풀때,....
  // 이를 좀 더 Nice 하게 운용하는 방법이 없을까?
  // if(bAll)
  // {
  //     list = [];
  //     for(var i=0;i<this.player.testum_list[index].length;i++)
  //     {
  //         list.push(1);
  //     }
  // }

  // list 값의 의미 : 0 == 문제 제외, 1 == 일괄제출 문제.
  //                  2 == 한 문제씩 제출 가능, 4 == 풀이 보기 가능
  //                  8 == 정답 문제 보기
  this.player.first_index = 0;
  // var push_index = 0;
  console.log("mtmPlayerExam > _prepareTestumQuestion : ", this.player.testum_list[index]);
  for (var i = 0; i < this.player.testum_list[index].length; i++) {
    if (i == this.player.testum_start_index) this.player.first_index = indicatorIndex;
    if (list[i] > 0) {
      // var q_item = this.player.testum_unit[i].content_list[index];
      var q_item = this.player.testum_list[index][i];
      var rc = parseInt(this.player.current_rc_list[i]);
      // console.log('mtmPlayerExam > _prepareTestumQuestion :',this.player.current_rc_list );
      this.player.questionCard.push({
        no: i + 1,
        rc: rc,
        content: q_item.content,
        id: q_item.id,
        style: q_item.style,
        level: q_item.level,
        answer: q_item.answer,
        tag: q_item.tag,
        solution_id: q_item.solution_id,
        video_id: q_item.video_id,
        // multi video solution
        solution_video: q_item.solution_video,
        // 'url':video_solution.url,
        // 'title':video_solution.title,
        // 'time':video_solution.time,
        // multi text solution
        solution_text: q_item.solution_text,
        // 'content' : solution_text.content,
        //
        display_option: list[i],
      });

      this.player.questionIndicator.push({
        index: i + 1,
        active: bFirstIndicator,
        id: indicatorIndex + 1,
      });
      bFirstIndicator = false;
      indicatorIndex++;
    }
  }

  this.clTestumIndicator.setIndicatorContent(this.player.questionIndicator);
  // console.log('mtmPlayerExam > _prepareTestumQuestions : ',this.player.questionCard);
  this.clPlayerTestumViewer.setTestumContent(this.player.questionCard);

  this.bShowResult = false;
  this.bGradingResult = false;
  this._showPlayer();
  this.clTestumIndicator.setIndex(this.player.first_index);
  this.clPlayerTestumViewer.setQuestionIndex(this.player.first_index);
};

// 본,쌍,세쌍의 상태에 따라서 오답 하기의 결과를 산출한다.
mtmPlayerExam.prototype._calcWrongAnswerTable = function () {
  //
  var complete_list = [];
  var valid = false;
  for (var index = 0; index <= this.player.testum_twin_num; index++) {
    complete_list[index] = true;
    valid = false;
    for (var j = 0; j < this.dbResultFinalTable.length; j++) {
      // 본문제가 틀리고, 오답하기를 안했으면, 오답하기 가능 '?' 로 한다.
      if (this.dbResultFinalTable[j][index * 2] == "X" && this.dbResultFinalTable[j][index * 2 + 1] == "-") {
        this.dbResultFinalTable[j][index * 2 + 1] = "?";
      }

      if (this.dbResultFinalTable[j][index * 2] == "?" || this.dbResultFinalTable[j][index * 2 + 1] == "?")
        complete_list[index] = false;

      if (this.dbResultFinalTable[j][index * 2] != "-" || this.dbResultFinalTable[j][index * 2 + 1] != "-")
        valid = true;
    }

    if (valid && complete_list[index] && index < this.player.testum_twin_num) {
      var next_index = true;

      for (var j = 0; j < this.dbResultFinalTable.length; j++) {
        if (this.dbResultFinalTable[j][(index + 1) * 2] != "-") {
          next_index = false;
        }
      }

      if (next_index) {
        for (var j = 0; j < this.dbResultFinalTable.length; j++) {
          this.dbResultFinalTable[j][(index + 1) * 2] = "?";
        }
      }
    }
    // if(index >=0 )
  }
};

mtmPlayerExam.prototype._setExamResultTable = function (index) {
  // Exam Mode
  if (this.dbResultFinalTable.length <= 0) return;
  if (this.dbResultFinalTable[0].length <= index) return;

  for (var j = 0; j < this.dbResultFinalTable.length; j++) {
    this.dbResultFinalTable[j][index] = this.player.currentResult[j];
  }

  this._calcWrongAnswerTable();
  // 정답 문제 갯수
  this.total_correct_question_num = 0;

  for (var i = 0; i <= this.player.testum_twin_num; i++) {
    var wrong_num = 0;
    var try_status = false;
    for (var j = 0; j < this.dbResultFinalTable.length; j++) {
      var first = this.dbResultFinalTable[j][i * 2];
      var second = this.dbResultFinalTable[j][i * 2 + 1];
      if (first == "O" || second == "O") {
        this.total_correct_question_num++;
        try_status = true;
      }

      if (first == "O" || first == "X") {
        if (first != "O") wrong_num++;
        if (this.player.total_progress_num < i * 2 + 1) this.player.total_progress_num = i * 2 + 1;

        try_status = true;
      }

      if (second == "O" || second == "X") {
        if (this.player.total_progress_num < i * 2 + 2) this.player.total_progress_num = i * 2 + 2;
        try_status = true;
      }
    }

    // 오답이 없이 다 맞았으면...
    if (try_status && wrong_num == 0) {
      if (this.player.total_progress_num < i * 2 + 2) this.player.total_progress_num = i * 2 + 2;
    }
  }

  // this.clExamResultTable.setResultTable(this.dbResultFinalTable);
  console.log("mtmPlayerExam > _setExamResultTable : ", this.dbResultFinalTable);
};

mtmPlayerExam.prototype._prepareExamData = function (eData) {
  // 테스텀의 contentunit_list, contentresult_list,
  // 실제 content 와 result 를 설정
  this.player.testum_unit = eData.contentunit_list;
  this.player.testum_result = eData.contentresult_list;

  // 가로/세로형
  this.player.testum_horizontal = eData.horizontal;
  if (!this.player.testum_horizontal) this.player.testum_horizontal = false;
  // 쌍둥이 형
  this.player.testum_twin = eData.twin;
  if (!this.player.testum_twin) {
    this.player.testum_twin = false;
    this.player.testum_twin_num = 0;
  } else {
    // 쌍둥이 갯수
    this.player.testum_twin_num = eData.twin_num;
    if (!this.player.testum_twin_num) this.player.testum_twin_num = 0;
    // 숫자를 mtmPlayerExam.MaxTwinNum = 2 이하로 제한
    if (this.player.testum_twin_num > mtmPlayerExam.MaxTwinNum) this.player.testum_twin_num = mtmPlayerExam.MaxTwinNum;
  }

  this.player.testum_twin = false;
  this.player.testum_twin_num = 0;
  // 전체 콘텐츠 수
  this.player.total_content_num = (this.player.testum_twin_num + 1) * 2;
  this.player.total_progress_num = 0;
  this.currentTryIndex = 0;
};

mtmPlayerExam.prototype._prepareTestumDataNew = function (eData) {
  // 테스텀의 contentunit_list, contentresult_list,
  // 실제 content 와 result 를 설정
  this.player.testum_unit_new = eData.units;
  this.player.testum_content_new = eData.content_list;
  this.player.testum_result_new = eData.results;

  this.player.total_content_num = 0;
  this.player.total_progress_num = 0;
  this.player.finalIndexTotal = 0;
  this.player.finalUnitIndex = 0;
  this.player.currentIndexTotal = 0;
  this.player.currentUnitIndex = 0;

  this.player.progressIndicator = [];
  this.player.progressIndex = 0;
  this.player.progressSliderIndicator = [];
  this.player.progressSliderIndex = 0;
};

mtmPlayerExam.prototype._prepareDataNew = function (eData) {
  if (this.playMode == 2)
    // exam mode
    this._prepareExamData(eData);
  else this._prepareTestumDataNew(eData);
};

mtmPlayerExam.prototype._prepareTestumProgress = function () {
  // console.log('mtmPlayerExam > _prepareTestumProgress > progressIndicator : ', this.player.progressIndicator);
  // console.log('mtmPlayerExam > _prepareTestumProgress > progressIndex: ', this.player.progressIndex);
  this.clPlayerTestumProgress.setProgressContent(this.player.progressSliderIndicator, 2);
  this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
};

mtmPlayerExam.prototype._updateTestumProgress = function () {
  if (this.player.progressSliderIndex < this.player.currentProcessIndex)
    this.player.progressSliderIndex = this.player.currentProcessIndex;

  this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
};

mtmPlayerExam.prototype._prepareResultFinalNew = function () {
  // 최종 결과 리스트
  this.player.finalProcessIndex = 0;

  this.player.finalInitIndex = 0;
  // 이것은 testum 에서는 중요하지 않음.
  this.player.finalItemIndex = 0;

  if (this.player.testum_result_new.length == 0) this.player.finalProcessIndex = -1;
};

mtmPlayerExam.prototype._prepareExamResultTable = function () {
  // prepare Testum Result Table & Final Process
  this.player.finalProcessIndex = -1;
  for (var i = 0; i < (this.player.testum_twin_num + 1) * 2; i++) {
    var qr_list = this.dbTestumResult.qr_list[i];
    if (qr_list) {
      // 해당 qr_list 존재하면...
      for (var j = 0; j < this.dbResultFinalTable.length; j++) {
        // 가로를 세로로...
        if (qr_list[j] == "O" || qr_list[j] == "X" || qr_list[j] == "?") this.player.finalProcessIndex = i;

        this.dbResultFinalTable[j][i] = qr_list[j];
      }
    }
  }
  // 현재 어디 까지가 마지막으로 한 것이냐?
  this.activeField = this.player.finalProcessIndex;
  // 테스텀 결과 테이블을 만들고 셋팅
  this.clTestumResultTable.activeField = this.activeField;
  // console.log('mtmPlayerExam > _prepareTestumResultTable :',this.dbResultFinalTable);
  this._calcWrongAnswerTable();
  this.clExamResultTable.setResultTable(this.dbResultFinalTable);
};

mtmPlayerExam.prototype._prepareTestumResultTableNew = function () {
  this.clTestumResultTable.setTestumResultList(this.player.testum_unit_new, this.player.testum_result_new);
};

mtmPlayerExam.prototype._prepareResultTable = function () {
  if (this.playMode == 2)
    // Exam Mode
    this._prepareExamResultTable();
  else this._prepareTestumResultTable();
};

mtmPlayerExam.prototype._prepareResultNew = function () {
  if (this.playMode == 2)
    // Exam Mode
    this._prepareExamResultTable();
  else this._prepareTestumResultTableNew();
};

mtmPlayerExam.prototype._prepareCurrentResult = function (index) {
  this.player.currentResult = [];
  if (this.dbResultFinalTable.length <= 0) return;

  if (this.dbResultFinalTable[0].length <= index) return;

  for (var j = 0; j < this.dbResultFinalTable.length; j++) {
    this.player.currentResult[j] = this.dbResultFinalTable[j][index];
  }

  this.player.current_rc_list = this.dbTestumResult.rc_list[index];
  this.player.current_qr_list = this.dbTestumResult.qr_list[index];
};

mtmPlayerExam.prototype._prepareQuestionList = function (index, bAll, value) {
  // list 값의 의미 : 0 == 문제 제외, 1 == 일괄제출 문제.
  //                  2 == 한 문제씩 제출 가능, 4 == 풀이 보기 가능
  //                  8 == 정답 문제 보기
  // Check
  this.player.testum_start_index = -1;
  this.player.testum_q_list = [];

  this.player.testum_q_index = index; //parseInt(index/2)*2+1;

  // if(index%2 == 0)    // Main, Sub, Last == Not Wrong Correct Action
  // {
  //     this.player.testum_q_index = parseInt(index/2);
  // }
  // else
  // {
  //     this.player.testum_q_index = parseInt(index/2)+1;
  // }

  for (var j = 0; j < this.dbResultFinalTable.length; j++) {
    if (bAll) {
      // 모든 문제
      if (this.player.testum_start_index < 0) this.player.testum_start_index = j;
      this.player.testum_q_list.push(1);
    } // 특정 문제.
    else {
      // value == '?' 안푼 문제
      // value == 'O' 맞은 문제
      if (this.dbResultFinalTable[j][this.player.testum_q_index] == value) {
        // 특정 문제
        if (this.player.testum_start_index < 0) this.player.testum_start_index = j;
        if (value == "?") {
          if (index % 2)
            // 2차로 안한 문제는 개별 제출 가능
            this.player.testum_q_list.push(2);
          // 1차로 안한 문제는 일괄제출
          else this.player.testum_q_list.push(1);
        } else if (value == "O") this.player.testum_q_list.push(8);
        else if (value == "X") this.player.testum_q_list.push(2);
      }
      // else if(this.dbResultFinalTable[j][this.player.testum_q_index] == value)    // 특정 문제
      // {
      //     if(this.player.testum_start_index < 0)
      //         this.player.testum_start_index = j;
      //     this.player.testum_q_list.push(8);
      // }
      else {
        this.player.testum_q_list.push(0);
      }
    }
  }

  // else // 오답하기...
  // {
  //     this.player.testum_q_list = [];
  //     this.player.testum_q_index = parseInt(index/2) + 1;
  // }

  if (this.player.testum_start_index < 0) this.player.testum_start_index = 0;
};

mtmPlayerExam.prototype._beforePlayTestumContentNew = function (pData) {
  // index,bAll,value
  // list 값의 의미 : 0 == 문제 제외, 1 == 일괄제출 문제.
  //                  2 == 한 문제씩 제출 가능, 4 == 풀이 보기 가능
  //                  8 == 정답 문제 보기
  // Check
  this.player.testum_q_index = pData.index;
  this.player.testum_q_list = [];
  this.player.testum_start_index = -1;
  var unitIdx = parseInt(this.player.testum_q_index / 2);
  var value_list = [];

  if (pData.index % 2) {
    // 2 차 문제
    if (this.player.testum_result_new.length > unitIdx) value_list = this.player.testum_result_new[unitIdx].second;
  } else {
    if (this.player.testum_result_new.length > unitIdx) value_list = this.player.testum_result_new[unitIdx].first;
  }

  console.log(
    "mtmPlayerExam > _beforePlayTestumContentNew : ",
    this.player.testum_unit_new[unitIdx].types,
    this.player.testum_result_new[unitIdx],
    pData,
  );

  for (var j = 0; j < this.player.testum_unit_new[unitIdx].types.length; j++) {
    if (pData.bAll) {
      // 모든 문제
      if (this.player.testum_start_index < 0) this.player.testum_start_index = j;
      if (pData.value == "?") this.player.testum_q_list.push(8);
      else this.player.testum_q_list.push(1);
    } // 특정 문제.
    else {
      // value == '?' 안푼 문제
      // value == 'O' 맞은 문제
      if (value_list.length > j) {
        if (pData.index % 2) {
          // 오답 하기
          if (pData.value == "?" || pData.value == "X") {
            if (this.player.testum_start_index < 0) this.player.testum_start_index = j;

            if (value_list[j] == "?") this.player.testum_q_list.push(2); // 개별 제출 가능
            else if (value_list[j] == "X") this.player.testum_q_list.push(2); // 개별 제출 가능
            else this.player.testum_q_list.push(0); // 문제 제외
          } else if (pData.value == "O") {
            if (value_list[j] == "O") this.player.testum_q_list.push(8);
            else this.player.testum_q_list.push(0);
          }
        } // 처음 하기
        else {
          // if(value_list[j] == pData.value)
          if (pData.value == "?") {
            if (value_list[j] == pData.value) {
              if (this.player.testum_start_index < 0) this.player.testum_start_index = j;

              // 제출하기
              this.player.testum_q_list.push(1);
            } else this.player.testum_q_list.push(0); // 안 보이기
          } else if (pData.value == "O") {
            if (value_list[j] == pData.value) {
              if (this.player.testum_start_index < 0) this.player.testum_start_index = j;

              // 제출하기
              this.player.testum_q_list.push(8);
            }
            // 안 보이기
            else this.player.testum_q_list.push(0);
          }
        }
      }
    }
  }

  console.log("mtmPlayerExam > _beforePlayTestumContentNew : ", this.player.testum_q_list);

  // Be Sure
  if (this.player.testum_start_index == -1) this.player.testum_start_index = 0;
};

// Testum Result 는 반드시 Unit 하나당 2개 가 필요
// 하나는 초벌, 하나는 오답하기....
mtmPlayerExam.prototype._playTestumContentNew = function (pData) {
  // index,bAll,value
  console.log(
    "mtmPlayerExam > _playTestumContentNew : ",
    this.player.testum_unit_new,
    this.player.testum_result_new,
    this.player.testum_content_new,
  );
  // 2,1,5,3,3
  this._beforePlayTestumContentNew(pData);

  this.player.questionCard = [];
  this.player.questionIndicator = [];
  var bFirstIndicator = true;
  var indicatorIndex = 0;
  // list 값의 의미 : 0 == 문제 제외, 1 == 일괄제출 문제.
  //                  2 == 한 문제씩 제출 가능, 4 == 풀이 보기 가능
  //                  8 == 정답 문제 보기
  this.player.first_index = 0;

  var unitIdx = this.player.currentUnitIndex;

  // var unitIndex = parseInt(pData.index/2);
  for (var i = 0; i < this.player.testum_content_new[unitIdx].length; i++) {
    if (i == this.player.testum_start_index) this.player.first_index = indicatorIndex;
    if (this.player.testum_q_list[i] > 0) {
      // var q_item = this.player.testum_unit[i].content_list[index];
      var q_item = this.player.testum_content_new[unitIdx][i];
      var rc = 0;
      if (this.player.testum_result_new.length > unitIdx)
        rc = parseInt(this.player.testum_result_new[unitIdx].repeat[i]);
      // console.log('mtmPlayerExam > _prepareTestumQuestion :',this.player.current_rc_list );
      this.player.questionCard.push({
        no: i + 1,
        rc: rc,
        content: q_item.content,
        id: q_item.id,
        style: q_item.style,
        level: q_item.level,
        answer: q_item.answer,
        tag: q_item.tag,
        solution_id: q_item.solution_id,
        video_id: q_item.video_id,
        // multi video solution
        solution_video: q_item.solution_video,
        // 'url':video_solution.url,
        // 'title':video_solution.title,
        // 'time':video_solution.time,
        // multi text solution
        solution_text: q_item.solution_text,
        // 'content' : solution_text.content,
        //
        display_option: this.player.testum_q_list[i],
      });

      this.player.questionIndicator.push({
        index: i + 1,
        active: bFirstIndicator,
        id: indicatorIndex + 1,
      });
      bFirstIndicator = false;
      indicatorIndex++;
    }
  }

  this.clTestumIndicator.setIndicatorContent(this.player.questionIndicator);
  this.clPlayerTestumViewer.setTestumContent(this.player.questionCard);

  this.bShowResult = false;
  this.bGradingResult = false;
  this._showPlayer();
  this.clTestumIndicator.setIndex(this.player.first_index);
  this.clPlayerTestumViewer.setQuestionIndex(this.player.first_index);
  this.clTestumResultTable.show(false);
};

mtmPlayerExam.prototype._decideExamProcessStatus = function () {
  // 평가를 시작해 놓고 제출하지 않으면,
  // 되는 문제....
  if (this.examStartTime != 0) this.player.finalProcessIndex = 0;

  // 시작을 안했다.
  if (this.player.finalProcessIndex == -1 && this.options.modeStudent) {
    // student mode
    // 테스트를 처음하는 것...
    this.player.currentProcessIndex = 0;
    // console.log('mtmPlayerExam > _decideProcessStatus : ', this.player.finalProcessIndex );

    this._prepareCurrentResult(this.player.currentProcessIndex);
    // Testum Progress 는 보여준다.
    this._prepareTestumProgress();

    // Testum Questions 준비한다.
    this._prepareQuestionList(this.player.currentProcessIndex, true, "");
    // this.player.testum_start_index = 0;
    this._prepareTestumQuestion(this.player.testum_q_index, this.player.testum_q_list);

    console.log("mtmPlayerExam > _decideExamProcessStatus : this.examStartTime == 0");

    // if(this.examStartTime == 0)
    // {
    //     // 당연히
    //     // 여기서는 어제/오늘/내일 을 처리해야 한다.
    //     // if()
    //     this.clPlayerTestumViewer.initExamInformation(this.examProp);
    // }
    // else
    {
      this.clPlayerTestumViewer.initExamInformation(this.examStartTime, this.examProp);
    }
  } else {
    console.log("mtmPlayerExam > _decideExamProcessStatus : this.examStartTime != 0");

    var durations = this.examProp.examtime.split(":");
    var time = parseInt(durations[0]) * 60 * 60 + parseInt(durations[1]) * 60;
    var end_time = this.examStartTime + time;

    var now = new Date();
    var curr_time = parseInt(now.getTime() / 1000);

    // 아직 평가 시간이 남아 있다.
    if (end_time > curr_time) {
      // this._timeNotEnd(end_time);
      // 테스트를 처음하는 것...
      this.player.currentProcessIndex = 0;
      // console.log('mtmPlayerExam > _decideProcessStatus : ', this.player.finalProcessIndex );

      this._prepareCurrentResult(this.player.currentProcessIndex);
      // Testum Progress 는 보여준다.
      this._prepareTestumProgress();

      // Testum Questions 준비한다.
      this._prepareQuestionList(this.player.currentProcessIndex, true, "");
      // this.player.testum_start_index = 0;
      this._prepareTestumQuestion(this.player.testum_q_index, this.player.testum_q_list);
      this.clTestumResultTable.show(false);
      this.clExamResultTable.show(false);
      this.clPlayerTestumViewer.initExamInformation(this.examStartTime, this.examProp);
      return;
    }

    // 평가 시작 이후 평가 시간이 지났다.
    // Testum Player 는 감춘다.
    this.clTestumIndicator.show(false);
    if (this.options.modeStudent)
      // student mode
      this.clTestumSubmitAction.show(false);
    this.clPlayerTestumViewer.show(false);

    // Testum Progress 는 보여준다.
    this._prepareTestumProgress();
    // 표를 보여준다.
    // 여기서 무엇을 해야 하나를 선택할 수 있게 한다.
    if (this.playMode == 2) {
      this.clTestumResultTable.show(false);
      this.clExamResultTable.show(true);
    }
    // else
    // {
    //     this.clTestumResultTable.show(true);
    //     this.clExamResultTable.show(false);
    // }

    this.elGradingButton.style.display = "none";
  }
};

mtmPlayerExam.prototype._decideTestumProcessStatus = function () {
  //
  console.log("mtmPlayerExam > _decideTestumProcessStatus");
  // 가장 최근에 한 작업
  if (this.player.finalProcessIndex == -1 && this.options.modeStudent) {
    // student mode
    // 테스트를 처음하는 것...
    this.player.currentProcessIndex = 0;
    // console.log('mtmPlayerExam > _decideProcessStatus : ', this.player.finalProcessIndex );

    // this._prepareCurrentResult(this.player.currentProcessIndex);
    // Testum Progress 는 보여준다.
    // this._prepareTestumProgress();

    // Testum Questions 준비한다.
    // this._prepareQuestionList(this.player.currentProcessIndex,true,'');
    // this.player.testum_start_index = 0;
    // this._prepareTestumQuestion(this.player.testum_q_index,this.player.testum_q_list);
    var aData = { index: 0, bAll: true, value: "" };
    this._playTestumContentNew(aData);
  } else {
    // console.log('mtmPlayerExam > _decideProcessStatus : ', this.player.finalProcessIndex );

    // Testum Player 는 감춘다.
    this.clTestumIndicator.show(false);
    if (this.options.modeStudent)
      // student mode
      this.clTestumSubmitAction.show(false);
    this.clPlayerTestumViewer.show(false);

    // Testum Progress 는 보여준다.
    // this._prepareTestumProgress();
    // 표를 보여준다.
    // 여기서 무엇을 해야 하나를 선택할 수 있게 한다.
    // if(this.playMode == 2)
    // {
    //     this.clTestumResultTable.show(false);
    //     this.clExamResultTable.show(true);
    // }
    // else
    {
      this.clTestumResultTable.show(true);
      this.clExamResultTable.show(false);
    }

    this.elGradingButton.style.display = "none";
  }
};

mtmPlayerExam.prototype._prepareTitleNew = function (title) {
  this.clTestumTitle.setTitle(title);
};

mtmPlayerExam.prototype._prepareTestumProgressNew = function () {
  for (var i = 0; i < this.player.testum_unit_new.length; i++) {
    this.player.progressSliderIndicator.push(i * 2);
    this.player.progressSliderIndicator.push(i * 2 + 1);
  }
  console.log("mtmPlayerExam. > ._prepareTestumProgressNew : ", this.player.progressSliderIndicator);

  this.clPlayerTestumProgress.setProgressContent(this.player.progressSliderIndicator, 2);
  this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
};

mtmPlayerExam.prototype._prepareTestumPlayerNew = function (eData) {
  this.player.finalProcessIndex = -1;
  // prepare Data
  this._prepareDataNew(eData);

  // for test
  // eData.twin = true;
  // eData.twin_num = 2;

  // prepare Title
  this._prepareTitleNew(eData.title);

  // prepare Result
  this._prepareResultFinalNew();
  this._prepareResultNew();

  // prepare Progress
  this._prepareTestumProgressNew();
};

mtmPlayerExam.prototype._createPlayerVideo = function (eData) {
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  var options = {};
  // options.eventVideoHandler = this.onVideoCompleted.bind(this);
  console.log("mtmPlayerExam > _createPlayerVideo :", eData);
  options.eventVideoHandler = this.onVideoCompleted.bind(this);
  this.clPlayerVideoContent = new mtmPlayerVideoContent(options);

  // this.elThis.appendChild(this.clStudyPlayerVideo.elThis);
  this.elThis.appendChild(this.clPlayerVideoContent.elThis);
};

mtmPlayerExam.prototype._playNewQuestion = function (index, tY, value) {};

mtmPlayerExam.prototype._showExamConfirm = function (nQuestion, nAnswer) {
  var options = {};
  options.title = "평가 제출";
  options.text = nQuestion + " 문제 / " + nAnswer + " 정답을 제출하시겠습니까?";
  options.icon = "info";
  options.closeOnClickOutside = true;

  options.buttons = ["취소", "제출"];
  options.callback = {};
  options.callback.cancel = this.onExamCancelHandler.bind(this);
  options.callback.confirm = this.onExamConfirmHandler.bind(this);
  this.examSubmitConfirm = true;
  mtoConfirmPopup.show(options);
};

mtmPlayerExam.prototype._showExamSubmit = function (nQuestion, nAnswer) {
  var options = {};
  options.text = nQuestion + " 문제 / " + nAnswer + " 정답을 제출하였습니다";
  options.icon = "success";
  options.closeOnClickOutside = true;
  // options.title = "평가 시간 만료";
  // options.text = nQuestion + " 문제 / " + nAnswer + " 정답을 제출해야 합니다.";
  // options.icon = "info";
  // options.closeOnClickOutside = true;
  options.callback = {};
  // 상관없이 onExamSubmitHandler 호출
  options.callback.confirm = this.onExamSubmitHandler.bind(this);
  options.callback.cancel = this.onExamSubmitHandler.bind(this);
  options.button = "확인";

  mtoConfirmPopup.show(options);
};

mtmPlayerExam.prototype._showExamTimeOut = function (nQuestion, nAnswer) {
  var options = {};
  // options.title = "제출 완료";
  options.title = "평가 시간 만료";
  options.text = nQuestion + " 문제 / " + nAnswer + " 정답을 제출해야 합니다.";
  options.icon = "info";
  options.closeOnClickOutside = true;

  // options.text = nQuestion + " 문제 / " + nAnswer + " 정답을 제출하였습니다";
  // options.icon = "success";
  // options.closeOnClickOutside = true;
  options.callback = {};
  // 상관없이 onExamSubmitHandler 호출
  options.callback.confirm = this.onExamSubmitHandler.bind(this);
  options.callback.cancel = this.onExamSubmitHandler.bind(this);
  options.button = "확인";

  mtoConfirmPopup.show(options);
};

mtmPlayerExam.prototype._updateTestumResult = function (bGrade, eData) {
  // 채점
  if (bGrade) {
    // this.bFirstGrade - 본 문제
    this._checkTestumGradeNew();
  }
  // 오답하기 에서 하나씩 제출
  else {
    this._checkTestumOneGradeNew(eData);
  }

  // 결과 서버에 전송
  this._urlUpdateTestumResultInfo();
  this.infoResult = this.clTestumResultTable.setTestumResultList(
    this.player.testum_unit_new,
    this.player.testum_result_new,
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler /////////////////////////////////////////
mtmPlayerExam.prototype.onExamSubmitHandler = function () {
  console.log("mtmPlayerExam > onExamSubmitHandler : ");
  this._checkExamGrade();
  this._setExamResultTable(this.player.currentProcessIndex);
  this._urlUpdateExamResult();
};

mtmPlayerExam.prototype.onExamCancelHandler = function () {
  if (this.examTimeOut) {
    this.examTimeOut = false;
    // this.exam_state = this._checkExamAnswerState();
    this._checkExamAnswerState();
    this._showExamTimeOut(this.exam_state.question_num, this.exam_state.answer_num);
  }
};

mtmPlayerExam.prototype.onExamConfirmHandler = function () {
  this._checkExamAnswerState();
  this._showExamSubmit(this.exam_state.question_num, this.exam_state.answer_num);
};

mtmPlayerExam.prototype.onOnePanelHandler = function () {
  console.log("mtmPlayerExam > onOnePanelHandler");
};

mtmPlayerExam.prototype.onTwoPanelHandler = function () {
  console.log("mtmPlayerExam > onTwoPanelHandler");
};

mtmPlayerExam.prototype.onConfirmHandler = function () {
  console.log("mtmPlayerExam > onConfirmHandler : ");

  // 테스텀 문제 번호 -> 숨기기
  this.clTestumIndicator.show(false);
  // 테스텀 시간 경과 -> 숨기기
  this.clTestumSubmitAction.show(false);
  // 테스텀 자체 -> 숨기기
  this.clPlayerTestumViewer.show(false);
  // 테스텀 결과 테이블 -> 보이기
  this.clTestumResultTable.show(true);
  this.elGradingButton.style.display = "none";
};

mtmPlayerExam.prototype.onExitHandler = function () {
  // console.log('mtmPlayerExam : onExitHandler');
  this.stopPreviousContent();
  mtvEvents.emit("OnTestumExit");
  // this._showPlayer();
};

mtmPlayerExam.prototype.onExamTimeOutHandler = function () {
  if (this.examSubmitConfirm) {
    this.examSubmitConfirm = false;
    this.examTimeOut = true;
    return;
  }

  // this.exam_state = this._checkExamAnswerState();
  this._checkExamAnswerState();
  this._showExamTimeOut(this.exam_state.question_num, this.exam_state.answer_num);
};

mtmPlayerExam.prototype.onExamEndHandler = function () {
  mtoEvents.emit("OnChangeExamContent");
};

mtmPlayerExam.prototype.onExamStartHandler = function () {
  if (this.playMode != 2) return;
  // this.elGradingButton.style.display = 'none';
  console.log("mtmPlayerExam >  onExamStartHandler : ", this.player.testum_result);
  this.elGradingButton.style.display = "";
  if (this.player.testum_result.length > 0) {
    var last = this.player.testum_result.length - 1;
    if (this.player.testum_result[last].question_answers) {
      console.log("mtmPlayerExam >  onExamStartHandler : set Answer");

      var answers_result = JSON.parse(this.player.testum_result[last].question_answers);
      for (var i = 0; i < answers_result.answers.length; i++) {
        this.clPlayerTestumViewer.setAnswer(i, answers_result.answers[i]);
      }
    }
  }

  if (this.examStartTime != 0) {
    console.log("mtmPlayerExam.prototype.onExamStartHandler : examStartTime != 0");
    var times = this.examProp.examtime.split(":");
    var time = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60;
    this.clPlayerTestumViewer.setCountDownTimer(time + this.examStartTime);
    this.clPlayerTestumViewer.show(true);
  } else {
    console.log("mtmPlayerExam.prototype.onExamStartHandler : examStartTime == 0");
    var times = this.examProp.examtime.split(":");
    var time = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60;
    var now = new Date();
    this.examStartTime = parseInt(now.getTime() / 1000);
    this.clPlayerTestumViewer.setCountDownTimer(time + this.examStartTime);
    this.clPlayerTestumViewer.show(true);
    //
    // Todo. Jstar : 처음 Exam 을 시작할때...
    // 평가를 시작해 놓고 한번도 제출하지 않은 경우에는 어쩔
    // 처음 Exam 을 하면 해야 하는 것....
    // this.firstExam = true;
    // this._checkExamGrade();
    // this._setExamResultTable(this.player.currentProcessIndex);
    // this._urlUpdateExamResult();
  }
  // this.clPlayerTestumViewer.showElapseTimer(true);
  if (this.options && this.options.eventExamStartHandler) this.options.eventExamStartHandler();
};

// 채점(testum mode)/제출(exam mode)
mtmPlayerExam.prototype.onGradingHandler = function () {
  if (this.playMode == 2) {
    // exam mode
    // Check : 얼마나 답을 했는지 확인 ?
    // this.exam_state = this._checkExamAnswerState();
    this._checkExamAnswerState();
    this._showExamConfirm(this.exam_state.question_num, this.exam_state.answer_num);
    //
  } // normal testum mode
  else {
    // 본/오답 : 전체 제출 - argument : true;
    this._updateTestumResult(true);

    // 테스텀 문제 번호 -> 숨기기
    this.clTestumIndicator.show(false);
    // 테스텀 시간 경과 -> 숨기기
    this.clTestumSubmitAction.show(false);
    // 테스텀 자체 -> 숨기기
    this.clPlayerTestumViewer.show(false);
    // 테스텀 결과 테이블 -> 보이기
    this.clTestumResultTable.show(true);
    this.elGradingButton.style.display = "none";
  }
};

mtmPlayerExam.prototype.onGradingOneHandler = function () {};

//
mtmPlayerExam.prototype.onTableStatusHandler = function () {
  this._showResult();
};

mtmPlayerExam.prototype.onSliderStatusHandler = function () {
  // console.log('mtmPlayerExam : onStatusHandler');
  this.bGradingResult = true;
  this._showPlayer();
};

mtmPlayerExam.prototype.onElapseTimer = function () {
  console.log("mtmPlayerExam > onElapseTimer :");
};

mtmPlayerExam.prototype.onCorrectWrongHandler = function () {
  // console.log('mtmPlayerExam : onCorrectWrongHandler');
  // this.bCorrectWrong = true;
  // this.bShowResult = false;
  // if(this.currentResult.length == 0)
  // {
  //     console.log('mtmPlayerExam : onCorrectWrongHandler -> no currentResult');
  //     return;
  // }
  // this._prepareTestumQuestions();
};

mtmPlayerExam.prototype.onNextStepHandler = function () {
  // console.log('mtmPlayerExam : onNextStepHandler');
  // 본문제(0), 쌍둥이(1), 마지막(2)
  // if(this.currentTryIndex >= 2)
  // {
  //     console.log('mtmPlayerExam : onNextStepHandler -> overflow currentTryIndex');
  //     return;
  // }
  // this.currentTryIndex++;
  // this.bCorrectWrong = false;
  // this.bShowResult = false;
  // this.currentResult = [];
  // this._prepareTestumQuestions();
};
///////////////////// Exam Result Table 과 연동되는 Handler //////////////////
mtmPlayerExam.prototype.onExamCellClickHandler = function (tX, tY, value) {
  console.log("mtmPlayerExam > onExamCellClickHandler : ", tX, tY, value);
  // Todo. Jstar : 나중에 구현
  return;

  {
    this.player.currentProcessIndex = 0;
    this._prepareCurrentResult(this.player.currentProcessIndex);
    this._prepareQuestionList(this.player.currentProcessIndex, true, "X");
    this.player.testum_start_index = tX - 1 + tY * 10;
    this._prepareTestumQuestion(this.player.testum_q_index, this.player.testum_q_list);
  }

  // this._updateTestumProgress();
};
///////////////////// Testum Result Table 과 연동되는 Handler //////////////////
// options.eventQuestionMarkClick = this.onQuestionMarkClickHandler.bind(this);
// options.eventTableButtonClick = this.onTableButtonClickHandler.bind(this);
// options.eventCellClick = this.onCellClickHandler.bind(this);
mtmPlayerExam.prototype.onQuestionMarkClickHandler = function (tX, tY) {};

/////////////////////////////////////////////////////////////////////////
// Button 을 Disable 시킬수 있게 하는 기능을 추가해야 한다.

// 테스텀 결과 Table 의 본 문제하기/오답 하기 버튼을 Click 했을시...
mtmPlayerExam.prototype.onTableButtonClickHandlerNew = function (index) {
  console.log("mtmPlayerExam > onTableButtonClickHandlerNew : ", index);
  this.player.currentProcessIndex = index; // parseInt(index/2);
  // this._prepareCurrentResult(this.player.currentProcessIndex);
  // 새로운 Testum Progress 를 설정한다.
  this._updateTestumProgress();
  // this._prepareQuestionList(this.player.currentProcessIndex,false,'?');
  // this._prepareTestumQuestion(this.player.testum_q_index,this.player.testum_q_list);
  var notyet = 0;
  var correct = 0;
  var unitIndex = parseInt(index / 2);
  for (var i = 0; i < this.player.testum_result_new[unitIndex].result.length; i++) {
    if (index % 2) if (this.player.testum_result_new[unitIndex].second[i] == "?") notyet++;
    if (this.player.testum_result_new[unitIndex].second[i] == "O") correct++;
    else if (this.player.testum_result_new[unitIndex].first[i] == "?") notyet++;
    if (this.player.testum_result_new[unitIndex].first[i] == "O") correct++;
  }

  var value = "?";
  var bAll = false;
  if (notyet == 0) {
    value = "O";
    // 이건 좀 그렇다... 틀린것만 있으면...  그냥 return 어때....
    if (correct == 0) {
      return;
    }
    // value = 'X';
  }

  var aData = { index: this.player.currentProcessIndex, bAll: bAll, value: value };
  console.log("mtmPlayerExam > onTableButtonClickHandlerNew : ", this.player.testum_result_new, aData);
  this._playTestumContentNew(aData);
};

mtmPlayerExam.prototype.onCellClickHandlerNew = function (tX, tY, value) {
  console.log("mtmPlayerExam > onCellClickHandlerNew : ", tX, tY, value);
  if (value == "?") {
    // 안 풀어본거 하자고?
    this.player.currentProcessIndex = tX; // parseInt(tX/2);
    this.player.testum_start_index = tY;
    var aData = { index: this.player.currentProcessIndex, bAll: false, value: "?" };
    this._playTestumContentNew(aData);
    // this._prepareCurrentResult(this.player.currentProcessIndex);
    // this._prepareQuestionList(this.player.currentProcessIndex,false,'?');
    // this._prepareTestumQuestion(this.player.testum_q_index,this.player.testum_q_list);
  } else if (value == "O") {
    this.player.currentProcessIndex = tX; //parseInt(tX/2);
    this.player.testum_start_index = tY;
    var aData = { index: this.player.currentProcessIndex, bAll: false, value: "O" };
    this._playTestumContentNew(aData);

    // this._prepareCurrentResult(this.player.currentProcessIndex);
    // this._prepareQuestionList(this.player.currentProcessIndex,false,'O');
    // this.player.testum_start_index = tY;
    // this._prepareTestumQuestion(this.player.testum_q_index,this.player.testum_q_list);
  } else if (value == "X") {
    this.player.currentProcessIndex = tX; //parseInt(tX/2);
    this.player.testum_start_index = tY;
    var aData = { index: this.player.currentProcessIndex, bAll: false, value: "X" };
    this._playTestumContentNew(aData);

    // this._prepareCurrentResult(this.player.currentProcessIndex);
    // this._prepareQuestionList(this.player.currentProcessIndex,false,'X');
    // this.player.testum_start_index = tY;
    // this._prepareTestumQuestion(this.player.testum_q_index,this.player.testum_q_list);
  }

  this._updateTestumProgress();
};
////////////////////////// Testum Indicator 와 연동되는 Handler ////////////////////////////
mtmPlayerExam.prototype.clickIndicatorHandler = function (index) {
  this.clPlayerTestumViewer.setQuestionIndex(index);
};

mtmPlayerExam.prototype.onActiveIndexChangeHandler = function (index) {
  this.clTestumIndicator.setIndex(index);
};

mtmPlayerExam.prototype.onVideoCompleted = function (eData) {
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  // this.clStudyPlayerVideo.show(false);
  this.clPlayerVideoContent.show(false);

  this.clTestumIndicator.show(true);
  this.clTestumSubmitAction.show(true);
  this.clPlayerTestumViewer.show(true);
};

mtmPlayerExam.prototype.onEventSolutionHandler = function (eData) {
  console.log("mtmPlayerExam > onEventSolutionHandler : ", eData);
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  // if(!this.clStudyPlayerVideo)
  if (!this.clPlayerVideoContent) this._createPlayerVideo(eData);
  // Show Video Play
  this.clTestumIndicator.show(false);
  this.clTestumSubmitAction.show(false);
  this.clPlayerTestumViewer.show(false);

  // Fixed. Jstar : Testum 문제 동영상 해설보기
  // this.clStudyPlayerVideo.show(true);
  // this.clStudyPlayerVideo.play(eData.videoId,eData.time);
  this.clPlayerVideoContent.play(eData.videoId, eData.time);
  this.clPlayerVideoContent.show(true);
};

// 오답하기에서 각문제에 대한 Submit (제출)
// Testum Submit 이다.
mtmPlayerExam.prototype.onEventSubmitHandler = function (eData) {
  console.log("mtmPlayerExam > onEventSubmitHandler : ", eData);
  // 오답하기에서 하나 제출 - argument : false
  this._updateTestumResult(false, eData);
};

mtmPlayerExam.prototype.onEventSubmitHandlerNew = function (eData) {
  console.log("mtmPlayerExam > onEventSubmitHandlerNew : ", eData);
  // 오답하기에서 하나 제출 - argument : false
  this._updateTestumResult(false, eData);
};

mtmPlayerExam.prototype.onAnswerChangeHandler = function (eData) {
  // eData.index , eData.answer
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////// API /////////////////////////////////////
// mClassContentAssign : sections : {"duration":"01:00","ontime":"1","resulttime":"01:00"}
// Exam 이냐? Testum 이냐 구분
mtmPlayerExam.prototype.setPlayOptions = function (options) {
  this.playOptions = options;

  this.player.student_id = this.playOptions.student_id;
  this.player.class_id = this.playOptions.class_id;
  this.player.course_id = this.playOptions.course_id;
  this.player.content_id = this.playOptions.content_id;
  this.player.content_type = this.playOptions.content_type;

  if (this.playOptions.content_type == mtoContentFormat.EXAM) {
    // exam table 에서 가져오는 data - debug 하기에 좋음
    this.player.examdate = this.playOptions.examdate;
    this.player.examtime = this.playOptions.examtime;

    this.examProp = {};
    this.examProp.examdate = this.playOptions.examdate;
    this.examProp.examtime = this.playOptions.examtime;

    if (!eData.progress) this.examStartTime = 0;
    else this.examStartTime = eData.progress;

    this.elGradingButton.innerHTML = '<i class="fa-solid fa-file-arrow-up"></i> 제출';
    this.elGradingButton.style.display = "none";
    // hide exam progress bar
    // this.clPlayerTestumProgress.show(false);
    this.clPlayerTestumProgress.elThis.style.visibility = "hidden";

    this.clExamResultTable.show(false);
    this.clPlayerTestumViewer.showInformation(true);
    this.clPlayerTestumViewer.showTestum(false);
    this.clPlayerTestumViewer.showElapseTimer(false);
  } // normal testum mode
  else {
    this.elGradingButton.innerHTML = '<i class="fa-solid fa-check"></i> 채점';
    this.elGradingButton.style.display = "";

    // show testum progress bar
    // this.clPlayerTestumProgress.show(true);
    this.clPlayerTestumProgress.elThis.style.visibility = "visible";
    this.clPlayerTestumViewer.showInformation(false);
    this.clPlayerTestumViewer.setCountUpTimer(0);
    this.clPlayerTestumViewer.showTestum(true);
    this.clPlayerTestumViewer.showElapseTimer(true);
  }

  this.player.finalProcessIndex = -1;
  // prepare Data
  this._prepareDataNew(eData);

  // for test
  // eData.twin = true;
  // eData.twin_num = 2;

  // prepare Title
  this._prepareTitleNew(eData.title);

  // prepare Result
  this._prepareResultFinalNew();
  this._prepareResultNew();

  // prepare Progress
  this._prepareTestumProgressNew();
};

mtmPlayerExam.prototype.setPlayMode = function (options) {
  this.playOptions = options;
  this.content_type = options.content_type;
  this.course_type = options.content_type;

  this.playMode = mode;

  // if(this.playMode == 1)  // clinic
  // {

  // }
  // else
  // if(this.playMode == 2)  // exam mode
  if (this.playOptions.content_type == mtoContentFormat.EXAM) {
    this.elGradingButton.innerHTML = '<i class="fa-solid fa-file-arrow-up"></i> 제출';
    this.elGradingButton.style.display = "none";
    // hide exam progress bar
    // this.clPlayerTestumProgress.show(false);
    this.clPlayerTestumProgress.elThis.style.visibility = "hidden";

    this.clExamResultTable.show(false);
    this.clPlayerTestumViewer.showInformation(true);
    this.clPlayerTestumViewer.showTestum(false);
    this.clPlayerTestumViewer.showElapseTimer(false);
  } // normal testum mode
  else {
    this.elGradingButton.innerHTML = '<i class="fa-solid fa-check"></i> 채점';
    this.elGradingButton.style.display = "";

    // show testum progress bar
    // this.clPlayerTestumProgress.show(true);
    this.clPlayerTestumProgress.elThis.style.visibility = "visible";
    this.clPlayerTestumViewer.showInformation(false);
    this.clPlayerTestumViewer.setCountUpTimer(0);
    this.clPlayerTestumViewer.showTestum(true);
    this.clPlayerTestumViewer.showElapseTimer(true);
  }
};

mtmPlayerExam.prototype.setPlayModeNew = function (options) {
  // this.playMode = mode;
  this.content_type = options.content_type;
  this.course_type = options.content_type;
};

mtmPlayerExam.prototype.stopPreviousContent = function () {
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  if (this.clPlayerVideoContent) {
    this.clPlayerVideoContent.stop();
    this.clPlayerVideoContent.show(false);
  }
};

mtmPlayerExam.prototype.setTestumDataNew = function (eData) {
  // if(this.playMode == 2)  // exam mode
  if (this.playOptions.content_type == mtoContentFormat.EXAM) {
    // mtoEvents.emit 의 리턴값을 받아서 처리.
    // var prop = mtoEvents.emit('OnGetExamProperty',eData.id);

    // console.log('mtmPlayerExam > setTestumData : ', eData,prop);

    if (!eData.progress) this.examStartTime = 0;
    else this.examStartTime = eData.progress;

    // db 에서 가져오는 data - debug 하기에 나쁨
    // this.examProp = {};
    // this.examProp.examtime = eData.examtime;
    // this.examProp.examdate = eData.examdate;
  }

  this._prepareTestumPlayerNew(eData);
};

mtmPlayerExam.prototype.show = function (bShow) {
  if (bShow) {
    this.elThis.style.display = "block";
    // this.clTestumResultTable.show(true);
  } else this.elThis.style.display = "none";
};

mtmPlayerExam.prototype.startTestum = function () {
  // if(this.playMode == 2)
  if (this.playOptions.content_type == mtoContentFormat.EXAM) this._decideExamProcessStatus();
  else this._decideTestumProcessStatus();
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// URL /////////////////////////////////////////
mtmPlayerExam.prototype._aurlUpdateExamResult = function (data) {
  // 처음이 아니면.
  // 평가 답안을 업로드 후 다시 Loading 한다.
  // if(!this.firstExam)
  mtoEvents.emit("OnChangeExamContent");
  // this.firstExam = false;
};

mtmPlayerExam.prototype._urlUpdateExamResult = function (data) {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);

  formData.append("student_id", this.player.student_id);
  formData.append("class_id", this.player.class_id);
  formData.append("course_id", this.player.course_id);
  formData.append("content_id", this.player.content_id);
  formData.append("content_type", this.player.content_type);

  this.dbTestumResult.try_count++;
  this.currentTryIndex = parseInt(this.player.currentProcessIndex / 2);
  this.dbTestumResult.try_index = this.currentTryIndex;

  this.dbTestumResult.wrong_count_value = 0;
  // 오답하기냐?

  if (this.player.currentProcessIndex % 2)
    this.dbTestumResult.wrong_count_value = ++this.dbTestumResult.wrong_count[this.dbTestumResult.try_index];

  console.log("try_index : ", this.currentTryIndex);
  console.log("wrong_count : ", this.dbTestumResult.wrong_count_value);

  // formData.append('wrong_count',this.dbTestumResult.wrong_count[this.dbTestumResult.try_index]);
  formData.append("wrong_count", this.dbTestumResult.wrong_count_value);
  formData.append("try_count", this.dbTestumResult.try_count);
  formData.append("try_index", this.dbTestumResult.try_index);
  var data = {};
  // data.question_results = this.dbTestumResult.qr_list.join(',');
  // data.repeat_count = this.dbTestumResult.rc_list.join(',');
  data.question_results = this.player.current_qr_list.join(",");
  data.repeat_count = this.player.current_rc_list.join(",");

  formData.append("question_results", data.question_results);
  formData.append("repeat_count", data.repeat_count);

  this.player.progress = 0;
  this.player.point = this.examPoint;
  // this.player.point = 0;

  // this.player.total_progress_num = this.activeField + 1;
  // this.total_correct_question_num =this._getCorrectQuestionNum();

  if (this.player.total_content_num > 0)
    this.player.progress = parseInt((this.player.total_progress_num * 100) / this.player.total_content_num);

  // if(this.player.total_question_num > 0)
  //     this.player.point = parseInt(this.total_correct_question_num*100/this.player.total_question_num);

  formData.append("progress", this.player.progress);
  formData.append("point", this.player.point);

  formData.append("playMode", this.playMode);
  var question_answers = {};
  question_answers.answers = this.examAnswers;

  formData.append("question_answers", JSON.stringify(question_answers));
  var eData = {};
  eData.progress = this.player.progress;
  eData.point = this.player.point;

  // Todo. Jstar : Exam 에서는 어떻게 해야 하나?
  // Update Study Container Panel
  // mtoEvents.emit('OnChangeProgressPoint',eData);

  if (!this.options.modeStudent && !this.options.onSkipContent) return;

  var url = "/st/updatetestumresult/";
  $.ajax({
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    cache: false,
    success: function (res) {
      self._aurlUpdateExamResult(res.result);
    },
  }); // end of ajax
};

mtmPlayerExam.prototype._aurlUpdateTestumResultInfo = function (result) {};

mtmPlayerExam.prototype._urlUpdateTestumResultInfo = function (data) {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);

  formData.append("student_id", this.player.student_id);
  formData.append("class_id", this.player.class_id);
  formData.append("course_id", this.player.course_id);
  formData.append("content_id", this.player.content_id);
  formData.append("content_type", this.player.content_type);
  formData.append("testum_results", JSON.stringify(this.player.testum_result_new));

  formData.append("progress", this.player.progress);
  formData.append("point", this.player.point);

  // Update Study Container Panel
  var eData = {};
  eData.content_id = this.player.content_id;
  eData.progress = this.player.progress;
  eData.point = this.player.point;

  mtoEvents.emit("OnChangeProgressPoint", eData);

  // console.log('mtmPlayerLesson > _urlUpdateLessonResult', this.total_progress_num, this.total_content_num);
  if (this.options.modeStudent == false && !this.options.onSkipContent) return;

  // updatetestumresultinfo 나 updatelessonresultinfo 나
  // 같은 기능
  // 추후에 updatestudyresultinfo 로 바꿀까?
  var url = "/st/updatetestumresultinfo/";
  if (this.options.modeStudent == false && this.options.onSkipContent)
    // 선생님 모드
    url = "/tc/updatetestumresultinfo/";

  $.ajax({
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    cache: false,
    success: function (res) {
      self._aurlUpdateTestumResultInfo(res.result);
    },
  }); // end of ajax
};
