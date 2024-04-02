import elem from "../../../../core/utils/elem/elem.js";
import { classNames } from "../../../../core/utils/class-names.js";

import { apiClass } from "../../../../core/api/class/index.js";

import { mtoContentFormat } from "../../../../core/utils/mto-content-format.js";
import { mtoEvents } from "../../../../core/utils/mto-events.js";

import { mtmPlayerTestumTitle } from "../../../st/testum/mtm-player-testum-title.js";
import { mtmPlayerTestumSubmitAction } from "../../../st/testum/mtm-player-testum-submit-action.js";

import { mtmPlayerTestumResultAction } from "../../../st/testum/mtm-player-testum-result-action.js";
import { mtmPlayerTestumResultTable } from "../../../st/testum/mtm-player-testum-result-table.js";

// Exam Truth Table
import { mtmPlayerTestumViewer } from "../../../st/testum/mtm-player-testum-viewer.js";
import { mtmPlayerTestumProgress } from "../../../st/testum/mtm-player-testum-progress.js";
import { mtmPlayerTestumIndicator } from "../../../st/testum/mtm-player-testum-indicator.js";

import { mtmPlayerVideoContent } from "../../../st/lesson/mtm-player-video-content.js";

require("../../../../../css/pages/st/testum/testum-player.css");
export class ClassTestumPlayer {
  constructor(options = {}) {
    this.id = "id-mtm-player-testum-" + ClassTestumPlayer.id++;
    this.elThis = null;

    this.options = options;
    this.classId = options?.classId;

    this.index = -1;

    this.content_type = mtoContentFormat.TESTUM;
    this.course_type = mtoContentFormat.COURSE_NORMAL;
    this.modeStudent = true;
    this.resultList = [];

    this.bShowResult = false;

    this.player = {};

    this._init();
  }

  _init() {
    this.player.testIndicator = [];
    this.player.testCard = [];

    this.elThis = elem("div", {
      class: "mtm-player-testum",
      id: this.id,
    });

    this._createTestumTitle(this.elThis);
    this._createTestumProgress(this.elThis);
    this._createTestumSubmitAction(this.elThis);
    this._createTestumIndicator(this.elThis);
    this._createTestumViewer(this.elThis);

    this._createTestumResultAction(this.elThis);
    this._createTestumResultTable(this.elThis);

    this._createGradeButton(this.clPlayerTestumViewer.elThis);

    // Fixed. Jstar : Testum 문제 동영상 해설보기
    // this.clStudyPlayerVideo = null;
    this.clPlayerVideoContent = null;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  _createTestumTitle(parent) {
    this.clTestumTitle = new mtmPlayerTestumTitle({ title: "테스트 제목" });
    parent.appendChild(this.clTestumTitle.elThis);
  }

  _createTestumProgress(parent) {
    this.clPlayerTestumProgress = new mtmPlayerTestumProgress({ items: [] });
    // parent.appendChild(this.clPlayerTestumProgress.elThis);
  }

  _createTestumSubmitAction(parent) {
    this.clTestumSubmitAction = new mtmPlayerTestumSubmitAction({
      eventTimerHandler: this.onElapseTimer.bind(this),
      eventCorrectWrongHandler: this.onCorrectWrongHandler.bind(this),
      eventNextStepHandler: this.onNextStepHandler.bind(this),
      eventStatusHandler: this.onTableStatusHandler.bind(this),
    });

    /**
     * Deprecated
     * 오답하기/이어하기/전체보기
     * 이미 mtm-study-question-card 파일에 있다.
     * 즉, 여기 있는 submibAction은 현재 courseware의 ST에서 사용하지 않는다.
     */
    // parent.appendChild(this.clTestumSubmitAction.elThis);
  }

  _createTestumIndicator(parent) {
    const { testIndicator: items } = this.player;

    this.clTestumIndicator = new mtmPlayerTestumIndicator({
      items,
      eventClickHandler: this.onClickIndicatorHandler.bind(this),
    });

    parent.appendChild(this.clTestumIndicator.elThis);
  }

  _createTestumViewer(parent) {
    const { testCard: items } = this.player;
    this.clPlayerTestumViewer = new mtmPlayerTestumViewer({
      items,
      eventActiveIndexChangeHandler: this.onActiveIndexChangeHandler.bind(this),
      eventSolutionHandler: this.onEventSolutionHandler.bind(this),
      eventSubmitHandler: this.onEventSubmitHandlerNew.bind(this),
      eventConfirmHandler: this.onConfirmHandler.bind(this),
      eventAnswerChangeHandler: this.onAnswerChangeHandler.bind(this),
    });

    parent.appendChild(this.clPlayerTestumViewer.elThis);
  }

  _createTestumResultAction(parent) {
    this.clTestumResultAction = new mtmPlayerTestumResultAction({
      eventCorrectWrongHandler: this.onCorrectWrongHandler.bind(this),
      eventNextStepHandler: this.onNextStepHandler.bind(this),
      eventStatusHandler: this.onSliderStatusHandler.bind(this),
    });

    parent.appendChild(this.clTestumResultAction.elThis);

    this.clTestumResultAction.show(false);
  }

  _createTestumResultTable(parent) {
    this.clTestumResultTable = new mtmPlayerTestumResultTable({
      eventQuestionMarkClick: this.onQuestionMarkClickHandler.bind(this),
      eventTableButtonClick: this.onTableButtonClickHandler.bind(this),
      eventCellClick: this.onCellClickHandler.bind(this),
    });

    parent.appendChild(this.clTestumResultTable.elThis);

    this.clTestumResultTable.show(false);
  }

  _createGradeButton(parent) {
    this.buttonWrapper = elem("div", { class: "grading-button-wrapper" });

    this.elGradingButton = elem("button", {
      class: "testum-grading-button",
      type: "button",
      tabindex: "-1",
      style: "display:none",
      // attributes: {
      //   type: "button",
      //   tabindex: "-1",
      // },
      // styles: {
      //   display: "none",
      // },
    });

    this.elGradingButton.setAttribute("type", "button");
    this.elGradingButton.setAttribute("tabindex", "-1");
    this.elGradingButton.addEventListener("click", this.onGradingHandler.bind(this));
    this.elGradingButton.style.display = "none";

    const elText = elem(
      "i",
      {
        class: classNames("fa-solid", "fa-check"),
      },
      "채점",
    );
    this.elGradingButton.append(elText);

    this.buttonWrapper.append(this.elGradingButton);
    // parent.appendChild(this.elGradingButton);
    parent.appendChild(this.buttonWrapper);
  }

  _showPlayer(bShow) {
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
  }

  _showResult() {
    console.log("submit action activated");
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
  }

  // 오답하기에 이어서 하나씩 제출
  _checkTestumOneGrade(eData) {
    console.log("ClassTestumPlayer > _checkTestumOneGrade : ", eData);

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
  }

  _checkProgressPoint() {
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
        if (this.player.testum_result_new[i].result[j] === "O" || this.player.testum_result_new[i].result[j] === "X") {
          this.player.study_item_num++;
        }
        // this.player.study_item_num++;
        if (this.player.testum_unit_new[i].types[j] == "q" && this.player.testum_result_new[i].result[j] == "O")
          this.player.correct_question_num++;
      }
    }

    if (this.player.total_item_num > 0)
      this.player.progress = parseInt((this.player.study_item_num * 100) / this.player.total_item_num);
    if (this.player.total_question_num > 0)
      this.player.point = parseInt((this.player.correct_question_num * 100) / this.player.total_question_num);

    console.log(
      "ClassTestumPlayer > _checkProgressPoint : total_item_num = ",
      this.player.total_item_num,
      ", study_item_num =  ",
      this.player.study_item_num,
      ", total_completed_num =",
      this.player.completedNum,
      ", total_question_num = ",
      this.player.total_question_num,
      ", correct_question_num = ",
      this.player.correct_question_num,
      ", progress = ",
      this.player.progress,
      ", point = ",
      this.player.point,
    );
  }

  // 일괄 제출에 의한 채점
  _checkTestumGrade() {
    // console.log('ClassTestumPlayer > _checkTestumGrade : ',this.player.questionCard,,this.player.currentResult);
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

    console.log("ClassTestumPlayer > _checkTestumGrade : ", this.player.testum_result_new);

    this._checkProgressPoint();
  }

  _prepareData() {
    // 테스텀의 contentunit_list, contentresult_list,
    // 실제 content 와 result 를 설정
    this.player.testum_unit_new = this.playOptions.units;
    this.player.testum_content_new = this.playOptions.content_list;
    this.player.testum_result_new = this.playOptions.results;
    console.log(
      "ClassTestumPlayer > _prepareData : ",
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
  }

  _updateTestumProgress() {
    if (this.player.progressSliderIndex < this.player.currentProcessIndex)
      this.player.progressSliderIndex = this.player.currentProcessIndex;

    this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
  }

  _prepareResultFinalNew() {
    // 최종 결과 리스트
    this.player.finalProcessIndex = 0;

    this.player.finalInitIndex = 0;
    // 이것은 testum 에서는 중요하지 않음.
    this.player.finalItemIndex = 0;

    if (this.player.testum_result_new.length == 0) this.player.finalProcessIndex = -1;
  }

  _prepareResult() {
    this.player.finalProcessIndex = 0;

    this.player.finalInitIndex = 0;
    // 이것은 testum 에서는 중요하지 않음.
    this.player.finalItemIndex = 0;

    if (this.player.testum_result_new.length == 0) this.player.finalProcessIndex = -1;

    this.clTestumResultTable.setTestumResultList(this.player.testum_unit_new, this.player.testum_result_new);
  }

  _beforePlayTestumContentNew(pData) {
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
      "ClassTestumPlayer > _beforePlayTestumContentNew : ",
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

    console.log("ClassTestumPlayer > _beforePlayTestumContentNew : ", this.player.testum_q_list);

    // Be Sure
    if (this.player.testum_start_index == -1) this.player.testum_start_index = 0;
  }
  // Testum Result 는 반드시 Unit 하나당 2개 가 필요
  // 하나는 초벌, 하나는 오답하기....
  _playTestumContent(pData) {
    // index,bAll,value
    console.log(
      "ClassTestumPlayer > _playTestumContent : ",
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
  }

  _prepareTitle() {
    this.clTestumTitle.setTitle(this.playOptions.title);
  }

  _prepareProgress() {
    for (var i = 0; i < this.player.testum_unit_new.length; i++) {
      this.player.progressSliderIndicator.push(i * 2);
      this.player.progressSliderIndicator.push(i * 2 + 1);
    }
    console.log("ClassTestumPlayer. > ._prepareTestumProgress : ", this.player.progressSliderIndicator);

    this.clPlayerTestumProgress.setProgressContent(this.player.progressSliderIndicator, 2);
    this.clPlayerTestumProgress.setActive(this.player.progressSliderIndex);
  }

  _createPlayerVideo(eData) {
    // Fixed. Jstar : Testum 문제 동영상 해설보기
    var options = {};
    // options.eventVideoHandler = this.onVideoCompleted.bind(this);
    console.log("ClassTestumPlayer > _createPlayerVideo :", eData);
    options.eventVideoHandler = this.onVideoCompleted.bind(this);
    this.clPlayerVideoContent = new mtmPlayerVideoContent(options);

    // this.elThis.appendChild(this.clStudyPlayerVideo.elThis);
    this.elThis.appendChild(this.clPlayerVideoContent.elThis);
  }

  _updateTestumResult(bGrade, eData) {
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
    this.urlUpdateTestumResult();
    this.infoResult = this.clTestumResultTable.setTestumResultList(
      this.player.testum_unit_new,
      this.player.testum_result_new,
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Handler /////////////////////////////////////////
  onConfirmHandler() {
    console.log("ClassTestumPlayer > onConfirmHandler : ");

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

  // 채점(testum mode)/제출(exam mode)
  onGradingHandler() {
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

  onTableStatusHandler() {
    alert("onTableStatusHandler");
    this._showResult();
  }

  onSliderStatusHandler() {
    this.bGradingResult = true;
    this._showPlayer();
  }

  onElapseTimer() {
    console.log("ClassTestumPlayer > onElapseTimer :");
  }

  onCorrectWrongHandler() {
    // console.log('ClassTestumPlayer : onCorrectWrongHandler');
    // this.bCorrectWrong = true;
    // this.bShowResult = false;
    // if(this.currentResult.length == 0)
    // {
    //     console.log('ClassTestumPlayer : onCorrectWrongHandler -> no currentResult');
    //     return;
    // }
    // this._prepareTestumQuestions();
  }
  onNextStepHandler() {
    // console.log('ClassTestumPlayer : onNextStepHandler');
    // 본문제(0), 쌍둥이(1), 마지막(2)
    // if(this.currentTryIndex >= 2)
    // {
    //     console.log('ClassTestumPlayer : onNextStepHandler -> overflow currentTryIndex');
    //     return;
    // }
    // this.currentTryIndex++;
    // this.bCorrectWrong = false;
    // this.bShowResult = false;
    // this.currentResult = [];
    // this._prepareTestumQuestions();
  }
  ///////////////////// Testum Result Table 과 연동되는 Handler //////////////////
  onQuestionMarkClickHandler(tX, tY) {}
  /////////////////////////////////////////////////////////////////////////
  // Button 을 Disable 시킬수 있게 하는 기능을 추가해야 한다.
  // 테스텀 결과 Table 의 본 문제하기/오답 하기 버튼을 Click 했을시...
  onTableButtonClickHandler(index) {
    console.log("ClassTestumPlayer > onTableButtonClickHandler : ", index);
    this.player.currentProcessIndex = index; // parseInt(index/2);

    // 새로운 Testum Progress 를 설정한다.
    this._updateTestumProgress();

    let notyet = 0;
    let correct = 0;
    const unitIndex = parseInt(index / 2);
    for (var i = 0; i < this.player.testum_result_new[unitIndex].result.length; i++) {
      if (index % 2) {
        if (this.player.testum_result_new[unitIndex].second[i] == "?") {
          notyet++;
        }
        if (this.player.testum_result_new[unitIndex].second[i] == "O") {
          correct++;
        }
      } else {
        if (this.player.testum_result_new[unitIndex].first[i] == "?") {
          notyet++;
        }
        if (this.player.testum_result_new[unitIndex].first[i] == "O") {
          correct++;
        }
      }
    }

    const value = notyet == 0 ? "O" : "?";
    const bAll = false;

    const aData = { index: this.player.currentProcessIndex, bAll: bAll, value: value };
    console.log("ClassTestumPlayer > onTableButtonClickHandler : ", this.player.testum_result_new, aData);
    this._playTestumContent(aData);
  }

  onCellClickHandler(tX, tY, value) {
    let aData;
    switch (value) {
      case "?":
        // 안 풀어본거 하자고?
        this.player.currentProcessIndex = tX; // parseInt(tX/2);
        this.player.testum_start_index = tY;
        aData = { index: this.player.currentProcessIndex, bAll: false, value: "?" };
        this._playTestumContent(aData);
        break;
      case "O":
        this.player.currentProcessIndex = tX; //parseInt(tX/2);
        this.player.testum_start_index = tY;
        aData = { index: this.player.currentProcessIndex, bAll: false, value: "O" };
        this._playTestumContent(aData);
        break;
      case "X":
        this.player.currentProcessIndex = tX; //parseInt(tX/2);
        this.player.testum_start_index = tY;
        aData = { index: this.player.currentProcessIndex, bAll: false, value: "X" };
        this._playTestumContent(aData);
        break;
    }

    this._updateTestumProgress();
  }
  ////////////////////////// Testum Indicator 와 연동되는 Handler ////////////////////////////
  onClickIndicatorHandler(index) {
    this.clPlayerTestumViewer.setQuestionIndex(index);
  }

  onActiveIndexChangeHandler(index) {
    this.clTestumIndicator.setIndex(index);
  }

  onVideoCompleted(eData) {
    // Fixed. Jstar : Testum 문제 동영상 해설보기
    // this.clStudyPlayerVideo.show(false);
    this.clPlayerVideoContent.show(false);

    this.clTestumIndicator.show(true);
    this.clTestumSubmitAction.show(true);
    this.clPlayerTestumViewer.show(true);
  }

  onEventSolutionHandler(eData) {
    console.log("ClassTestumPlayer > onEventSolutionHandler : ", eData);
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
  }
  // 오답하기에서 각문제에 대한 Submit (제출)
  // Testum Submit 이다.
  onEventSubmitHandler(eData) {
    console.log("ClassTestumPlayer > onEventSubmitHandler : ", eData);
    // 오답하기에서 하나 제출 - argument : false
    this._updateTestumResult(false, eData);
  }
  onEventSubmitHandlerNew(eData) {
    console.log("ClassTestumPlayer > onEventSubmitHandlerNew : ", eData);
    // 오답하기에서 하나 제출 - argument : false
    this._updateTestumResult(false, eData);
  }
  onAnswerChangeHandler(eData) {
    // eData.index , eData.answer
  }
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// API /////////////////////////////////////
  // mClassContentAssign : sections : {"duration":"01:00","ontime":"1","resulttime":"01:00"}
  // Exam 이냐? Testum 이냐 구분
  setPlayOptions(options) {
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
  }
  stopPreviousContent() {
    // Fixed. Jstar : Testum 문제 동영상 해설보기
    if (this.clPlayerVideoContent) {
      this.clPlayerVideoContent.stop();
      this.clPlayerVideoContent.show(false);
    }
  }

  show(bShow) {
    // if (bShow) this.elThis.style.display = "block";
    if (bShow) {
      // this.elThis.style.display = "flex";
      this.elThis.classList.add("activate");
    } else {
      // this.elThis.style.display = "none";
      this.elThis.classList.remove("activate");
    }
  }
  // 테스트를 처음 진행? -> 우리가 아는 테스트창
  // 테스트 본 적 있음? -> 결과창
  startTestum() {
    console.log("ClassTestumPlayer > startTestum");
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
  }

  setStudyResultId(id) {
    this.studyResultId = id;
  }

  // ============ URL ============
  async urlUpdateTestumResult() {
    const eData = {};
    eData.content_id = this.player.content_id;
    eData.progress = this.player.progress;
    eData.point = this.player.point;

    mtoEvents.emit("OnChangeProgressPoint", eData);

    try {
      const response = await apiClass.studyResultProperty.patch({
        pk: this.studyResultId,
        data: {
          id_class: this.classId,
          id_student: this.player.student_id,
          id_course: this.player.course_id,
          id_content: this.player.content_id,
          content_type: this.player.content_type,
          course_type: this.player.content_type,
          results: JSON.stringify(this.player.testum_result_new), // one record of json_data['property']
          progress: this.player.progress,
          point: this.player.point,
        },
      });

      mtoEvents.emit("onClassStudyResultUpdate", response.data);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

ClassTestumPlayer.id = 0;
ClassTestumPlayer.MaxTwinNum = 2;
ClassTestumPlayer.MaxIndex = 3;
ClassTestumPlayer.MaxTestumContentNum = 6;
