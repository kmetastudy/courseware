import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";
// import {mtvEvents} from '../../../core/utils/mtv-events.js';
import { mtoEvents } from "../../../core/utils/mto-events.js";
import { mtoContentFormat } from "../../../core/utils/mto-content-format.js";

import { mtmPlayerTestum } from "../testum/mtm-player-testum.js";
import { mtmPlayerLesson } from "../lesson/mtm-player-lesson.js";

export var mtmStudyBuilder = function (options) {
  this.id = "id-mtm-study-builder-" + mtmStudyBuilder.id++;
  this.elThis = null;
  this.options = options;
  if (!this.options) this.options = {};
  this._init();
};

mtmStudyBuilder.id = 0;

mtmStudyBuilder.prototype._studyTestum = function () {
  // 테스텀에 동영상이 있으면...
  this.clPlayerTestum.stopPreviousContent();
  // 무조건 기존에 하던 Lesson Play를 멈춘다.
  this.clPlayerLesson.stopLesson();

  this.clPlayerTestum.setPlayOptions(this.options);

  this.clPlayerLesson.show(false);

  // Todo. Jstar : Exam or Normal Testum
  // 여기도 잠시 ... testum 인지 exam 인지에 따라서 바뀌지 않을까?
  this.clPlayerTestum.startTestum();
  this.clPlayerTestum.show(true);
};

mtmStudyBuilder.prototype._studyLesson = function () {
  // 테스텀에 동영상이 있으면...
  this.clPlayerTestum.stopPreviousContent();
  // 무조건 기존에 하던 Lesson Play를 멈춘다.
  this.clPlayerLesson.stopLesson();

  // 사실상 Lesson 은 PlayMode 가 중요하지 않는다.
  this.clPlayerLesson.setPlayOptions(this.options);

  this.clPlayerTestum.show(false);

  this.clPlayerLesson.startLesson();
  this.clPlayerLesson.show(true);
};

mtmStudyBuilder.prototype._initEvents = function () {
  // window.addEventListener('resize', this.resizeWindowHandler.bind(this));
  mtoEvents.on("OnChangeCourseContent", this.onChangeCourseContentHandler.bind(this));
  mtoEvents.on("OnChangeClinicContent", this.onChangeClinicContentHandler.bind(this));
  mtoEvents.on("OnChangeExamContent", this.onChangeExamContentHandler.bind(this));
};

mtmStudyBuilder.prototype._init = function () {
  this.elThis = document.createElement("div");

  var options = {};
  // Todo. Jstar : Content PlayMode , mode, contentKind 를 정리해야 한다.
  options.modeStudent = true; // student mode
  // Todo. Jstar : 뭐냐 ? 아무것도 안하냐?
  options.requestPlayerVideo = this.requestPlayerVideo.bind(this);
  options.eventExamStartHandler = this.onExamStartHandler.bind(this);

  this.clPlayerTestum = new mtmPlayerTestum(options);
  this.clPlayerTestum.show(false);
  this.elThis.appendChild(this.clPlayerTestum.elThis);

  this.clPlayerLesson = new mtmPlayerLesson(options);
  this.clPlayerLesson.show(false);
  this.elThis.appendChild(this.clPlayerLesson.elThis);

  this._initEvents();
};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler ////////////////////////////////////
mtmStudyBuilder.prototype.requestPlayerVideo = function () {};

mtmStudyBuilder.prototype.onExamStartHandler = function (eData) {
  var now = new Date();
  var time = parseInt(now.getTime() / 1000);
  this._urlUpdateExamResult(time);
  // Todo. Jstar : Exam 초기 Blank Answer 를 해야 하나?
  // 여기에
};

mtmStudyBuilder.prototype.onChangeCourseContentHandler = function (eData) {
  // console.log('mtmStudyBuilder > onChangeCourseContentHandler : ', eData.class_id);

  this.options.student_id = eData.student_id;
  this.options.class_id = eData.class_id;
  this.options.course_id = eData.course_id;
  this.options.content_id = eData.content_id;
  this.options.title = eData.title;

  this.options.content_type = eData.type;
  this.options.results = eData.results;
  this.options.units = eData.units;

  console.log("mtmStudyBuilder > onChangeCourseContentHandler :", this.options);

  // this._urlGetCourseContentDetail();
  this._urlGetContentInfo();
};

mtmStudyBuilder.prototype.onChangeClinicContentHandler = function (eData) {
  // console.log('mtmStudyBuilder > onChangeClinicContentHandler : ', eData.class_id);

  this.options.student_id = eData.student_id;
  this.options.class_id = eData.class_id;
  this.options.course_id = eData.course_id;
  this.options.content_id = eData.content_id;
  this.options.clinic_id = eData.clinic_id;
  this.options.title = eData.title;

  this.options.content_type = eData.type;
  this.options.course_type = eData.course_type;
  this.options.units = eData.units;
  this.options.valids = eData.valids;
  this.options.results = eData.results;

  console.log("mtmStudyBuilder > onChangeClinicContentHandler :", this.options);

  this._urlGetClinicContentInfo();
};

mtmStudyBuilder.prototype.onChangeExamContentHandler = function (eData) {
  if (eData) {
    this.options.student_id = eData.student_id;
    this.options.class_id = eData.class_id;
    this.options.course_id = eData.course_id;
    this.options.content_id = eData.content_id;
    this.options.content_type = eData.type;
    this.options.examdate = eData.examdate;
    this.options.examtime = eData.examtime;
    this.options.attribute = eData.attribute;
  }

  this._urlGetExamContentInfo();
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API /////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Ajax  /////////////////////////////////////////

mtmStudyBuilder.prototype._aurlGetContentInfo = function (result) {
  // console.log('mtmStudyBuilder > _aurlGetContentInfo : ',result);

  this.options.content_list = result.content_list;
  this.contentKind = 0;
  this.options.content_type = result.content_type;
  this.options.course_type = 0; // normal course

  if (result.content_type == mtoContentFormat.TESTUM || result.content_type == mtoContentFormat.EXAM) {
    // testum or exam
    console.log("mtmStudyBuilder > _aurlGetContentInfo > Testum : ", this.options);
    this._studyTestum();
  } else if (result.content_type == mtoContentFormat.LESSION) {
    // lesson
    console.log("mtmStudyBuilder > _aurlGetContentInfo > Lesson : ", this.options);
    this._studyLesson();
  }
};

mtmStudyBuilder.prototype._urlGetContentInfo = function () {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("course_id", this.options.course_id);
  formData.append("content_id", this.options.content_id);
  formData.append("content_type", this.options.content_type);

  var url = "/st/getcontentinfo/";
  $.ajax({
    url: url,
    data: formData,
    // enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    cache: false,

    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._aurlGetContentInfo.call(self, res.result);
    },
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};

mtmStudyBuilder.prototype._aurlGetClinicContentInfo = function (result) {
  this.options.content_list = result.content_list;
  // Clinic Content
  this.contentKind = 1;
  this.options.content_type = result.content_type;
  this.options.course_type = 1; // clinic course

  if (result.content_type == mtoContentFormat.TESTUM || result.content_type == mtoContentFormat.EXAM) {
    // testum or exam
    console.log("mtmStudyBuilder > _aurlGetClinicContentInfo > Testum : ", this.options);
    this._studyTestum();
  } else if (result.content_type == mtoContentFormat.LESSION) {
    // lesson
    console.log("mtmStudyBuilder > _aurlGetClinicContentInfo > Lesson : ", this.options);
    this._studyLesson();
  }
};

mtmStudyBuilder.prototype._urlGetClinicContentInfo = function () {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  // formData.append('student_id', this.options.student_id);
  // formData.append('class_id', this.options.class_id);
  formData.append("course_id", this.options.course_id);
  formData.append("content_id", this.options.content_id);
  formData.append("content_type", this.options.content_type);
  // clinic course
  // formData.append('type', 1);

  // var url = "/st/getcliniccontentinfo/";
  var url = "/st/getcontentinfo/";
  $.ajax({
    url: url,
    data: formData,
    // enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    cache: false,

    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._aurlGetClinicContentInfo.call(self, res.result);
    },
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};

mtmStudyBuilder.prototype._aurlGetExamContentInfo = function (result) {
  // Exam Content
  this.contentKind = 2;

  if (result.content_type == mtoContentFormat.TESTUM || result.content_type == mtoContentFormat.EXAM) {
    // testum or exam
    console.log("mtmStudyBuilder > _aurlGetExamContentInfo : ", result);
    this._studyTestum();
  } else if (result.content_type == mtoContentFormat.LESSION) {
    // lesson
    console.log(
      "mtmStudyBuilder > _aurlGetExamContentInfo > contentunit_list: ",
      result.contentunit_list,
      this.contentKind,
    );
    this._studyLesson();
  }
};

mtmStudyBuilder.prototype._urlGetExamContentInfo = function () {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("student_id", this.options.student_id);
  formData.append("class_id", this.options.class_id);
  formData.append("course_id", this.options.course_id);
  formData.append("content_id", this.options.content_id);
  formData.append("content_type", this.options.content_type);
  // clinic course
  formData.append("type", 0);

  var url = "/st/getexamcontentinfo/";
  $.ajax({
    url: url,
    data: formData,
    // enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    cache: false,

    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._aurlGetExamContentInfo.call(self, res.result);
    },
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};

mtmStudyBuilder.prototype._aurlUpdateExamResult = function () {};

mtmStudyBuilder.prototype._urlUpdateExamResult = function (time) {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("student_id", this.options.student_id);
  formData.append("class_id", this.options.class_id);
  formData.append("course_id", this.options.course_id);
  formData.append("content_id", this.options.content_id);
  formData.append("content_type", this.options.content_type);
  formData.append("point", 0);
  formData.append("try_count", 0);
  formData.append("progress", time);
  // clinic course
  formData.append("type", 0);

  var url = "/st/updateexamresult/";
  $.ajax({
    url: url,
    data: formData,
    // enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    cache: false,

    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._aurlUpdateExamResult.call(self, res.result);
    },
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};
