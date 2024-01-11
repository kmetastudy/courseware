import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";
import { mtoCalendar } from "../../../core/utils/mto-calendar.js";
import { mtmPlayerTestumQuestion } from "./mtm-player-testum-question.js";
import { mtmElapseTimer } from "../../../core/ui/output/mtm-elapse-timer.js";
import { mtmExamInformationCard } from "./mtm-exam-information-card.js";

require("../../../../css/pages/st/testum/mtm-player-testum-viewer.css");
export class mtmPlayerTestumViewer {
  constructor(options) {
    this.id = "id-mtm-player-testum-viewer-" + mtmPlayerTestumViewer.id++;

    this.elThis = null;
    this.options = options;

    this.slides = [];
    this.infoslides = [];
    this.qCards = [];

    this.activeIndex = -1;
    this._init();
  }

  _initSwiperInformation() {
    this.SwiperInformation = new Swiper(this.elSwiperInformation, {
      autoHeight: true,
      slidesPerView: 1,
      threshold: 10,
      centeredSlides: true,
      spaceBetween: 50,
    });
    this.SwiperInformation.on("activeIndexChange", this.onChangeActiveIndex.bind(this));
  }

  _initSwiperQuestion() {
    this.SwiperQuestion = new Swiper(this.elSwiperQuestion, {
      autoHeight: true,
      slidesPerView: 1,
      // Threshold value in px. If "touch distance" will be lower
      // than this value then swiper will not move
      threshold: 10,
      // MouseWheel
      // thresholdDelta : 10,
      // thresholdTime : 10,
      // slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 50,
    });
    this.SwiperQuestion.on("activeIndexChange", this.onChangeActiveIndex.bind(this));
  }

  _addSwiperInformation() {
    var slide = mtoElementBuilder.createComponent(mtmPlayerTestumViewer.staticSlide);
    var options = {};
    options.eventTimerClick = this.onTimerClickHandler.bind(this);
    options.eventRemainEndHandler = this.onRemainEndHandler.bind(this);
    this.clInformationCard = new mtmExamInformationCard(options);
    slide.appendChild(this.clInformationCard.elThis);

    this.SwiperInformation.appendSlide(slide);
    this.infoslides.push(slide);
  }

  _addSwiperQuestion() {
    this.options.eventAnswerChangeHandler = this.onAnswerChangeHandler.bind(this);
    this.qCards = [];
    for (var i = 0; i < this.options.items.length; i++) {
      var slide = mtoElementBuilder.createComponent(mtmPlayerTestumViewer.staticSlide);
      // list 값의 의미 : 0 == 문제 제외, 1 == 일괄제출 문제.
      //                  2 == 한 문제씩 제출 가능, 4 == 풀이 보기 가능
      //                  8 == 정답 문제 보기
      // 여러가지 기능을 넣어야 한다.
      // 1) 풀이/정답를 보여줄 것인가?
      // 1-1) Text 풀이
      // 1-2) Video 풀이
      // 2) 단독 제출 가능한가?
      // 3) 채점 마크 표시 및 사용자 답 표시 읽기 모드
      //
      // 여러가지 Display Option 을 가지고 있나?
      // if(this.options.items[i].display_option && this.options.items[i].display_option > 0)
      //
      // bSubmitAction 설정
      // if(i%2 == 0)
      //     this.options.items[i].bSubmitAction = false;
      // else
      //     this.options.items[i].bSubmitAction = true;
      // '테스트' 냐 ? '레슨' 이냐?
      // this.options.items[i].type = 0;
      this.options.items[i].eventSolutionHandler = this.onEventSolutionHandler.bind(this);
      this.options.items[i].eventSubmitHandler = this.onEventSubmitHandler.bind(this);
      this.options.items[i].eventConfirmHandler = this.onEventConfirmHandler.bind(this);
      // this.options.items[i].submitList = [1,0,0];
      // slide.appendChild(cl.elThis);
      // this.qCards.push(cl);
      // console.log('mtmPlayerTestumViewer > _addSwiperQuestion : ',this.options.items[i]);
      var tq = new mtmPlayerTestumQuestion(this.options.items[i]);
      slide.appendChild(tq.elThis);
      this.qCards.push(tq);

      // this.elWrapperQuestion.appendChild(slide);
      this.SwiperQuestion.appendSlide(slide);
      this.slides.push(slide);
    }
  }

  _clearSwiperInformation() {
    for (var i = 0; i < this.infoslides.length; i++) {
      var slide = this.infoslides[i];
      this.SwiperInformation.removeSlide(slide);
    }
    this.SwiperInformation.removeAllSlides();
    this.SwiperInformation.update();

    this.infoslides = [];
    // this.questions = [];
    // this.options.items = [];
    // this.qCards = [];
  }

  _clearSwiperQuestion() {
    for (var i = 0; i < this.slides.length; i++) {
      var slide = this.slides[i];
      // this.SwiperQuestion.removeSlide(slide);
    }
    this.SwiperQuestion.removeAllSlides();
    this.SwiperQuestion.update();

    this.slides = [];
    this.questions = [];
    this.options.items = [];
    this.qCards = [];
  }

  _initInformation() {
    this.elInformationViewer = document.createElement("div");

    this.elFlexExamInformation = document.createElement("div");
    this.elFlexExamInformation.setAttribute("class", "mtm-player-testum-viewer-information");
    this.elFlexExamInformation.setAttribute("id", "id-mtm-exam-information-swiper-" + mtmPlayerTestumViewer.id);

    this.elSwiperInformation = document.createElement("div");
    this.elSwiperInformation.setAttribute("class", "mtm-player-testum-viewer-information-swiper");

    this.elWrapperInformation = document.createElement("div");
    this.elWrapperInformation.setAttribute("class", "swiper-wrapper");
    this.elSwiperInformation.appendChild(this.elWrapperInformation);
    // this.elSwiperInformation.style.backgroundColor = 'rgb(125,255,255,5)';
    this.elFlexExamInformation.appendChild(this.elSwiperInformation);

    // this.elFlexExamInformation.style.display = 'none';
    this.elInformationViewer.append(this.elFlexExamInformation);
    // this.elInformationViewer.style.display = 'none';
    this.elThis.appendChild(this.elInformationViewer);
    this._initSwiperInformation();
    this._addSwiperInformation();
  }
  _initQuestion() {
    this.elQuestionViewer = document.createElement("div");
    this.elThis.appendChild(this.elQuestionViewer);

    this.elFlexbox = document.createElement("div");
    this.elFlexbox.setAttribute("class", "mtm-player-testum-viewer-flexbox");
    this.elFlexbox.setAttribute("id", "id-mtm-question-swiper-" + mtmPlayerTestumViewer.id);
    this.elQuestionViewer.append(this.elFlexbox);

    this.elSwiperQuestion = document.createElement("div");
    this.elSwiperQuestion.setAttribute("class", "mtm-player-testum-viewer-swiper-question swiper-container");
    this.elFlexbox.appendChild(this.elSwiperQuestion);

    this.elWrapperQuestion = document.createElement("div");
    this.elWrapperQuestion.setAttribute("class", "swiper-wrapper");
    this.elSwiperQuestion.appendChild(this.elWrapperQuestion);

    this.elQuestionViewer.style.display = "none";
    this._initSwiperQuestion();
    this._addSwiperQuestion();
  }

  _init() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);
    this.elThis.style.position = "relative";

    this._initQuestion();
    this._initInformation();

    var timer_options = {
      enable: true,
      text: " 00:00:00",
      iClass: "fa-regular fa-clock",
      // eventClickHandler:this.options.eventTimerHandler,
      // 여기에 문제가 있어서, 아이들이 피해를 보았군요.
      // eventTimeOutHandler:this.options.eventTimeOutHandler.bind(this),
      eventTimeOutHandler: this.options.eventTimeOutHandler,
      position: {
        position: "absolute",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "10",
      },
    };

    this.clElapseTimer = new mtmElapseTimer(timer_options);
    this.elThis.appendChild(this.clElapseTimer.elThis);
  }

  _timeBeforeDate() {
    // 시험일이 아직 아님..
    this.clInformationCard.setTitle("아직 평가 일자가 아닙니다.");
    this.clInformationCard.showDescription(false);
    this.clInformationCard.showActionTitle(false);

    this.clInformationCard.showAnanlogClock(true);
    this.clInformationCard.showDigitalClock(false);
  }

  _timePassDate() {
    // 시험일이 지남...
    this.clInformationCard.setTitle("기다리는 평가입니다.");
    this.clInformationCard.setDescription("빨리 시작하세요.");

    var action = {};
    action.text = "평가 시작하기";
    action.iClass = "fa fa-check";
    this.clInformationCard.setActionTitle(action);

    this.clInformationCard.showDescription(true);
    this.clInformationCard.showActionTitle(true);

    this.clInformationCard.showAnanlogClock(true);
    this.clInformationCard.showDigitalClock(false);
  }

  _timePassTime() {
    this.clInformationCard.setTitle("기다리는 평가입니다.");
    this.clInformationCard.setDescription("빨리 시작하세요.");

    var action = {};
    action.text = "평가 시작하기";
    action.iClass = "fa fa-check";
    this.clInformationCard.setActionTitle(action);

    this.clInformationCard.showDescription(true);
    this.clInformationCard.showActionTitle(true);

    this.clInformationCard.showAnanlogClock(true);
    this.clInformationCard.showDigitalClock(false);
  }

  _timeAlready(exam_time, now_time) {
    console.log("mtmPlayerTestumViewer > _timeAlready : ");

    this.clInformationCard.setTitle("기다리는 평가입니다.");
    this.clInformationCard.setDescription("빨리 시작하세요.");

    var action = {};
    action.text = "평가 시작하기";
    action.iClass = "fa fa-check";
    this.clInformationCard.setActionTitle(action);

    this.clInformationCard.showDescription(true);
    this.clInformationCard.showActionTitle(true);

    this.clInformationCard.showAnanlogClock(true);
    this.clInformationCard.showDigitalClock(false);
  }

  _timeReady(exam_time, now_time) {
    this.clInformationCard.setTitle("아직 평가 시간이 아닙니다.");
    this.clInformationCard.setDescription("남은 시간");

    var options = {};
    options.type = 1;
    options.time = exam_time;
    this.clInformationCard.setRemainClock(options);
    this.clInformationCard.showDescription(true);
    this.clInformationCard.showActionTitle(true);

    this.clInformationCard.showAnanlogClock(true);
    this.clInformationCard.showDigitalClock(false);
  }

  _timeNotEnd(end_time) {
    this.clInformationCard.setTitle("아직 평가 시간이 남았습니다.");
    this.clInformationCard.setDescription("계속 하시겠습니까?");

    var action = {};
    action.text = "평가 계속하기";
    action.iClass = "fa fa-check";
    this.clInformationCard.setActionTitle(action);

    this.clInformationCard.showDescription(true);
    this.clInformationCard.showActionTitle(true);

    this.clInformationCard.showAnanlogClock(false);
    this.clInformationCard.setDigitalClockCountDown(end_time);
    this.clInformationCard.showDigitalClock(true);
  }

  _timeEnd() {
    this.clInformationCard.setTitle("평가 시간이 끝났습니다.");
    this.clInformationCard.setDescription("결과를 확인 하시겠습니까?");

    var action = {};
    action.text = "결과 확인하기";
    action.iClass = "fa fa-check";
    this.clInformationCard.setActionTitle(action);

    this.clInformationCard.showDescription(true);
    this.clInformationCard.showActionTitle(true);

    this.clInformationCard.showAnanlogClock(false);
    // var now = new Date();
    // var end_time = parseInt(now.getTime()/1000);
    this.clInformationCard.setDigitalClock(0);
    this.clInformationCard.showDigitalClock(true);
  }
  ///////////////////////// Event Handler //////////////////////////////////
  onAnswerChangeHandler(eData) {
    console.log("mtmPlayerTestumViewer > onAnswerChangeHandler : ", eData);
  }
  onRemainEndHandler() {
    console.log("mtmPlayerTestumViewer > onRemainEndHandler : ");

    if (this.options && this.options.eventExamEndHandler) this.options.eventExamEndHandler();
  }
  onTimerClickHandler() {
    console.log("mtmPlayerTestumViewer > onTimerClickHandler : ");
    this.elInformationViewer.style.display = "none";
    this.elQuestionViewer.style.display = "";
    if (this.options && this.options.eventExamStartHandler) this.options.eventExamStartHandler();
  }
  onChangeActiveIndex() {
    if (this.options && this.options.eventActiveIndexChangeHandler)
      this.options.eventActiveIndexChangeHandler(this.SwiperQuestion.activeIndex);
  }
  onEventSolutionHandler(eData) {
    console.log("mtmPlayerTestumViewer > onEventSolutionHandler : ", eData);
    if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
  }
  onEventSubmitHandler(eData) {
    // console.log('mtmPlayerTestumViewer > onEventSubmitHandler : ', eData);
    if (this.options && this.options.eventSubmitHandler) this.options.eventSubmitHandler(eData);
  }
  onEventConfirmHandler() {
    // console.log('mtmPlayerTestumViewer > onEventConfirmHandler : ');
    if (this.options && this.options.eventConfirmHandler) this.options.eventConfirmHandler();
  }
  ///////////////////// API ///////////////////////////////////////
  show(bShow) {
    if (bShow) this.elThis.style.display = "block";
    else this.elThis.style.display = "none";
  }
  setTestumContent(items) {
    this._clearSwiperQuestion();
    this.options.items = items;
    this._addSwiperQuestion();
  }
  setQuestionIndex(index) {
    this.SwiperQuestion.slideTo(index);
  }
  getAnswer(index) {
    if (this.qCards.length < index + 1) return "";

    // var cl = this.qCards[index];
    // return  cl.getAnswer();
    var tq = this.qCards[index];
    return tq.getAnswer();
  }
  getPoint(index) {
    if (this.qCards.length < index + 1) return "";

    // var cl = this.qCards[index];
    // return  cl.getAnswer();
    var tq = this.qCards[index];
    return tq.getPoint();
  }
  setAnswer(index, value) {
    if (this.qCards.length < index + 1) return;

    // var cl = this.qCards[index];
    // return  cl.getAnswer();
    var tq = this.qCards[index];
    // return  tq.getAnswer();
    tq.setAnswer(value);
  }
  setMark(index, bCorrect) {
    var tq = this.qCards[index];
    if (!tq) return;

    tq.setMark(bCorrect);
    tq.setAnswerEnable(false);
  }
  setWidth(width) {
    // this.elSwiperQuestion.style.minWidth = "470px";
    this.elSwiperQuestion.style.minWidth = width;
  }
  timerStart() {
    this.clElapseTimer.start();
  }
  timerReset() {
    this.clElapseTimer.reset();
  }
  timerStop() {
    this.clElapseTimer.stop();
  }
  showElapseTimer(bShow) {
    this.clElapseTimer.reset();
    this.clElapseTimer.show(bShow);
    this.clElapseTimer.start();
  }
  // 평가에 관련된 정보를 보여준다.
  showInformation(bShow) {
    if (bShow) {
      // this.clInformationCard.setNewInformation();
      this.elInformationViewer.style.display = "";
    } else this.elInformationViewer.style.display = "none";
  }
  showTestum(bShow) {
    if (bShow) this.elQuestionViewer.style.display = "";
    else this.elQuestionViewer.style.display = "none";
  }
  setCountUpTimer(time) {
    var options = {};
    options.type = 0;
    options.time = time;
    this.clElapseTimer.setOptions(options);
    this.clElapseTimer.start();
    this.clElapseTimer.show(true);
  }
  setCountDownTimer(time) {
    var options = {};
    options.type = 1;
    options.time = time;
    this.clElapseTimer.setOptions(options);
    this.clElapseTimer.start();
    this.clElapseTimer.show(true);
  }
  setTimerCountDown(hour, minute, second) {
    var options = {};
    const now = new Date();
    var time = parseInt(now.getTime() / 1000) + hour * 60 * 60 + minute * 60 + second;
    options.type = 1;
    options.time = time;
    this.clElapseTimer.setOptions(options);
    this.clElapseTimer.start();
    this.clElapseTimer.show(true);
  }
  initExamInformation(starttime, info) {
    // info.examdate;
    // info.examtime;
    if (starttime != 0) {
      this.setExamInformation(starttime, info);
      return;
    }

    var now = new Date();
    // info.examdate = '2023-05-05, 12:00';
    var examdate = info.examdate.split(",");
    var today = mtoCalendar.formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    // info.examdate = ''
    // console.log('mtmPlayerTestumViewer > initExamInformation : ',examdate[0],today);
    // console.log('mtmPlayerTestumViewer > initExamInformation  info.examdate: ', info.examdate);
    if (examdate[0] > today) {
      // 시험일이 아직 아님..
      this._timeBeforeDate();
    } else if (examdate[0] < today) {
      // 시험일이 지남...
      this._timePassDate();
    } else {
      // 오늘이 시험일...
      // this._timeToday();
      // Fixed. Jstar
      // info.examdate:  2023-04-22, 09:00
      var date = examdate[0].split("-");
      var examtime = examdate[1].split(":");

      // var examdate_date = new Date(info.examdate);
      var examdate_date = new Date(
        parseInt(date[0]),
        parseInt(date[1]) - 1,
        parseInt(date[2]),
        parseInt(examtime[0]),
        parseInt(examtime[1]),
      );
      // Safari Date 포맷 관련
      // https://kimbiyam.me/posts/javascript/safari-date-format
      // const dateString = '2020-01-01 00:00:00';
      // new Date(dateString.replace(/-/g, "/"));
      // var examdate_date = new Date(info.examdate);
      var examdate_time = parseInt(examdate_date.getTime() / 1000);
      // console.log('mtmPlayerTestumViewer > initExamInformation : ',info.examdate, examdate_time);
      now = new Date();
      var now_time = parseInt(now.getTime() / 1000);

      if (examdate_time < now_time) {
        this._timeAlready(examdate_time, now_time);
      } else {
        this._timeReady(examdate_time, now_time);
      }

      // this.clInformationCard.setTitle('아직 평가 시작 시간이 아닙니다.');
      // this.clInformationCard.setDescription('남은 시간');
      // var action = {};
      // action.text = '평가 시작하기';
      // action.iClass = 'fa fa-check';
      // this.clInformationCard.setActionTitle(action);
      // this.clInformationCard.showDescription(true);
      // this.clInformationCard.showActionTitle(true);
    }
  }
  setExamInformation(starttime, info) {
    var durations = info.examtime.split(":");
    var time = parseInt(durations[0]) * 60 * 60 + parseInt(durations[1]) * 60;
    var end_time = starttime + time;

    var now = new Date();
    var curr_time = parseInt(now.getTime() / 1000);
    if (end_time > curr_time) {
      this._timeNotEnd(end_time);
    } else {
      this._timeEnd();
    }
  }
  getAnswerStatus() {}
}

mtmPlayerTestumViewer.id = 0;

mtmPlayerTestumViewer.staticSlide = [{ level: 0, tag: "div", class: "swiper-slide" }];

mtmPlayerTestumViewer.staticItem = [
  {
    level: 0,
    tag: "div",
    class: "testum-question-card",
    text: "",
    attr: { "data-id": "", "data-index": "" },
    // 'attr':{'style' : 'width:30px;height:30px;color:#fff;background:#01353c;border-radius:100%',
    //         'data-id':'','data-index':'' },
  },
];

mtmPlayerTestumViewer.staticBody = [
  // col-12 d-flex justify-content-center
  { step: 0, tag: "div", class: "col-12 d-flex justify-content-center" },
  { step: 1, tag: "div", class: "col-12 col-md-9" },
];

mtmPlayerTestumViewer.staticPlayArea = [];
