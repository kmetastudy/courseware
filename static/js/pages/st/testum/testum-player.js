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
import { mtoContentFormat } from "../../../core/utils/mto-content-format.js";
import { mtoEvents } from "../../../core/utils/mto-events.js";

import { mtmPlayerTestumTitle } from "./mtm-player-testum-title.js";
import { mtmPlayerTestumSubmitAction } from "./mtm-player-testum-submit-action.js";

import { mtmPlayerTestumResultAction } from "./mtm-player-testum-result-action.js";
import { mtmPlayerTestumResultTable } from "./mtm-player-testum-result-table.js";

// Exam Truth Table
import { mtmPlayerTestumViewer } from "./mtm-player-testum-viewer.js";
import { mtmPlayerTestumProgress } from "./mtm-player-testum-progress.js";
import { mtmPlayerTestumIndicator } from "./mtm-player-testum-indicator.js";

// Fixed. Jstar : Testum 문제 동영상 해설보기
import { mtmPlayerVideoContent } from "../lesson/mtm-player-video-content.js";

// clinic content 와 normal content 를 왜 굳이 구별했을까?
// playMode == contentKind  :    0 --> normal Class Content
//                              1 --> clinic content
// playMode == action_request (DB)
export var TestumPlayer = function (options) {
  this.id = "id-mtm-player-testum-" + TestumPlayer.id++;
  this.elThis = null;

  this.options = options;

  if (!this.options) this.options = {};

  this.index = -1;
  // this.playMode = 0;
  this.content_type = mtoContentFormat.TESTUM;
  this.course_type = mtoContentFormat.COURSE_NORMAL;

  this.modeStudent = true;
  this.bShowResult = false;

  this.resultList = [];
  this.player = {};
  this._init();
};

TestumPlayer.id = 0;
TestumPlayer.MaxTwinNum = 2;
TestumPlayer.MaxIndex = 3;
TestumPlayer.MaxTestumContentNum = 6;

////////////////////////////////////////////////////////////////////////////////////////////

TestumPlayer.prototype._initTest = function () {
  var len = TestumPlayer.questionList.length;
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
      content: TestumPlayer.questionList[i % len].content,
      id: TestumPlayer.questionList[i % len].id,
      style: TestumPlayer.questionList[i % len].style,
      level: TestumPlayer.questionList[i % len].level,
    });
  }
};

TestumPlayer.prototype._createTestumTitle = function (parent) {
  var options = {};
  options.title = "테스트 제목";

  this.clTestumTitle = new mtmPlayerTestumTitle(options);
  parent.appendChild(this.clTestumTitle.elThis);
};

TestumPlayer.prototype._createTestumProgress = function (parent) {
  var options = {};
  options.items = [];

  this.clPlayerTestumProgress = new mtmPlayerTestumProgress(options);

  parent.appendChild(this.clPlayerTestumProgress.elThis);
};

// 이게 뭐하는지를 자세히 알아보자...
TestumPlayer.prototype._createTestumSubmitAction = function (parent) {
  var options = {};
  (options.eventTimerHandler = this.onElapseTimer.bind(this)),
    (options.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this)),
    (options.eventNextStepHandler = this.onNextStepHandler.bind(this)),
    (options.eventStatusHandler = this.onTableStatusHandler.bind(this)),
    (this.clTestumSubmitAction = new mtmPlayerTestumSubmitAction(options));
  parent.appendChild(this.clTestumSubmitAction.elThis);
};

TestumPlayer.prototype._createTestumIndicator = function (parent) {
  var options = {};

  options.items = this.player.testIndicator;

  options.eventClickHandler = this.onClickIndicatorHandler.bind(this);
  this.clTestumIndicator = new mtmPlayerTestumIndicator(options);

  parent.appendChild(this.clTestumIndicator.elThis);
};

TestumPlayer.prototype._createTestumViewer = function (parent) {
  var options = {};
  options.items = this.player.testCard;
  options.eventActiveIndexChangeHandler = this.onActiveIndexChangeHandler.bind(this);
  options.eventSolutionHandler = this.onEventSolutionHandler.bind(this);

  // 테스트에서는 각 문제를 Submit 할 수 없기 때문에 이는 의미가 없다.
  // Fix. 오답하기에서는 각문제를 Submit 할 수 있기 때문에...,
  // Testum Submit Event 가 된다.
  options.eventSubmitHandler = this.onEventSubmitHandlerNew.bind(this);
  options.eventConfirmHandler = this.onConfirmHandler.bind(this);
  // options.eventExamStartHandler = this.onExamStartHandler.bind(this);
  // options.eventExamEndHandler = this.onExamEndHandler.bind(this);
  // options.eventTimeOutHandler = this.onExamTimeOutHandler.bind(this);
  options.eventAnswerChangeHandler = this.onAnswerChangeHandler.bind(this);
  this.clPlayerTestumViewer = new mtmPlayerTestumViewer(options);

  parent.appendChild(this.clPlayerTestumViewer.elThis);
};

// 이것을 안쓰는 것 같음.
TestumPlayer.prototype._createTestumResultAction = function (parent) {
  var options = {};
  (options.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this)),
    (options.eventNextStepHandler = this.onNextStepHandler.bind(this)),
    (options.eventStatusHandler = this.onSliderStatusHandler.bind(this)),
    (this.clTestumResultAction = new mtmPlayerTestumResultAction(options));
  parent.appendChild(this.clTestumResultAction.elThis);
  this.clTestumResultAction.show(false);
};

TestumPlayer.prototype._createTestumResultTable = function (parent) {
  var options = {};
  // 현재 기능 없음
  options.eventQuestionMarkClick = this.onQuestionMarkClickHandler.bind(this);
  options.eventTableButtonClick = this.onTableButtonClickHandler.bind(this);
  options.eventCellClick = this.onCellClickHandler.bind(this);

  this.clTestumResultTable = new mtmPlayerTestumResultTable(options);
  parent.appendChild(this.clTestumResultTable.elThis);
  this.clTestumResultTable.show(false);
};

TestumPlayer.prototype._createGradeButton = function (parent) {
  // Todo. Button 포커스에 따른 부작용 처리
  this.elGradingButton = document.createElement("button");
  this.elGradingButton.classList.add(
    "mtm-input-button",
    "mtm-input-button-fixed",
    "mtm-input-button-theme",
    "mtm-input-button-hover-theme",
    "px-4",
  );
  // this.elGradingButton.setAttribute(
  //   "style",
  //   "z-index: 10;position: fixed; bottom: 20px; right: 40px; font-weight:600;",
  // );
  this.elGradingButton.setAttribute(
    "style",
    "z-index: 10;position: absolute; bottom: 40px; right: 0px; font-weight:600;",
  );
  this.elGradingButton.setAttribute("type", "button");
  this.elGradingButton.setAttribute("tabindex", "-1");
  this.elGradingButton.innerHTML = '<i class="fa-solid fa-check"></i> 채점';
  this.elGradingButton.addEventListener("click", this.onGradingHandler.bind(this));
  this.elGradingButton.style.display = "none";

  console.log("parent: ", parent);
  parent.appendChild(this.elGradingButton);
};

TestumPlayer.prototype._init = function () {
  this.player.testIndicator = [];
  this.player.testCard = [];

  // this._initTest();

  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);

  // FIX
  // 2023/12/04
  // REMOVE COL-12 FOR LAYOUT
  // this.elThis.classList.add("col-12", "mtm-player-testum");
  this.elThis.classList.add("mtm-player-testum");

  this._createTestumTitle(this.elThis);
  this._createTestumProgress(this.elThis);
  this._createTestumSubmitAction(this.elThis);
  this._createTestumIndicator(this.elThis);
  this._createTestumViewer(this.elThis);

  this._createTestumResultAction(this.elThis);
  this._createTestumResultTable(this.elThis);

  // this._createGradeButton(this.elThis);
  this._createGradeButton(this.clPlayerTestumViewer.elThis);

  // Fixed. Jstar : Testum 문제 동영상 해설보기
  // this.clStudyPlayerVideo = null;
  this.clPlayerVideoContent = null;

  mtoEvents.on("OnOnePanel", this.onOnePanelHandler.bind(this));
  mtoEvents.on("OnTwoPanel", this.onTwoPanelHandler.bind(this));
};

// 1) setTestumData : 테스텀 콘텐츠와 결과를 설정한다.
// 2) Testum Result 가 존재하면, TestumResult(결과)를 보여준다.
// 3) Testum Result 가 존재하지 않으면, TestumViewer 를 보여준다.
TestumPlayer.prototype._showPlayer = function (bShow) {
  if (this.clTestumNavi) this.clTestumNavi.show(true);
  this.clTestumIndicator.show(true);

  this.clTestumSubmitAction.show(true);

  if (!this.bGradingResult) {
    this.clTestumSubmitAction.showCorrectWrong(false);
    this.clTestumSubmitAction.showNextStep(false);
    this.clTestumSubmitAction.showTotalResult(false);
  }

  this.clPlayerTestumViewer.show(true);

  // Todo. Jstar : Grading Button
  this.elGradingButton.style.display = "";

  if (this.bShowResult) this.elGradingButton.style.display = "none";
  else this.elGradingButton.style.display = "block";

  this.clTestumResultAction.show(false);
  this.clTestumResultTable.show(false);
};

TestumPlayer.prototype._showResult = function () {
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

// 오답하기에 이어서 하나씩 제출
TestumPlayer.prototype._checkTestumOneGrade = function (eData) {
  console.log("TestumPlayer > _checkTestumOneGrade : ", eData);

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

TestumPlayer.prototype._checkProgressPoint = function () {
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
    "TestumPlayer > _checkProgressPoint : total_item_num = ",
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

// 일괄 제출에 의한 채점
TestumPlayer.prototype._checkTestumGrade = function () {
  // console.log('TestumPlayer > _checkTestumGrade : ',this.player.questionCard,,this.player.currentResult);
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

  console.log("TestumPlayer > _checkTestumGrade : ", this.player.testum_result_new);

  this._checkProgressPoint();
};

TestumPlayer.prototype._prepareData = function () {
  // 테스텀의 contentunit_list, contentresult_list,
  // 실제 content 와 result 를 설정
  this.player.testum_unit_new = this.playOptions.units;
  this.player.testum_content_new = this.playOptions.content_list;
  this.player.testum_result_new = this.playOptions.results;
  console.log(
    "TestumPlayer > _prepareData : ",
    this.player.testum_unit_new,
    this.player.testum_content_new,
    this.player.testum_result_new,
  );
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

TestumPlayer.prototype._updateTestumProgress = function () {
  if (this.player.progressSliderIndex < this.player.currentProcessIndex)
    this.player.progressSliderIndex = this.player.currentProcessIndex;

  this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
};

TestumPlayer.prototype._prepareResultFinalNew = function () {
  // 최종 결과 리스트
  this.player.finalProcessIndex = 0;

  this.player.finalInitIndex = 0;
  // 이것은 testum 에서는 중요하지 않음.
  this.player.finalItemIndex = 0;

  if (this.player.testum_result_new.length == 0) this.player.finalProcessIndex = -1;
};

TestumPlayer.prototype._prepareResult = function () {
  this.player.finalProcessIndex = 0;

  this.player.finalInitIndex = 0;
  // 이것은 testum 에서는 중요하지 않음.
  this.player.finalItemIndex = 0;

  if (this.player.testum_result_new.length == 0) this.player.finalProcessIndex = -1;

  this.clTestumResultTable.setTestumResultList(this.player.testum_unit_new, this.player.testum_result_new);
};

TestumPlayer.prototype._beforePlayTestumContentNew = function (pData) {
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
    "TestumPlayer > _beforePlayTestumContentNew : ",
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

  console.log("TestumPlayer > _beforePlayTestumContentNew : ", this.player.testum_q_list);

  // Be Sure
  if (this.player.testum_start_index == -1) this.player.testum_start_index = 0;
};

// Testum Result 는 반드시 Unit 하나당 2개 가 필요
// 하나는 초벌, 하나는 오답하기....
TestumPlayer.prototype._playTestumContent = function (pData) {
  // index,bAll,value
  console.log(
    "TestumPlayer > _playTestumContent : ",
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

TestumPlayer.prototype._prepareTitle = function () {
  this.clTestumTitle.setTitle(this.playOptions.title);
};

TestumPlayer.prototype._prepareProgress = function () {
  for (var i = 0; i < this.player.testum_unit_new.length; i++) {
    this.player.progressSliderIndicator.push(i * 2);
    this.player.progressSliderIndicator.push(i * 2 + 1);
  }
  console.log("TestumPlayer. > ._prepareTestumProgress : ", this.player.progressSliderIndicator);

  this.clPlayerTestumProgress.setProgressContent(this.player.progressSliderIndicator, 2);
  this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
};

TestumPlayer.prototype._createPlayerVideo = function (eData) {
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  var options = {};
  // options.eventVideoHandler = this.onVideoCompleted.bind(this);
  console.log("TestumPlayer > _createPlayerVideo :", eData);
  options.eventVideoHandler = this.onVideoCompleted.bind(this);
  this.clPlayerVideoContent = new mtmPlayerVideoContent(options);

  // this.elThis.appendChild(this.clStudyPlayerVideo.elThis);
  this.elThis.appendChild(this.clPlayerVideoContent.elThis);
};

TestumPlayer.prototype._updateTestumResult = function (bGrade, eData) {
  // 채점
  if (bGrade) {
    // this.bFirstGrade - 본 문제
    this._checkTestumGrade();
  }
  // 오답하기 에서 하나씩 제출
  else {
    this._checkTestumOneGrade(eData);
  }

  // 결과 서버에 전송
  // this._urlUpdateTestumResultInfo();
  this.urlUpdateTestumResult();
  this.infoResult = this.clTestumResultTable.setTestumResultList(
    this.player.testum_unit_new,
    this.player.testum_result_new,
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler /////////////////////////////////////////
TestumPlayer.prototype.onOnePanelHandler = function () {
  console.log("TestumPlayer > onOnePanelHandler");
};

TestumPlayer.prototype.onTwoPanelHandler = function () {
  console.log("TestumPlayer > onTwoPanelHandler");
};

TestumPlayer.prototype.onConfirmHandler = function () {
  console.log("TestumPlayer > onConfirmHandler : ");

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

TestumPlayer.prototype.onExitHandler = function () {
  // console.log('TestumPlayer : onExitHandler');
  this.stopPreviousContent();
  mtvEvents.emit("OnTestumExit");
  // this._showPlayer();
};

// 채점(testum mode)/제출(exam mode)
TestumPlayer.prototype.onGradingHandler = function () {
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
};

TestumPlayer.prototype.onGradingOneHandler = function () {};

//
TestumPlayer.prototype.onTableStatusHandler = function () {
  this._showResult();
};

TestumPlayer.prototype.onSliderStatusHandler = function () {
  // console.log('TestumPlayer : onStatusHandler');
  this.bGradingResult = true;
  this._showPlayer();
};

TestumPlayer.prototype.onElapseTimer = function () {
  console.log("TestumPlayer > onElapseTimer :");
};

TestumPlayer.prototype.onCorrectWrongHandler = function () {
  // console.log('TestumPlayer : onCorrectWrongHandler');
  // this.bCorrectWrong = true;
  // this.bShowResult = false;
  // if(this.currentResult.length == 0)
  // {
  //     console.log('TestumPlayer : onCorrectWrongHandler -> no currentResult');
  //     return;
  // }
  // this._prepareTestumQuestions();
};

TestumPlayer.prototype.onNextStepHandler = function () {
  // console.log('TestumPlayer : onNextStepHandler');
  // 본문제(0), 쌍둥이(1), 마지막(2)
  // if(this.currentTryIndex >= 2)
  // {
  //     console.log('TestumPlayer : onNextStepHandler -> overflow currentTryIndex');
  //     return;
  // }
  // this.currentTryIndex++;
  // this.bCorrectWrong = false;
  // this.bShowResult = false;
  // this.currentResult = [];
  // this._prepareTestumQuestions();
};

///////////////////// Testum Result Table 과 연동되는 Handler //////////////////
// options.eventQuestionMarkClick = this.onQuestionMarkClickHandler.bind(this);
// options.eventTableButtonClick = this.onTableButtonClickHandler.bind(this);
// options.eventCellClick = this.onCellClickHandler.bind(this);
TestumPlayer.prototype.onQuestionMarkClickHandler = function (tX, tY) {};

/////////////////////////////////////////////////////////////////////////
// Button 을 Disable 시킬수 있게 하는 기능을 추가해야 한다.

// 테스텀 결과 Table 의 본 문제하기/오답 하기 버튼을 Click 했을시...
TestumPlayer.prototype.onTableButtonClickHandler = function (index) {
  console.log("TestumPlayer > onTableButtonClickHandler : ", index);
  this.player.currentProcessIndex = index; // parseInt(index/2);
  // 새로운 Testum Progress 를 설정한다.
  this._updateTestumProgress();

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
  console.log("TestumPlayer > onTableButtonClickHandler : ", this.player.testum_result_new, aData);
  this._playTestumContent(aData);
};

TestumPlayer.prototype.onCellClickHandler = function (tX, tY, value) {
  console.log("TestumPlayer > onCellClickHandler : ", tX, tY, value);
  if (value == "?") {
    // 안 풀어본거 하자고?
    this.player.currentProcessIndex = tX; // parseInt(tX/2);
    this.player.testum_start_index = tY;
    var aData = { index: this.player.currentProcessIndex, bAll: false, value: "?" };
    this._playTestumContent(aData);
  } else if (value == "O") {
    this.player.currentProcessIndex = tX; //parseInt(tX/2);
    this.player.testum_start_index = tY;
    var aData = { index: this.player.currentProcessIndex, bAll: false, value: "O" };
    this._playTestumContent(aData);
  } else if (value == "X") {
    this.player.currentProcessIndex = tX; //parseInt(tX/2);
    this.player.testum_start_index = tY;
    var aData = { index: this.player.currentProcessIndex, bAll: false, value: "X" };
    this._playTestumContent(aData);
  }

  this._updateTestumProgress();
};
////////////////////////// Testum Indicator 와 연동되는 Handler ////////////////////////////
TestumPlayer.prototype.onClickIndicatorHandler = function (index) {
  this.clPlayerTestumViewer.setQuestionIndex(index);
};

TestumPlayer.prototype.onActiveIndexChangeHandler = function (index) {
  this.clTestumIndicator.setIndex(index);
};

TestumPlayer.prototype.onVideoCompleted = function (eData) {
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  // this.clStudyPlayerVideo.show(false);
  this.clPlayerVideoContent.show(false);

  this.clTestumIndicator.show(true);
  this.clTestumSubmitAction.show(true);
  this.clPlayerTestumViewer.show(true);
};

TestumPlayer.prototype.onEventSolutionHandler = function (eData) {
  console.log("TestumPlayer > onEventSolutionHandler : ", eData);
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
TestumPlayer.prototype.onEventSubmitHandler = function (eData) {
  console.log("TestumPlayer > onEventSubmitHandler : ", eData);
  // 오답하기에서 하나 제출 - argument : false
  this._updateTestumResult(false, eData);
};

TestumPlayer.prototype.onEventSubmitHandlerNew = function (eData) {
  console.log("TestumPlayer > onEventSubmitHandlerNew : ", eData);
  // 오답하기에서 하나 제출 - argument : false
  this._updateTestumResult(false, eData);
};

TestumPlayer.prototype.onAnswerChangeHandler = function (eData) {
  // eData.index , eData.answer
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////// API /////////////////////////////////////
// mClassContentAssign : sections : {"duration":"01:00","ontime":"1","resulttime":"01:00"}
// Exam 이냐? Testum 이냐 구분
TestumPlayer.prototype.setPlayOptions = function (options) {
  this.playOptions = options;
  console.log(this.playOptions);

  // this.player.student_id = this.playOptions.student_id;
  this.player.student_id = this.playOptions.studentId;
  this.player.class_id = this.playOptions.class_id;
  // this.player.course_id = this.playOptions.course_id;
  this.player.course_id = this.playOptions.courseId;
  this.player.clinic_id = this.playOptions.clinic_id;
  this.player.content_id = this.playOptions.content_id;
  this.player.content_type = this.playOptions.content_type;
  this.player.course_type = this.playOptions.course_type;

  this.elGradingButton.innerHTML = '<i class="fa-solid fa-check"></i> 채점';
  this.elGradingButton.style.display = "";

  // show testum progress bar
  // this.clPlayerTestumProgress.show(true);
  this.clPlayerTestumProgress.elThis.style.visibility = "visible";
  this.clPlayerTestumViewer.showInformation(false);
  this.clPlayerTestumViewer.setCountUpTimer(0);
  this.clPlayerTestumViewer.showTestum(true);
  this.clPlayerTestumViewer.showElapseTimer(true);

  this.player.finalProcessIndex = -1;
  // prepare Data
  this._prepareData();

  // prepare Title
  this._prepareTitle();

  // prepare Result
  this._prepareResult();

  // prepare Progress
  this._prepareProgress();
};

TestumPlayer.prototype.stopPreviousContent = function () {
  // Fixed. Jstar : Testum 문제 동영상 해설보기
  if (this.clPlayerVideoContent) {
    this.clPlayerVideoContent.stop();
    this.clPlayerVideoContent.show(false);
  }
};

TestumPlayer.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

// 테스트를 처음 진행? -> 우리가 아는 테스트창
// 테스트 본 적 있음? -> 결과창
TestumPlayer.prototype.startTestum = function () {
  console.log("TestumPlayer > startTestum");
  // 가장 최근에 한 작업
  if (this.player.finalProcessIndex == -1 && this.options.modeStudent) {
    // student mode
    // 테스트를 처음하는 것...
    this.player.currentProcessIndex = 0;

    // Testum Questions 준비한다.
    var aData = { index: 0, bAll: true, value: "" };
    this._playTestumContent(aData);
  } else {
    // Testum Player 는 감춘다.
    this.clTestumIndicator.show(false);
    if (this.options.modeStudent)
      // student mode
      this.clTestumSubmitAction.show(false);
    this.clPlayerTestumViewer.show(false);

    this.clTestumResultTable.show(true);

    this.elGradingButton.style.display = "none";
  }
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// URL /////////////////////////////////////////
TestumPlayer.prototype._aurlUpdateTestumResultInfo = function (result) {};

TestumPlayer.prototype._urlUpdateTestumResultInfo = function (data) {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);

  formData.append("student_id", this.player.student_id);
  formData.append("class_id", this.player.class_id);
  formData.append("course_id", this.player.course_id);
  formData.append("clinic_id", this.player.clinic_id);
  formData.append("content_id", this.player.content_id);
  formData.append("content_type", this.player.content_type);
  formData.append("course_type", this.player.course_type);
  formData.append("properties", JSON.stringify(this.player.testum_result_new));
  console.log(
    "TestumPlayer > _urlUpdateTestumResultInfo : ",
    this.player.student_id,
    this.player.class_id, // missing
    this.player.course_id,
    this.player.clinic_id, // missing
    this.player.content_id,
    this.player.content_type,
    this.player.course_type, // missing
    this.player.testum_result_new,
  );

  formData.append("progress", this.player.progress);
  formData.append("point", this.player.point);

  // Update Study Container Panel
  var eData = {};
  eData.content_id = this.player.content_id;
  eData.progress = this.player.progress;
  eData.point = this.player.point;

  mtoEvents.emit("OnChangeProgressPoint", eData);

  var url = "/st/updatestudyresultinfo/";
  // var url = "/st/updatetestumresultinfo/";

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
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};

TestumPlayer.prototype.urlUpdateTestumResult = function () {
  const url = this.player.student_id ? "../st/api/study_result/properties/" : "../st/api/demo_study_result/properties/";

  const eData = {};
  eData.content_id = this.player.content_id;
  eData.progress = this.player.progress;
  eData.point = this.player.point;

  mtoEvents.emit("OnChangeProgressPoint", eData);

  return axios
    .patch(url, {
      student_id: this.player.student_id,
      course_id: this.player.course_id,
      content_id: this.player.content_id,
      content_type: this.player.content_type,
      course_type: this.player.content_type,
      properties: JSON.stringify(this.player.testum_result_new), // one record of properties['property']
      progress: this.player.progress,
      point: this.player.point,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
