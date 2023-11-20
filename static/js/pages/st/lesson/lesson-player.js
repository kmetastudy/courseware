// Transitions on the CSS display property
// https://stackoverflow.com/questions/3331353/transitions-on-the-css-display-property

// display none이 transition이 안먹히는 이유
// https://velog.io/@dev-tinkerbell/display-none이-transition이-안먹히는-이유

// css display none 애니메이션  오류 수정하기
// 출처: https://songsong.dev/entry/css-display-none-애니메이션-수정하기 [송송은 오늘도 열심히 코딩 하네:티스토리]

// display: none에 애니메이션 추가하기
// https://uxdev.org/entry/display-none에-애니메이션-추가하기?category=1055162

// LessonPlayer 역시 mtvPlayerTestum 과 같이
// Question Card 에 있어서는 mtmStudyQuestionCard 를 쓸 것을 권장한다.
// 지금 현재는 mtmPlayerLessonQuestion 을 쓰는 것 같다.
// (처음엔 mtmPlayerLessonVideo 에서 mtvPlayerTestumCard 를 쓰는줄 알았다. --!; )
//

// Todo. Jstar. Table 관련 Data 를 처리는 mtv-player-lesson-result-table.js 의 mtmPlayerLessonResultTable
// 에서 처리하도록 한다.

// 1) 틀린 문제에 들어가서, 또 틀려서, '다음하기' 일때 어디로 가야하나?
// import {mtvComponentBuilder} from '../../core/utils/mtv-component-builder.js';
import { mtoEvents } from "../../../core/utils/mto-events.js";
import { mtoVideoTime } from "../../../core/utils/mto-video-time.js";

import { mtmPlayerLessonQuestion } from "./mtm-player-lesson-question.js";
import { mtmPlayerLessonResultTable } from "./mtm-player-lesson-result-table.js";
import { mtmPlayerLessonTitle } from "./mtm-player-lesson-title.js";
import { mtmPlayerVideoContent } from "./mtm-player-video-content.js";

import { mtmStudySubmitAction } from "../study/mtm-study-submit-action.js";
import { mtmPlayerLessonProgress } from "./mtm-player-lesson-progress.js";
import { mtmStudyMessagePopup } from "../study/mtm-study-message-popup.js";
import { StudyResultTable } from "../study/study-result-table.js";

// clinic content 와 normal content 를 왜 굳이 구별했을까?
// playMode == contentKind  :    0 --> normal Class Content
//                              1 --> clinic content
// playMode == action_request (DB)
// clinic content 와 normal content 를 왜 굳이 구별했을까?
// playMode == contentKind  :    0 --> normal Class Content
//                              1 --> clinic content
// playMode == action_request (DB)
export class LessonPlayer {
  constructor(options) {
    this.id = "id-mtm-player-lesson-" + LessonPlayer.id++;
    this.elThis = null;

    this.options = options;
    if (!this.options) this.options = {};

    this.index = -1;
    this.playMode = 0;

    this.clPlayerVideoContent = null;

    // this.resultList = [];
    this.resultList = [];
    this.player = {};

    this._init();
  }

  _init() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);
    this.elThis.classList.add("col-12", "mtm-player-lesson");

    this._createLessonTitle(this.elThis);
    this._createLessonProgress(this.elThis);
    this._createLessonPopUp(this.elThis);
    this._createLessonSubmitAction(this.elThis);
    this._createLessonResultTable(this.elThis);
    this._createLessonQuestion(this.elThis);

    ////////////////////////////////////////////////////////////
    // 맨마지막에 Video Player 를 놓는다.
    this.clPlayerVideo = null;

    mtoEvents.on("OnOnePanel", this.onOnePanelHandler.bind(this));
    mtoEvents.on("OnTwoPanel", this.onTwoPanelHandler.bind(this));
  }

  _createLessonTitle(parent) {
    this.clPlayerLessonTitle = new mtmPlayerLessonTitle({
      title: "레슨 제목",
    });

    parent.appendChild(this.clPlayerLessonTitle.elThis);
  }

  _createLessonProgress(parent) {
    this.clPlayerLessonProgress = new mtmPlayerLessonProgress({
      items: [],
    });
    parent.appendChild(this.clPlayerLessonProgress.elThis);
  }

  _createLessonPopUp(parent) {
    const options = {};
    this.clMessagePopUp = new mtmStudyMessagePopup(options);
    parent.appendChild(this.clMessagePopUp.elThis);
  }

  _createLessonSubmitAction(parent) {
    const options = {
      items: [
        {
          enable: true,
          text: " 이어하기",
          icon: "fa fa-check",
          btnClass: "mtm-input-button mtm-input-button-c3",
          eventHandler: this.onContinueContentHandler.bind(this),
        },
        {
          enable: true,
          text: " 확인",
          icon: "fa fa-check",
          btnClass: "mtm-input-button mtm-input-button-c3",
          eventHandler: this.onConfirmContentHandler.bind(this),
        },
      ],
    };

    this.clLessonSubmitAction = new mtmStudySubmitAction(options);
    parent.appendChild(this.clLessonSubmitAction.elThis);
    // 초기 상태
    this.clLessonSubmitAction.show(false);
    this.clLessonSubmitAction.setShowList([true, false]);
  }

  _createLessonResultTable(parent) {
    this.clLessonResultTable = new mtmPlayerLessonResultTable({
      mode: this.options.modeStudent,
      eventCellClick: this.onCellClickHandler.bind(this),
    });
    parent.appendChild(this.clLessonResultTable.elThis);

    // 초기 상태
    this.clLessonResultTable.show(false);
  }

  _createLessonQuestion(parent) {
    // 레슨 문제 플레이어
    var options = {};
    options.eventSubmitHandler = this.onQuestionSubmitHandler.bind(this);
    options.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this);
    options.eventNextStepHandler = this.onNextStepHandler.bind(this);
    options.eventConfirmHandler = this.onConfirmHandler.bind(this);
    options.eventSolutionHandler = this.onEventSolutionHandler.bind(this);

    this.clPlayerLessonQuestion = new mtmPlayerLessonQuestion(options);
    parent.appendChild(this.clPlayerLessonQuestion.elThis);
    // 초기 상태
    this.clPlayerLessonQuestion.show(false);
  }

  _createLessonVideo(videoId, videoTime) {
    var options = {};
    var startTime = mtoVideoTime.getTime(videoTime[0]);
    var endTime = mtoVideoTime.getTime(videoTime[1]);
    options.videoId = videoId;
    options.startTime = startTime;
    options.endTime = endTime;
    options.eventVideoHandler = this.onVideoCompleted.bind(this);
    this.clPlayerVideoContent = new mtmPlayerVideoContent(options);
    this.elThis.appendChild(this.clPlayerVideoContent.elThis);
  }

  //////////////////////////////// Utility Functions /////////////////////////
  // 전체 index 를 통해서 unitIndex, itemIndex 를 구함
  _getContentPairIndex(index) {
    // var contentIndex = [0,0];
    var unitIndex = 0;
    var itemIndex = 0;
    var num = 0;
    for (var i = 0; i < this.player.lesson_unit_new.length; i++) {
      if (index >= num + this.player.lesson_unit_new[i].types.length) {
        num += this.player.lesson_unit_new[i].types.length;
        unitIndex++;
      } else break;
    }

    itemIndex = index - num;

    if (this.player.lesson_unit_new.length <= unitIndex) {
      itemIndex = -1;
      unitIndex = -1;
    } else if (this.player.lesson_unit_new[unitIndex].types.length <= itemIndex) {
      itemIndex = -1;
      unitIndex = -1;
    }

    console.log("LessonPlayer > _getContentPairIndex : ", unitIndex, itemIndex);

    return [unitIndex, itemIndex];
  }
  // unitIndex 와 itemIndex 을 통해서 전체 index 를 구함
  _getContentLinearIndex(unitIndex, itemIndex) {
    var num = 0;
    //
    if (this.player.lesson_unit_new.length <= unitIndex) return this.total_content_num - 1;

    for (var i = 0; i < unitIndex; i++) {
      num += this.player.lesson_unit_new[i].types.length;
    }

    num += itemIndex;

    return num;
  }
  _checkProgressPoint() {
    // this.player.total_unit_index = 0;
    this.player.total_item_num = 0;
    this.player.study_item_num = 0;
    this.player.total_question_num = 0;
    this.player.correct_question_num = 0;
    this.player.progress = 0;
    this.player.point = 0;

    for (var i = 0; i < this.player.lesson_unit_new.length; i++) {
      this.player.total_item_num += this.player.lesson_unit_new[i].types.length;

      for (var j = 0; j < this.player.lesson_unit_new[i].types.length; j++) {
        if (this.player.lesson_unit_new[i].types[j] == "q") {
          this.player.total_question_num++;
        }
      }

      if (!this.player.lesson_result_new[i]) this.player.lesson_result_new.push({ result: [], repeat: [] });
      for (var j = 0; j < this.player.lesson_result_new[i].result.length; j++) {
        this.player.study_item_num++;
        if (this.player.lesson_unit_new[i].types[j] == "q" && this.player.lesson_result_new[i].result[j] == "O")
          this.player.correct_question_num++;
      }
    }

    if (this.player.total_item_num > 0)
      this.player.progress = parseInt((this.player.study_item_num * 100) / this.player.total_item_num);
    if (this.player.total_question_num > 0)
      this.player.point = parseInt((this.player.correct_question_num * 100) / this.player.total_question_num);

    console.log(
      "LessonPlayer > _checkProgressPoint : total_item_num = ",
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
  }
  //////////////////////////////// Utility Functions /////////////////////////
  // Show On/Off Functions
  _showPlayer(bShow) {
    if (bShow) {
      if (
        this.player.lesson_unit[this.player.currentUnitIndex].content_list[this.player.currentItemIndex].video == "1"
      ) {
        // Show Video Content
        this.clPlayerLessonQuestion.show(false);
        if (this.clPlayerVideoContent) this.clPlayerVideoContent.show(true);
      } // Show Question Content
      else {
        if (this.clPlayerVideoContent) this.clPlayerVideoContent.show(false);
        this.clPlayerLessonQuestion.show(true);
      }
    } else {
      this.clPlayerLessonQuestion.show(false);
      if (this.clPlayerVideoContent) this.clPlayerVideoContent.show(false);
    }
  }
  _showVideo(bShow) {
    if (bShow) this.clPlayerVideoContent.show(true);
    else this.clPlayerVideoContent.show(false);
  }
  _showQuestion(bShow) {
    if (bShow) this.clPlayerLessonQuestion.show(true);
    else this.clPlayerLessonQuestion.show(false);
  }
  _showResult(bShow) {
    if (bShow) {
      // if(this.options.modeStudent == 1)  // student mode
      this.clLessonSubmitAction.show(true);

      this.clPlayerLessonProgress.show(true);
      // 표를 보여준다.
      // 여기서 무엇을 해야 하나를 선택할 수 있게 한다.
      this.clLessonResultTable.show(true);
    } else {
      this.clLessonSubmitAction.show(false);
      this.clPlayerLessonProgress.show(true);
      // 표를 보여준다.
      // 여기서 무엇을 해야 하나를 선택할 수 있게 한다.
      this.clLessonResultTable.show(false);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  _updateLessonResult(bCorrect) {
    // this.player.currentIndexTotal;
    // this.player.currentItemIndex;
    // this.player.currentUnitIndex;
    var value = "X";
    if (bCorrect) value = "O";

    var itemIdx = this.player.currentItemIndex;
    var unitIdx = this.player.currentUnitIndex;
    // update result
    if (unitIdx < this.player.lesson_result_new.length) {
      // 기존 result : 아직 판단하기 이름
      if (itemIdx < this.player.lesson_result_new[unitIdx].result.length) {
        // 기존 result : 확실
        // 새로운 result
        this.player.lesson_result_new[unitIdx].result[itemIdx] = value;
        this.player.lesson_result_new[unitIdx].repeat[itemIdx]++;
      } else {
        // 새로운 result
        this.player.lesson_result_new[unitIdx].result.push(value);
        this.player.lesson_result_new[unitIdx].repeat.push(1);
      }
    } else {
      // 새로운 result
      var result_data = { result: [], repeat: [] };
      this.player.lesson_result_new.push(result_data);
      this.player.lesson_result_new[unitIdx].result.push(value);
      this.player.lesson_result_new[unitIdx].repeat.push(1);
    }

    if (this.player.currentIndexTotal == this.player.finalIndexTotal) {
      // 자동 플레이로 간다.
      this.player.autoPlay = true;
    }
    // Todo. Jstar Bug. Fixed . 새로운 학습 혹은 기존의 review
    this._checkProgressPoint();

    var eData = {};
    eData.content_id = this.player.content_id;
    eData.student_id = this.player.student_id;
    eData.course_id = this.player.course_id;
    eData.course_id = this.player.course_id;
    eData.class_id = this.player.class_id;
    eData.results = this.player.lesson_result_new;
    eData.progress = this.player.progress;
    eData.point = this.player.point;

    // mtoEvents.emit('OnUpdateLessonResult',eData);
    this._urlUpdateLessonResultInfo();

    // 아래 두개는 같은 기능의 코드
    this.infoResult = this.clLessonResultTable.setLessonResultList(
      this.player.lesson_unit_new,
      this.player.lesson_result_new,
    );
  }
  // this.player.lesson_content_new : content detail
  // [
  //  [{v},{q},{q}],  unit
  //  [{v},{q},{q}],  unit
  //  [{v},{q},{q}],  unit
  // ]
  // this.player.lesson_unit_new : Unit
  // contents : [
  //  [v,q,q],  unit
  //  [v,q,q],  unit
  //  [v,q,q],  unit
  // ]
  // types : [
  //  [v,q,q],  unit
  //  [v,q,q],  unit
  //  [v,q,q],  unit
  // ]
  // this.player.lesson_result_new : Result
  //
  // Content Detail 과 Unit 과 Result 를 통하여
  // 1) 마지막 play content 의 unit index , item index , total index
  // 2)
  _prepareResult() {
    this.player.finalIndexTotal = 0;
    this.player.finalUnitIndex = 0;
    this.player.finalItemIndex = 0;

    this.player.finalProcessIndex = 0;

    if (this.player.lesson_result_new.length == 0) {
      this.player.finalProcessIndex = -1;
    }

    // 정답 문제 갯수
    this.total_correct_question_num = 0;
    this.total_question_num = 0;

    this.infoResult = this.clLessonResultTable.setLessonResultList(
      this.player.lesson_unit_new,
      this.player.lesson_result_new,
    );
    this.player.finalUnitIndex = this.infoResult.iLastIndexUnit;
    this.player.finalItemIndex = this.infoResult.iLastIndexItem;
  }

  _prepareTitle(title) {
    this.clPlayerLessonTitle.setTitle(title);
  }

  _prepareProgress() {
    this.player.finalIndicatorTotal = [];

    for (var i = 0; i < this.player.lesson_unit_new.length; i++) {
      for (var j = 0; j < this.player.lesson_unit_new[i].types.length; j++) {
        // if (j > LessonPlayer.UnitMaxQNum) break;
        if (this.player.lesson_unit_new[i].types[j] == "v") this.player.finalIndicatorTotal.push(0); // video
        else this.player.finalIndicatorTotal.push(1); // question
      }
    }

    this.player.finalIndexTotal = this._getContentLinearIndex(this.player.finalUnitIndex, this.player.finalItemIndex);
    this.player.currentIndexTotal = this.player.finalIndexTotal;
    console.log("LessonPlayer > _prepareProgress : ", this.player);

    this.clPlayerLessonProgress.setProgressContent(this.player.finalIndicatorTotal, 1);
    this.clPlayerLessonProgress.setActive(this.player.finalIndexTotal);
  }

  _wrongStep() {
    // Study Result Update 조정
    this._updateLessonResult(false);

    this.clPlayerLessonQuestion.setMark(false);

    var rc = this.player.lesson_result_new[this.player.currentUnitIndex].repeat[this.player.currentItemIndex];
    // console.log('LessonPlayer > _wrongStep 1: ',this.player.current_rc_list,rc,this.player.currentItemIndex);
    // var rc = 0;
    if (rc > 1) {
      // 오답하기/다음하기
      this.clPlayerLessonQuestion.setShowSubmitList([false, true, true, false]);
      // 해답/해설 보기...
      this.clPlayerLessonQuestion.showSolution(true);
    } else {
      this.clPlayerLessonQuestion.setShowSubmitList([false, true, false, false]);
      // 해답/해설 보기...
      // this.clPlayerLessonQuestion.showSolution(false);
    }

    return;
  }

  _continueStep() {
    // console.log('LessonPlayer > _continueStep', this.player.currentUnitIndex, this.player.currentItemIndex);
    var contentPairIndex = this._getContentPairIndex(this.player.currentIndexTotal + 1);

    console.log("LessonPlayer > _continueStep", contentPairIndex);
    // console.log('LessonPlayer > _continueStep',this.player.currentIndexTotal,this.player.finalIndexTotal);
    if (this.player.currentIndexTotal < this.player.finalIndexTotal || contentPairIndex[0] == -1) {
      // lesson completed !!!
      // 이어하기 없애기
      this._showPlayer(false);
      this._showResult(true);
      return;
    }

    this.player.currentUnitIndex = contentPairIndex[0];
    this.player.currentItemIndex = contentPairIndex[1];

    this.player.currentIndexTotal = this._getContentLinearIndex(
      this.player.currentUnitIndex,
      this.player.currentItemIndex,
    );
    if (this.player.finalIndexTotal < this.player.currentIndexTotal)
      this.player.finalIndexTotal = this.player.currentIndexTotal;
    this._playLessonContent();
    return;
  }

  _correctStep() {
    // Study Result Update 조정
    this._updateLessonResult(true);
    //
    this.clPlayerLessonQuestion.setMark(true);
    // "다음하기"만 보여 준다.
    this.clPlayerLessonQuestion.setShowSubmitList([false, false, true, false]);
    this.clPlayerLessonQuestion.showSolution(true);
    return;
  }

  _questionSubmitLesson() {
    //
    // 답을 더는 못한다.
    this.clPlayerLessonQuestion.setAnswerEnable(false);
    // 분명히 문제 이어야만 한다.
    if (this.player.lesson_unit_new[this.player.currentUnitIndex].types[this.player.currentItemIndex] == "q") {
      var answer = this.player.lesson_content_new[this.player.currentUnitIndex][this.player.currentItemIndex].answer;

      // 사라지기 전에, (display == none) 하기 전에
      // Exam 에서 무슨 문제가 있을까?
      var value = this.clPlayerLessonQuestion.getAnswer();
      console.log("LessonPlayer > _questionSubmitLesson : answer = ", answer, " , value =", value);
      if (answer == value) this._correctStep();
      else this._wrongStep();
    }
  }

  _videoContinueLesson() {
    // 이게 어떤 종류의 Video Play 인지 ?
    if (this.player.bSolutionPlay) {
      console.log("LessonPlayer > _videoContinueLesson : this.player.bSolutionPlay");
      this.player.bSolutionPlay = false;
      this.stopLesson();
      this._showVideo(false);
      this._showQuestion(true);
    }

    // 순차적인 Video Content Play 인가?
    else if (this.player.finalIndexTotal == this.player.currentIndexTotal) {
      console.log("LessonPlayer > _videoContinueLesson : this.player.finalIndexTotal == this.player.currentIndexTotal");
      console.log("this.player.currentUnitIndex", this.player.currentUnitIndex);
      console.log("this.player.currentItemIndex", this.player.currentItemIndex);
      // 단계 진행
      this.total_progress_num++;
      // this.player.currentIndexTotal++;
      this._updateLessonResult(true);
      this._continueStep();
    } else {
      console.log("LessonPlayer > _videoContinueLesson :", this.player.finalIndexTotal, this.player.currentIndexTotal);

      this._showVideo(false);
      this._showResult(true);
    }
  }

  _startVideo() {
    console.log("LessonPlayer > _startVideo : ", this.player);

    this.clLessonSubmitAction.show(false);
    this.clPlayerLessonQuestion.show(false);
    this.clLessonResultTable.show(false);

    if (!this.clPlayerVideoContent) this._createLessonVideo(this.player.videoId, this.player.videoTime);

    this.clPlayerVideoContent.play(this.player.videoId, this.player.videoTime);

    this.clPlayerVideoContent.show(true);

    // 최종 Progress 와 현재 Progress 를 차별화 해야 되겠다.
    this.clPlayerLessonProgress.setActive(this.player.finalIndexTotal);
  }

  _beforeStartQuestion() {
    // Hide Others
    if (this.clPlayerVideoContent) this.clPlayerVideoContent.show(false);
    this.clLessonResultTable.show(false);
    this.clLessonSubmitAction.show(false);
  }
  _startQuestion() {
    this._beforeStartQuestion();
    // 문제 번호 만들기  1-1, 1-2, ...
    var no = this.player.currentUnitIndex + 1 + "-";

    if (this.player.lesson_unit_new[this.player.currentUnitIndex].types[0] == "v")
      no += this.player.currentItemIndex; // 대부분은 이곳 으로
    else no += this.player.currentItemIndex + 1;

    // lesson_content_list_new
    // this.player.lesson_content_new : content detail
    // [
    //  [{v},{q},{q}],  unit
    //  [{v},{q},{q}],  unit
    //  [{v},{q},{q}],  unit
    // ]
    // this.player.lesson_unit_new : Unit
    // contents : [
    //  [v,q,q],  unit
    //  [v,q,q],  unit
    //  [v,q,q],  unit
    // ]
    // types : [
    //  [v,q,q],  unit
    //  [v,q,q],  unit
    //  [v,q,q],  unit
    // ]
    var q_item = this.player.lesson_content_new[this.player.currentUnitIndex][this.player.currentItemIndex];

    // 'video': '0',
    // 'id':str(questionAtom.id.hex), # uuid exclude '-'
    // 'content' : questionAtom.content,
    // "style": questionAtom.style,
    // "level": questionAtom.level,
    // "answer":questionAtom.answer,
    // "solution_id": questionAtom.sol_text,
    // "video_id": questionAtom.sol_video,
    // "sol_video":sol_video, // array - 멀티
    // "sol_text":sol_text,   // array - 멀티
    this.player.question_item = {
      no: no,
      content: q_item.content,
      id: q_item.id,
      style: q_item.style,
      level: q_item.level,
      answer: q_item.answer,
      // only text solution id
      solution_id: q_item.solution_id,
      // only video solution id
      video_id: q_item.video_id,
      // multi video solution
      // sol_video : q_item.sol_video,
      // 'url':video_solution.url,
      // 'title':video_solution.title,
      // 'time':video_solution.time,
      // multi text solution
      // sol_text : q_item.sol_text,
      // 'content' : sol_text.content,
      //
    };

    // 문제를 셋팅한다.
    this.clPlayerLessonQuestion.setQuestion(this.player.question_item);
    this.player.solution_item = {
      // multi video solution
      sol_video: q_item.sol_video,
      // 'url':video_solution.url,
      // 'title':video_solution.title,
      // 'time':video_solution.time,
      // multi text solution
      sol_text: q_item.sol_text,
      // 'content' : sol_text.content,
      //
    };

    this.clPlayerLessonQuestion.setSolution(this.player.solution_item);

    this.clPlayerLessonQuestion.showMark(false); // 이문제는 새로풀어야 하고,
    this.clPlayerLessonQuestion.setAnswer("");
    this.clPlayerLessonQuestion.showSolution(false);
    // 답을 할 수 있게 한다.
    this.clPlayerLessonQuestion.setAnswerEnable(true);

    var qr = this.player.lesson_result_new[this.player.currentUnitIndex].result[this.player.currentItemIndex];
    var rc = this.player.lesson_result_new[this.player.currentUnitIndex].repeat[this.player.currentItemIndex];

    if (qr == "O") {
      // console.log('LessonPlayer > _startQuestion qr == O');
      this.clPlayerLessonQuestion.setMark(true); // 이문제는 맞췄고,
      this.clPlayerLessonQuestion.setAnswer(q_item.answer); // 정답으로 셋팅한다.
      this.clPlayerLessonQuestion.showSolution(true); // 해설을 볼수 있고,

      // 제출 , 오답 하기 , 다음 하기 , 확인 (확인)
      this.clPlayerLessonQuestion.setShowSubmitList([false, false, false, true]); // 확인 Action 만...
      this.clPlayerLessonQuestion.setAnswerEnable(false); // 답을 할 수 없고,
    } else {
      // console.log('LessonPlayer > _startQuestion else');
      // 제출 , 오답 하기 , 다음 하기 , 확인 (제출)
      this.clPlayerLessonQuestion.setShowSubmitList([true, false, false, false]);
    }

    this.clPlayerLessonQuestion.show(true);

    // 최종 Progress 와 현재 Progress 를 차별화 해야 되겠다.
    this.clPlayerLessonProgress.setActive(this.player.finalIndexTotal);
  }

  _playLessonContent() {
    console.log("LessonPlayer > _playLessonContent :", this.player.currentUnitIndex, this.player.currentItemIndex);
    if (this.player.lesson_content_new[this.player.currentUnitIndex].length > 0) {
      // console.log('LessonPlayer > _playLessonContent : ',this.player.lesson_unit[this.player.currentUnitIndex].content_list);
      if (this.player.lesson_content_new[this.player.currentUnitIndex][this.player.currentItemIndex].video == "1") {
        this.player.videoTime =
          this.player.lesson_content_new[this.player.currentUnitIndex][this.player.currentItemIndex].time;
        this.player.videoId =
          this.player.lesson_content_new[this.player.currentUnitIndex][this.player.currentItemIndex].url;
        this.player.bSolutionPlay = false;
        this._startVideo();
      } else {
        this._startQuestion();
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////
  /////////////////////////////// Handler ////////////////////////////////
  onOnePanelHandler() {
    console.log("LessonPlayer > onOnePanelHandler");
    // this.elExitButton.style.display = '';
  }
  onTwoPanelHandler() {
    console.log("LessonPlayer > onTwoPanelHandler");
    // this.elExitButton.style.display = 'none';
  }

  onVideoCompleted() {
    console.log("LessonPlayer : onVideoCompleted");
    // Todo. Jstar. onVideoCompleted 이중 발생
    // Todo. Jstar. 이것 말고도 iPAD or iOS 에서 Lesson 이 사라 졌는데,
    // Sound 가 나오는 현상(Backgoround Play)이 있다.
    if (this.clPlayerVideoContent && this.clPlayerVideoContent.bShow)
      setTimeout(this._videoContinueLesson.bind(this), 0);
    else console.log("LessonPlayer : onVideoCompleted --- abnormal");
  }
  // Question Card 에서 "제출" 버튼
  // 문제의 답을 제출 했을때...
  onQuestionSubmitHandler() {
    setTimeout(this._questionSubmitLesson.bind(this), 0);
  }
  // Question Card 에서 "오답하기" 버튼
  onCorrectWrongHandler() {
    // console.log('LessonPlayer : onCorrectWrongHandler');
    this._playLessonContent();
  }

  onContinueContentHandler() {
    // 이어하기가 가능 하면...
    if (this.infoResult.bContinue) {
      this.player.currentIndexTotal = this._getContentLinearIndex(
        this.infoResult.iContiIndexUnit,
        this.infoResult.iContiIndexItem,
      );

      this.player.currentUnitIndex = this.infoResult.iContiIndexUnit;
      this.player.currentItemIndex = this.infoResult.iContiIndexItem;

      this.player.finalIndexTotal = this.player.currentIndexTotal;

      this._playLessonContent();
    }
  }
  onConfirmContentHandler() {}
  onNextStepHandler() {
    console.log("LessonPlayer > onNextStepHandler : ");
    this._continueStep();
  }
  onConfirmHandler() {
    console.log("LessonPlayer > onConfirmHandler : ");
    // this._continueStep();
    this._showPlayer(false);
    this._showResult(true);
  }
  onEventSolutionHandler(eData) {
    console.log("LessonPlayer > onEventSolutionHandler : ", eData);
    this.player.videoId = eData.videoId;
    this.player.videoTime = eData.time;
    this.player.bSolutionPlay = true;
    this._startVideo();
    // this.clPlayerVideoContent
  }
  onUnseenVideoClickHandler(tX, tY, value) {
    if (this.options.modeStudent)
      // 학생 모드
      return;
    console.log("LessonPlayer > onUnseenVideoClickHandler :", tX, tY, value);

    var index = this._getContentLinearIndex(tY, tX);
    // 범위를 벗어나면 땡 !
    if (tY >= this.player.lesson_unit.length) return;
    if (tX >= this.player.lesson_unit[tY].content_list.length) return;
    if (this.player.lesson_unit[tY].content_list[tX].video == "1") {
      // 선생님이 안 본 비디오(Unseen Video)를
      // 본 비디오 (Seen Video) 로 교체 할 수 있음.
      console.log("LessonPlayer > onUnseenVideoClickHandler : ", index);
    }
  }
  // Lesson 결과 Table 을 Click 했을때, 적절한 해당 기능을 한다.
  onCellClickHandler(tX, tY, value) {
    console.log("LessonPlayer > onCellClickHandler : ", tX, tY, value);

    this.player.currentIndexTotal = this._getContentLinearIndex(tY, tX);

    if (tY >= this.player.lesson_unit_new.length) return;
    if (tX >= this.player.lesson_unit_new[tY].types.length) return;

    // 비디오 // 이미 본 비디오 ? 안 본 비디오
    if (this.player.lesson_unit_new[tY].types[tX] == "v") {
      // video
      this.player.currentUnitIndex = tY;
      this.player.currentItemIndex = tX;

      // 이미 본 비디오 ? 아직 안 본 비디오 ?
      if (this.player.currentIndexTotal > this.player.finalIndexTotal)
        this.player.finalIndexTotal = this.player.currentIndexTotal;
    } else if (value == "?") {
      // 아직 안한 레슨 문제
      this.player.currentUnitIndex = tY;
      this.player.currentItemIndex = tX;
      this.player.finalIndexTotal = this.player.currentIndexTotal;
    } else if (value == "O") {
      // 이미 맞춘 레슨 문제
      this.player.currentUnitIndex = tY;
      this.player.currentItemIndex = tX;
    } else if (value == "X") {
      // 이미 틀린 레슨 문제
      this.player.currentUnitIndex = tY;
      this.player.currentItemIndex = tX;
    }
    this._playLessonContent();
  }
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// API /////////////////////////////////
  setPlayOptions(options) {
    this.playOptions = options;

    this.player.student_id = this.playOptions.student_id;
    this.player.class_id = this.playOptions.class_id;
    this.player.course_id = this.playOptions.course_id;
    this.player.clinic_id = this.playOptions.clinic_id;

    this.player.content_id = this.playOptions.content_id;
    this.player.content_type = this.playOptions.content_type;
    this.player.course_type = this.playOptions.course_type;
    if (this.player.course_type == 0) this.player.clinic_id = this.player.course_id;
    // prepare Data
    // this._prepareLessonDataNew(eData);
    this.player.lesson_unit_new = this.playOptions.units;
    this.player.lesson_content_new = this.playOptions.content_list;
    this.player.lesson_result_new = this.playOptions.results;

    console.log("LessonPlayer.>.setPlayOptions :", this.player.lesson_result_new);
    // prepare Title
    this._prepareTitle(this.playOptions.title);

    // prepare Result
    this._prepareResult();

    // prepare Progress
    this._prepareProgress();
  }
  startLesson() {
    this.player.bSolutionPlay = false;
    console.log(this.player.lesson_unit_new);
    if (this.player.lesson_unit_new.length == 0) return;

    // 가장 최근에 한 작업
    if (this.player.finalProcessIndex == -1 && this.options.modeStudent) {
      // and student mode
      console.log("LessonPlayer > startLesson (new Start): ", this.player.finalProcessIndex);
      // 테스트를 처음하는 것...
      this.player.currentProcessIndex = 0;

      // Lesson Progress 는 보여준다.
      // this._prepareLessonProgressNew();
      // 레슨을 시작한다.
      // this._continueLessonContent();
      this.player.currentUnitIndex = this.player.finalUnitIndex;
      this.player.currentItemIndex = this.player.finalItemIndex;

      // this.clLessonResultTable.show(false);
      this._playLessonContent();
    } else {
      console.log("LessonPlayer > startLesson (old Start) : ", this.player.finalProcessIndex);

      // Lesson Player 는 감춘다.
      this._showPlayer(false);

      // 조건을 보고 Show on/off 를 결정
      // if(this.options.modeStudent == 1)  // student mode
      this.clLessonSubmitAction.show(true);
      this.clPlayerLessonProgress.show(true);
      // 표를 보여준다.
      // 여기서 무엇을 해야 하나를 선택할 수 있게 한다.
      this.clLessonResultTable.show(true);
    }
    return;
  }
  show(bShow) {
    if (bShow) this.elThis.style.display = "block";
    else this.elThis.style.display = "none";
  }
  stopLesson() {
    //
    this.player.bSolutionPlay = false;
    if (this.clPlayerVideoContent) this.clPlayerVideoContent.stop();
  }
  // eData.contentunit_list
  // eData.contentresult_list
  ///////////////////////// 나중에 하나의 Video Player 로 운용하기 위한 API //////////////
  removePlayerVideo() {
    if (this.clPlayerVideo) {
      this.elThis.removeChild(this.clPlayerVideo.elThis);
      this.clPlayerVideo = null;
    }
  }
  // 기능이 없네....
  requestPlayerVideo() {
    if (this.options && this.options.requestPlayerVideo) return this.options.requestPlayerVideo();

    return null;
  }
  setOptionInfo(data) {
    this.player.student_id = data.student_id;
    this.player.class_id = data.class_id;
    this.player.course_id = data.course_id;
    this.player.content_id = data.content_id;
    this.player.content_type = data.type;
  }
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// URL //////////////////////////////////
  _aurlUpdateLessonResultInfo(result) {
    if (!this.options.modeStudent)
      // no student
      this.options.onSkipContent = false;
  }
  _urlUpdateLessonResultInfo() {
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
    formData.append("properties", JSON.stringify(this.player.lesson_result_new));

    console.log(
      "LessonPlayer > _urlUpdateLessonResultInfo : ",
      this.player.student_id,
      this.player.class_id,
      this.player.course_id,
      this.player.clinic_id,
      this.player.content_id,
      this.player.content_type,
      this.player.course_type,
      this.player.lesson_result_new,
    );

    formData.append("progress", this.player.progress);
    formData.append("point", this.player.point);
    var eData = {};
    eData.progress = this.player.progress;
    eData.point = this.player.point;
    eData.content_id = this.player.content_id;
    // Update Study Container Panel
    mtoEvents.emit("OnChangeProgressPoint", eData);

    var url = "/st/updatestudyresultinfo/";
    // var url = "/st/updatelessonresultinfo/";
    $.ajax({
      url: url,
      data: formData,
      processData: false,
      contentType: false,
      method: "POST",
      type: "POST",
      cache: false,

      success: function (res) {
        self._aurlUpdateLessonResultInfo(res.result);
      },
      error: function () {
        // window.location.href = "/";
      },
    }); // end of ajax
  }
}

LessonPlayer.id = 0;
