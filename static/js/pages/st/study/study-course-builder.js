import { mtoEvents } from "../../../core/utils/mto-events";
import { mtoContentFormat } from "../../../core/utils/mto-content-format.js";
import { ApiCp } from "../../../core/api/api-cp";

// import { mtmPlayerTestum } from "../testum/mtm-player-testum.js";
// import { mtmPlayerLesson } from "../lesson/mtm-player-lesson.js";

// test
import { TestumPlayer } from "../testum/testum-player";
import { LessonPlayer } from "../lesson/lesson-player";
import { mtmStudyAnswerLong } from "./mtm-study-answer-long";

require("../../../../css/pages/st/study/study-course-builder.css");
export var StudyCourseBuilder = function (options) {
  this.id = "id-mtm-study-builder-" + StudyCourseBuilder.id++;
  this.elThis = null;
  this.options = options;
  if (!this.options) this.options = {};

  this.api = new ApiCp("cp", "course_n");
  this._init();
};

StudyCourseBuilder.id = 0;

StudyCourseBuilder.prototype._studyTestum = function () {
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

StudyCourseBuilder.prototype._studyLesson = function () {
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

StudyCourseBuilder.prototype._initEvents = function () {
  mtoEvents.on("OnChangeCourseContent", this.onChangeCourseContentHandler.bind(this));
  mtoEvents.on("OnChangeClinicContent", this.onChangeClinicContentHandler.bind(this));
  mtoEvents.on("OnChangeExamContent", this.onChangeExamContentHandler.bind(this));

  //
  mtoEvents.on("onAsidePositionChange", this.handleAsidePositionChange.bind(this));
};

StudyCourseBuilder.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("st-course-builder");

  var options = {
    modeStudent: true,
    requestPlayerVideo: this.requestPlayerVideo.bind(this),
    eventExamStartHandler: this.onExamStartHandler.bind(this),
  };

  // this.clPlayerTestum = new mtmPlayerTestum(options);
  this.clPlayerTestum = new TestumPlayer(options);
  this.clPlayerTestum.show(false);
  this.elThis.appendChild(this.clPlayerTestum.elThis);

  // this.clPlayerLesson = new mtmPlayerLesson(options);
  this.clPlayerLesson = new LessonPlayer(options);
  this.clPlayerLesson.show(false);
  this.elThis.appendChild(this.clPlayerLesson.elThis);

  this._initEvents();
};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler ////////////////////////////////////
StudyCourseBuilder.prototype.requestPlayerVideo = function () {};

StudyCourseBuilder.prototype.onExamStartHandler = function (eData) {
  var now = new Date();
  var time = parseInt(now.getTime() / 1000);
  this._urlUpdateExamResult(time);
  // Todo. Jstar : Exam 초기 Blank Answer 를 해야 하나?
  // 여기에
};

/**
 *
 * @param {Object} params
 * @param {string} params.course_id - id of course book
 * @param {string} params.title - title of branch
 * @param {string} params.content_id - id of branch(lesson/testum), format:  'aa-aa-bb'
 * @param {number} params.content_type - type of branch(lesson/testum), testum: 11, lesson: 12, exam: 13
 */
StudyCourseBuilder.prototype.onChangeCourseContentHandler = async function ({
  student_id,
  course_id,
  content_id,
  content_type,
  title,
  results,
}) {
  // this.options.student_id = eData.student_id;
  // this.options.class_id = eData.class_id;
  // this.options.course_id = eData.course_id;
  // this.options.content_id = eData.content_id;
  // this.options.title = eData.title;

  // this.options.content_type = eData.type;
  // this.options.results = eData.results;
  // this.options.units = eData.units;
  try {
    const content = await this.urlGetContent({
      course_id: course_id,
      content_id: content_id,
      content_type: content_type,
    });
    // content = {
    //   content_list: [],
    //   content_type: [],
    //   units: []
    // }
    // const result = await this.urlGetResult();

    this.options.student_id = student_id;
    this.options.course_id = course_id;
    this.options.content_id = content_id;
    this.options.title = title;
    this.options.content_list = content.content_list;
    this.options.content_type = content.content_type;
    this.options.units = content.units;
    // TODO
    // 일단 result 배제 (empty result)
    // this.options.results = [];
    this.options.results = results ?? [];

    if (content.content_type === 11 || content.content_type === 13) {
      this._studyTestum();
    } else if (content.content_type === 12) {
      this._studyLesson();
    }
    // if (content.type===mtoContentFormat.TESTUM || content.type===mtoContentFormat.EXAM) {
    //   this._studyTestum();
    // } else if (content.type===mtoContentFormat.LESSON) {
    //   this._studyLesson();
    // }

    // Swal.fire({
    //   html: this.elThis,
    //   showCloseButton: true,
    //   showConfirmButton: false,
    //   // allowOutsideClick: () => {
    //   //   const popup = Swal.getPopup();
    //   //   return false;
    //   // },
    //   allowOutsideClick: false,
    // });
  } catch (err) {
    console.error(err);
  }

  // this._urlGetCourseContentDetail();
  // this._urlGetContentInfo(courseId, "lists");
};

StudyCourseBuilder.prototype.onChangeClinicContentHandler = function (eData) {
  // console.log('StudyCourseBuilder > onChangeClinicContentHandler : ', eData.class_id);

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

  console.log("StudyCourseBuilder > onChangeClinicContentHandler :", this.options);

  this._urlGetClinicContentInfo();
};

StudyCourseBuilder.prototype.onChangeExamContentHandler = function (eData) {
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

StudyCourseBuilder.prototype.handleAsidePositionChange = function ({ position, width }) {
  this.setPosition(position, width);
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API /////////////////////////////////////
StudyCourseBuilder.prototype.setPosition = function (position, width) {
  const positionAttribute = `margin-${position}:${width}px;`;
  this.elThis.setAttribute("style", positionAttribute);
};

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Ajax  /////////////////////////////////////////
StudyCourseBuilder.prototype.urlGetContent = async function ({ course_id, content_id, content_type }) {
  try {
    const formData = new FormData();
    formData.append("course_id", course_id);
    formData.append("content_id", content_id);
    formData.append("content_type", content_type);

    return await axios.post("../st/get-content/", formData).then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

StudyCourseBuilder.prototype._aurlGetContentInfo = function (result) {
  // console.log('StudyCourseBuilder > _aurlGetContentInfo : ',result);

  this.options.content_list = result.content_list;
  this.contentKind = 0;
  this.options.content_type = result.content_type;
  this.options.course_type = 0; // normal course

  if (result.content_type == mtoContentFormat.TESTUM || result.content_type == mtoContentFormat.EXAM) {
    // testum or exam
    console.log("StudyCourseBuilder > _aurlGetContentInfo > Testum : ", this.options);
    this._studyTestum();
  } else if (result.content_type == mtoContentFormat.LESSION) {
    // lesson
    console.log("StudyCourseBuilder > _aurlGetContentInfo > Lesson : ", this.options);
    this._studyLesson();
  }
};

StudyCourseBuilder.prototype._urlGetContentInfo = function () {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("course_id", this.options.course_id);
  formData.append("content_id", this.options.content_id); // lesson/testum의 id
  formData.append("content_type", this.options.content_type); // 11: testum, 12: lesson, 13: exam

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
    error: function (err) {
      console.log(err);
      // window.location.href = "/";
    },
  }); // end of ajax
};

StudyCourseBuilder.prototype._aurlGetClinicContentInfo = function (result) {
  this.options.content_list = result.content_list;
  // Clinic Content
  this.contentKind = 1;
  this.options.content_type = result.content_type;
  this.options.course_type = 1; // clinic course

  if (result.content_type == mtoContentFormat.TESTUM || result.content_type == mtoContentFormat.EXAM) {
    // testum or exam
    console.log("StudyCourseBuilder > _aurlGetClinicContentInfo > Testum : ", this.options);
    this._studyTestum();
  } else if (result.content_type == mtoContentFormat.LESSION) {
    // lesson
    console.log("StudyCourseBuilder > _aurlGetClinicContentInfo > Lesson : ", this.options);
    this._studyLesson();
  }
};

StudyCourseBuilder.prototype._urlGetClinicContentInfo = function () {
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
    error: function (err) {
      console.log(err);
      // window.location.href = "/";
    },
  }); // end of ajax
};

StudyCourseBuilder.prototype._aurlGetExamContentInfo = function (result) {
  // Exam Content
  this.contentKind = 2;

  if (result.content_type == mtoContentFormat.TESTUM || result.content_type == mtoContentFormat.EXAM) {
    // testum or exam
    console.log("StudyCourseBuilder > _aurlGetExamContentInfo : ", result);
    this._studyTestum();
  } else if (result.content_type == mtoContentFormat.LESSION) {
    // lesson
    console.log(
      "StudyCourseBuilder > _aurlGetExamContentInfo > contentunit_list: ",
      result.contentunit_list,
      this.contentKind,
    );
    this._studyLesson();
  }
};

StudyCourseBuilder.prototype._urlGetExamContentInfo = function () {
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
    error: function (err) {
      console.log(err);
      // window.location.href = "/";
    },
  }); // end of ajax
};

StudyCourseBuilder.prototype._aurlUpdateExamResult = function () {};

StudyCourseBuilder.prototype._urlUpdateExamResult = function (time) {
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
    error: function (err) {
      console.log(err);
      // window.location.href = "/";
    },
  }); // end of ajax
};
