import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";
import { mtoCalendar } from "../../../core/utils/mto-calendar.js";
import { mtmPlayerTestumQuestion } from "./mtm-player-testum-question.js";
import { mtmElapseTimer } from "../../../core/ui/output/mtm-elapse-timer.js";
import { mtmExamInformationCard } from "./mtm-exam-information-card.js";

export var mtmPlayerTestumViewer = function (options) {
  this.id = "id-mtm-player-testum-viewer-" + mtmPlayerTestumViewer.id++;

  this.elThis = null;
  this.options = options;

  this.slides = [];
  this.infoslides = [];
  this.qCards = [];

  this.activeIndex = -1;
  this._init();
};

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

mtmPlayerTestumViewer.prototype.resizeWindowHandler = function (e) {
  // if(window.innerWidth < 768)
  // {
  //     this.SwiperQuestion.set
  // }
  // else
  // {
  // }
};

mtmPlayerTestumViewer.prototype._initSwiperInformation = function () {
  this.SwiperInformation = new Swiper(this.elSwiperInformation, {
    autoHeight: true,
    slidesPerView: 1,
    threshold: 10,
    centeredSlides: true,
    spaceBetween: 50,
  });
  this.SwiperInformation.on("activeIndexChange", this.onChangeActiveIndex.bind(this));
};

mtmPlayerTestumViewer.prototype._initSwiperQuestion = function () {
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
    // breakpoints: {
    //     // when window width is >= 320px
    //     320: {
    //       slidesPerView: 3,
    //     //   spaceBetween: 20
    //     },
    //     // when window width is >= 480px
    //     480: {
    //       slidesPerView: 5,
    //     //   spaceBetween: 30
    //     },
    //     // when window width is >= 640px
    //     640: {
    //       slidesPerView: 8,
    //     //   spaceBetween: 40
    //     }
    //   },
    spaceBetween: 50,
  });
  this.SwiperQuestion.on("activeIndexChange", this.onChangeActiveIndex.bind(this));
};

mtmPlayerTestumViewer.prototype._addSwiperInformation = function () {
  var slide = mtoElementBuilder.createComponent(mtmPlayerTestumViewer.staticSlide);
  var options = {};
  options.eventTimerClick = this.onTimerClickHandler.bind(this);
  options.eventRemainEndHandler = this.onRemainEndHandler.bind(this);
  this.clInformationCard = new mtmExamInformationCard(options);
  slide.appendChild(this.clInformationCard.elThis);

  this.SwiperInformation.appendSlide(slide);
  this.infoslides.push(slide);
};

mtmPlayerTestumViewer.prototype._addSwiperQuestion = function () {
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
};

mtmPlayerTestumViewer.prototype._clearSwiperInformation = function () {
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
};

mtmPlayerTestumViewer.prototype._clearSwiperQuestion = function () {
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
};

mtmPlayerTestumViewer.prototype._initInformation = function () {
  this.elInformationViewer = document.createElement("div");

  this.elFlexExamInformation = document.createElement("div");
  this.elFlexExamInformation.setAttribute("class", "row d-flex justify-content-center mt-2");
  this.elFlexExamInformation.setAttribute("id", "id-mtm-exam-information-swiper-" + mtmPlayerTestumViewer.id);

  this.elSwiperInformation = document.createElement("div");

  this.elSwiperInformation.setAttribute("class", "pt-2 col-12 justify-content-center swiper-container");
  this.elSwiperInformation.style.width = "90%";
  this.elSwiperInformation.style.overflowX = "hidden";
  this.elSwiperInformation.style.height = "700px";
  // this.elSwiperInformation.style.margin = "auto 10px";
  this.elSwiperInformation.style.borderRadius = "20px";
  // this.elSwiperInformation.style.minWidth = "470px";

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
};

mtmPlayerTestumViewer.prototype._initQuestion = function () {
  this.elQuestionViewer = document.createElement("div");

  this.elFlexQuestion = document.createElement("div");
  this.elFlexQuestion.setAttribute("class", "row d-flex justify-content-center mt-2");
  this.elFlexQuestion.setAttribute("id", "id-mtm-question-swiper-" + mtmPlayerTestumViewer.id);

  this.elSwiperQuestion = document.createElement("div");

  this.elSwiperQuestion.setAttribute("class", "pt-2 col-12 justify-content-center swiper-container");
  this.elSwiperQuestion.style.width = "90%";
  this.elSwiperQuestion.style.overflowX = "hidden";
  this.elSwiperQuestion.style.height = "700px";
  // this.elSwiperQuestion.style.margin = "auto 10px";
  this.elSwiperQuestion.style.borderRadius = "20px";
  // this.elSwiperQuestion.style.minWidth = "470px";

  this.elWrapperQuestion = document.createElement("div");
  this.elWrapperQuestion.setAttribute("class", "swiper-wrapper");
  this.elSwiperQuestion.appendChild(this.elWrapperQuestion);
  // this.elSwiperQuestion.style.backgroundColor = 'rgb(125,255,255,5)';
  this.elFlexQuestion.appendChild(this.elSwiperQuestion);

  this.elQuestionViewer.append(this.elFlexQuestion);

  this.elThis.appendChild(this.elQuestionViewer);
  this.elQuestionViewer.style.display = "none";
  this._initSwiperQuestion();
  this._addSwiperQuestion();
};

mtmPlayerTestumViewer.prototype._init = function () {
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
};

// mtmPlayerTestumViewer.prototype._refresh = function() {
//     for(var i=0;i<this.slides.length;i++)
//     {
//         var slide = this.slides[i];
//         // this.SwiperQuestion.removeSlide(slide);
//     }
//     this.SwiperQuestion.removeAllSlides();
//     this.SwiperQuestion.update();

//     this.slides = [];
//     this.questions = [];
//     this.options.items = [];
//     this.qCards = [];
//     // this.options.items = [];
//     this._addSwiperQuestion();
// }

// mtvComponentBuilder.register('mtv-player-testum-viewer',mtmPlayerTestumViewer);
mtmPlayerTestumViewer.prototype._timeBeforeDate = function () {
  // 시험일이 아직 아님..
  this.clInformationCard.setTitle("아직 평가 일자가 아닙니다.");
  this.clInformationCard.showDescription(false);
  this.clInformationCard.showActionTitle(false);

  this.clInformationCard.showAnanlogClock(true);
  this.clInformationCard.showDigitalClock(false);
};

mtmPlayerTestumViewer.prototype._timePassDate = function () {
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
};

mtmPlayerTestumViewer.prototype._timePassTime = function () {
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
};

mtmPlayerTestumViewer.prototype._timeAlready = function (exam_time, now_time) {
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
};

mtmPlayerTestumViewer.prototype._timeReady = function (exam_time, now_time) {
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
};

mtmPlayerTestumViewer.prototype._timeNotEnd = function (end_time) {
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
};

mtmPlayerTestumViewer.prototype._timeEnd = function () {
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
};

///////////////////////// Event Handler //////////////////////////////////
mtmPlayerTestumViewer.prototype.onAnswerChangeHandler = function (eData) {
  console.log("mtmPlayerTestumViewer > onAnswerChangeHandler : ", eData);
};

mtmPlayerTestumViewer.prototype.onRemainEndHandler = function () {
  console.log("mtmPlayerTestumViewer > onRemainEndHandler : ");

  if (this.options && this.options.eventExamEndHandler) this.options.eventExamEndHandler();
};

mtmPlayerTestumViewer.prototype.onTimerClickHandler = function () {
  console.log("mtmPlayerTestumViewer > onTimerClickHandler : ");
  this.elInformationViewer.style.display = "none";
  this.elQuestionViewer.style.display = "";
  if (this.options && this.options.eventExamStartHandler) this.options.eventExamStartHandler();
};

mtmPlayerTestumViewer.prototype.onChangeActiveIndex = function () {
  if (this.options && this.options.eventActiveIndexChangeHandler)
    this.options.eventActiveIndexChangeHandler(this.SwiperQuestion.activeIndex);
};

mtmPlayerTestumViewer.prototype.onEventSolutionHandler = function (eData) {
  console.log("mtmPlayerTestumViewer > onEventSolutionHandler : ", eData);
  if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
};

mtmPlayerTestumViewer.prototype.onEventSubmitHandler = function (eData) {
  // console.log('mtmPlayerTestumViewer > onEventSubmitHandler : ', eData);
  if (this.options && this.options.eventSubmitHandler) this.options.eventSubmitHandler(eData);
};

mtmPlayerTestumViewer.prototype.onEventConfirmHandler = function () {
  // console.log('mtmPlayerTestumViewer > onEventConfirmHandler : ');
  if (this.options && this.options.eventConfirmHandler) this.options.eventConfirmHandler();
};

///////////////////// API ///////////////////////////////////////
mtmPlayerTestumViewer.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmPlayerTestumViewer.prototype.setTestumContent = function (items) {
  this._clearSwiperQuestion();
  this.options.items = items;
  this._addSwiperQuestion();
};

mtmPlayerTestumViewer.prototype.setQuestionIndex = function (index) {
  this.SwiperQuestion.slideTo(index);
};

mtmPlayerTestumViewer.prototype.getAnswer = function (index) {
  if (this.qCards.length < index + 1) return "";

  // var cl = this.qCards[index];
  // return  cl.getAnswer();

  var tq = this.qCards[index];
  return tq.getAnswer();
};

mtmPlayerTestumViewer.prototype.getPoint = function (index) {
  if (this.qCards.length < index + 1) return "";

  // var cl = this.qCards[index];
  // return  cl.getAnswer();

  var tq = this.qCards[index];
  return tq.getPoint();
};

mtmPlayerTestumViewer.prototype.setAnswer = function (index, value) {
  if (this.qCards.length < index + 1) return;

  // var cl = this.qCards[index];
  // return  cl.getAnswer();

  var tq = this.qCards[index];
  // return  tq.getAnswer();
  tq.setAnswer(value);
};

mtmPlayerTestumViewer.prototype.setMark = function (index, bCorrect) {
  var tq = this.qCards[index];
  if (!tq) return;

  tq.setMark(bCorrect);
  tq.setAnswerEnable(false);
};

mtmPlayerTestumViewer.prototype.setWidth = function (width) {
  // this.elSwiperQuestion.style.minWidth = "470px";
  this.elSwiperQuestion.style.minWidth = width;
};

mtmPlayerTestumViewer.prototype.timerStart = function () {
  this.clElapseTimer.start();
};

mtmPlayerTestumViewer.prototype.timerReset = function () {
  this.clElapseTimer.reset();
};

mtmPlayerTestumViewer.prototype.timerStop = function () {
  this.clElapseTimer.stop();
};

mtmPlayerTestumViewer.prototype.showElapseTimer = function (bShow) {
  this.clElapseTimer.reset();
  this.clElapseTimer.show(bShow);
  this.clElapseTimer.start();
};

// 평가에 관련된 정보를 보여준다.
mtmPlayerTestumViewer.prototype.showInformation = function (bShow) {
  if (bShow) {
    // this.clInformationCard.setNewInformation();
    this.elInformationViewer.style.display = "";
  } else this.elInformationViewer.style.display = "none";
};

mtmPlayerTestumViewer.prototype.showTestum = function (bShow) {
  if (bShow) this.elQuestionViewer.style.display = "";
  else this.elQuestionViewer.style.display = "none";
};

mtmPlayerTestumViewer.prototype.setCountUpTimer = function (time) {
  var options = {};
  options.type = 0;
  options.time = time;
  this.clElapseTimer.setOptions(options);
  this.clElapseTimer.start();
  this.clElapseTimer.show(true);
};

mtmPlayerTestumViewer.prototype.setCountDownTimer = function (time) {
  var options = {};
  options.type = 1;
  options.time = time;
  this.clElapseTimer.setOptions(options);
  this.clElapseTimer.start();
  this.clElapseTimer.show(true);
};

mtmPlayerTestumViewer.prototype.setTimerCountDown = function (hour, minute, second) {
  var options = {};
  const now = new Date();
  var time = parseInt(now.getTime() / 1000) + hour * 60 * 60 + minute * 60 + second;
  options.type = 1;
  options.time = time;
  this.clElapseTimer.setOptions(options);
  this.clElapseTimer.start();
  this.clElapseTimer.show(true);
};

mtmPlayerTestumViewer.prototype.initExamInformation = function (starttime, info) {
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
};

mtmPlayerTestumViewer.prototype.setExamInformation = function (starttime, info) {
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
};

mtmPlayerTestumViewer.prototype.getAnswerStatus = function () {};
