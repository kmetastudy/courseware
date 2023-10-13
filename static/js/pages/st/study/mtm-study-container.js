import { mtoEvents } from "../../../core/utils/mto-events.js";
import { mtoCalendar } from "../../../core/utils/mto-calendar.js";
import { mtmTabs } from "../../../core/ui/mtm-tabs";

import { mtmInputSelectScroll } from "../../../core/ui/input/mtm-input-select-scroll.js";
import { mtmInputSelectCourseWeek } from "../../../core/ui/input/mtm-input-select-course-week.js";
import { mtmListTableCourseContent } from "../course/mtm-list-table-course-content.js";

// 보기
// Course List 에 메뉴 추가 :
//  1)
// 보기 메뉴 : 날짜 보기/Lesson 만/Test 만
//
// 용어 정리
// Course (과목) - Course Content (Lesson/Testum/Exam) - Content Item (Video/Question)
// Todo. 학습 날자와 관계된 것은 어떻게 표현해 줄까?
// 1) 학습일 : 학년도는 빼고, 월/일만 보이게 하자...
export var mtmStudyContainer = function (options) {
  this.id = "id-mtm-study-container-" + mtmStudyContainer.id++;

  this.options = options;
  this.elThis = null;

  this.course_list = [];
  this.coursetitle_list = [];
  this.student_info = {};

  if (this.options && this.options.context) {
    if (this.options.context.userId) this.student_info.student_code = this.options.context.userId;
    if (this.options.context.userName) this.student_info.student_name = this.options.context.userName;
  }

  this.selected_course_index = -1;

  this._init();
};

mtmStudyContainer.id = 0;

mtmStudyContainer.prototype._createCourseSelector = function () {
  var optionsCourse = { width: "100%" };
  optionsCourse.classList = [];
  optionsCourse.classList.push("pt-2");
  optionsCourse.classList.push("pb-1");
  optionsCourse.eventHandler = this.onCourseSelectHandler.bind(this);

  this.clCourseSelector = new mtmInputSelectScroll(optionsCourse);
  this.elThis.appendChild(this.clCourseSelector.elThis);
};

mtmStudyContainer.prototype._createTimelineSelector = function () {
  var optionsWeek = { width: "100%" };
  optionsWeek.classList = [];
  optionsWeek.classList.push("pt-1");
  optionsWeek.classList.push("pb-2");
  optionsWeek.eventChangeWeek = this.onChangeWeekHandler.bind(this);
  this.clWeekSelector = new mtmInputSelectCourseWeek(optionsWeek);
  this.elThis.appendChild(this.clWeekSelector.elThis);
};

mtmStudyContainer.prototype._createContentTabsViewer = function () {
  var options = { align: "center" };
  options.tabs = [];
  // Tab 과 Badge 와의 관계
  options.tabs.push({
    name: "기본",
    align: "center",
    active: true,
    panel: true,
    badge: true,
    background: "rgb(255,0,255)",
    color: "white",
  });
  options.tabs.push({
    name: "추천",
    align: "center",
    active: false,
    panel: true,
    badge: true,
    background: "rgb(0,255,0)",
    color: "white",
  });
  options.tabs.push({
    name: "평가",
    align: "center",
    active: false,
    panel: true,
    badge: true,
    background: "rgb(0,255,255)",
    color: "white",
  });
  options.eventActivateTab = this.onContentTabActivateHandler.bind(this);

  this.clContentTabs = new mtmTabs(options);
  this.contentTabIndex = 0;
  this.elThis.appendChild(this.clContentTabs.elThis);
};

mtmStudyContainer.prototype._createCourseListViewer = function () {
  var options = {};
  options.type = 0; // Normal
  options.eventClickRow = this.onClickCourseContentHandler.bind(this);
  options.bTest = false;
  options.classList = ["py-2"];
  this.clListTableCourseContentNormal = new mtmListTableCourseContent(options);
  this.elThis.appendChild(this.clListTableCourseContentNormal.elThis);
};

mtmStudyContainer.prototype._createClinicListViewer = function () {
  var options = {};
  options.type = 0; // Normal
  options.eventClickRow = this.onClickClinicContentHandler.bind(this);
  options.bTest = false;
  options.classList = ["py-2"];
  this.clListTableCourseContentClinic = new mtmListTableCourseContent(options);
  this.elThis.appendChild(this.clListTableCourseContentClinic.elThis);
  // hide clinic course viewer
  this.clListTableCourseContentClinic.show(false);
};

mtmStudyContainer.prototype._createExamListViewer = function () {
  var options = {};
  options.type = 1; // Exam
  options.eventClickRow = this.onClickExamContentHandler.bind(this);
  options.bTest = false;
  options.classList = ["py-2"];
  this.clListTableCourseContentExam = new mtmListTableCourseContent(options);
  this.elThis.appendChild(this.clListTableCourseContentExam.elThis);
  // hide clinic course viewer
  this.clListTableCourseContentExam.show(false);
};

mtmStudyContainer.prototype._createContentListViewer = function () {
  this._createContentTabsViewer();
  this._createCourseListViewer(); // 기본 콘텐츠 리스트
  this._createClinicListViewer(); // 추천 콘텐츠 리스트
  this._createExamListViewer(); // 평가 콘텐츠 리스트
};

mtmStudyContainer.prototype._initEvents = function () {
  mtoEvents.on("OnUpdateLessonResult", this.onUpdateLessonResultHandler.bind(this));
  mtoEvents.on("OnUpdateTestumResult", this.onUpdateTestumResultHandler.bind(this));
  // mtoEvents.on('OnChangeProgressPoint',this.onChangeProgressHandler.bind(this));
};

mtmStudyContainer.prototype._init = function () {
  this.elThis = document.createElement("div");

  this._createCourseSelector();

  // this._createTimelineSelector();

  this._createContentListViewer();

  // this._initEvents();
  // this._urlGetStudentInfo();
  this._urlGetAssignedCourseInfo();
};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler ////////////////////////////////////
mtmStudyContainer.prototype.onUpdateLessonResultHandler = function (eData) {
  // eData = {};
  // eData.content_id = this.options.content_id;
  // eData.student_id = this.options.student_id;
  // eData.course_id = this.options.course_id;
  // eData.course_id = this.options.course_id;
  // eData.class_id = this.options.class_id;
  // eData.results = this.player.lesson_result_new;
  // eData.progress =
  // eData.point =

  console.log("mtmStudyContainer > onUpdateLessonResultHandler : ", eData);
  // this.clListTableCourseContentNormal.updateStudyProgressPointInfo(eData);
};

mtmStudyContainer.prototype.onUpdateTestumResultHandler = function (eData) {
  console.log("mtmStudyContainer > onUpdateTestumResultHandler : ", eData);
};

mtmStudyContainer.prototype.onChangeProgressHandler = function (eData) {};

mtmStudyContainer.prototype.onCourseSelectHandler = function (title, index) {
  this.selected_course_index = index;

  if (this.course_list.length == 0) return;
  var eData = {};
  eData.student_id = this.student_info.student_id;
  // basic course
  eData.course_type = 0;
  eData.course_list = [];
  var start_idx = index;
  var length = this.course_list.length;

  if (index == 0 && this.course_list.length > 1) start_idx = 1;
  else length = parseInt(index) + 1;

  // console.log('mtmStudyContainer > onCourseSelectHandler :',this.course_list,index,length);

  for (var i = start_idx; i < length; i++) {
    var course = {};
    console.log(this.course_list[i]);
    course.class_id = this.course_list[i].class_id;
    course.course_id = this.course_list[i].course_id;
    eData.course_list.push(course);
  }

  // this._urlGetCourseContent(eData);
  this._urlGetCourseContentInfo(eData);
};

// eData == eventData
mtmStudyContainer.prototype.onChangeWeekHandler = function (eData) {
  // this._urlGetAssignedContent(eData);
  // 여기서는 내부에 있는 데이터만 바꾸고 url 은 하지 말자.
};

mtmStudyContainer.prototype.onContentTabActivateHandler = function (index) {
  if (this.contentTabIndex == index) return;
  this.contentTabIndex = index;
  if (this.contentTabIndex == 0) {
    // console.log('mtmStudyContainer > onContentTabActivateHandler : show main');
    // main course content
    this.clListTableCourseContentNormal.show(true);
    this.clListTableCourseContentClinic.show(false);
    this.clListTableCourseContentExam.show(false);
  } else if (this.contentTabIndex == 1) {
    // console.log('mtmStudyContainer > onContentTabActivateHandler : show clinic');
    // clinic content
    this.clListTableCourseContentClinic.show(true);
    this.clListTableCourseContentNormal.show(false);
    this.clListTableCourseContentExam.show(false);
  } else if (this.contentTabIndex == 2) {
    // console.log('mtmStudyContainer > onContentTabActivateHandler : show exam');
    // exam content
    this.clListTableCourseContentClinic.show(false);
    this.clListTableCourseContentNormal.show(false);
    this.clListTableCourseContentExam.show(true);
  }
};

mtmStudyContainer.prototype.onClickCourseContentHandler = function (eData) {
  // console.log('mtmStudyContainer : onClickCourseContentHandler > ',eData);
  // data.content_id = rowData.content_id;
  // data.type = rowData.type;
  // class id ? course id ?
  var bFind = false;
  for (var i = 0; i < this.study_list.length; i++) {
    for (var j = 0; j < this.study_list[i].content_list.length; j++) {
      if (this.study_list[i].content_list[j].id == eData.content_id) {
        // eData.title = this.study_list[i].results.property[j].content_title;
        // content detail == unit info 를 전달
        eData.units = this.study_list[i].content_list[j].units;
        eData.valids = [];

        // for clinic compatible
        for (var k = 0; k < eData.units.length; k++) eData.valids.push(1);

        // study result 전달
        // 결과가 아직 없으면....
        if (this.study_list[i].result_list.length <= j) {
          // 여기서 전달 - 진짜 어려운 Data 구조
          // console.log('mtmStudyContainer > onClickCourseContentHandler : 여기서 전달' );
          this.study_list[i].result_list[j].results = [];
        }

        eData.results = this.study_list[i].result_list[j].results;

        eData.class_id = this.study_list[i].class_id;
        eData.course_id = this.study_list[i].course_id;

        bFind = true;
        break;
      }
    }
    if (bFind) break;
  }

  eData.content_title = eData.title;
  eData.content_type = eData.type;
  // normal type
  eData.course_type = 0;

  eData.student_id = this.student_info.student_id;
  console.log("mtmStudyContainer > onClickCourseContentHandler : ", eData);

  mtoEvents.emit("OnChangeCourseContent", eData);
};

mtmStudyContainer.prototype.onClickClinicContentHandler = function (eData) {
  // console.log('mtmStudyContainer : onClickClinicContentHandler > ',eData);
  var bFind = false;

  var idx = eData.course_idx;

  // Error
  if (this.clinic_list.length <= idx) return;

  // course_id
  if (this.clinic_list[idx].properties.ref_id) eData.course_id = this.clinic_list[idx].properties.ref_id;
  else if (this.clinic_list[idx].properties.base_id) eData.course_id = this.clinic_list[idx].properties.base_id;

  // clinic_id
  if (this.clinic_list[idx].clinic_id) {
    eData.clinic_id = this.clinic_list[idx].clinic_id;
    eData.class_id = this.clinic_list[idx].class_id;
  }

  // class_id 는 필요 없음.

  var content_list = this.clinic_list[idx].properties.property;

  for (var i = 0; i < content_list.length; i++) {
    if (content_list[i].id == eData.content_id) {
      eData.units = content_list[i].units;
      // clinic specific
      eData.valids = content_list[i].valids;

      // 결과가 아직 없으면....
      if (!content_list[i].results) {
        // 여기서 전달 - 진짜 어려운 Data 구조
        content_list[i].results = [];
        // console.log('mtmStudyContainer > onClickClinicContentHandler : 여기서 전달' );
      }

      eData.results = content_list[i].results;

      bFind = true;
      break;
    }
  }

  eData.content_title = eData.title;
  eData.content_type = eData.type;
  // clinic type
  eData.course_type = 1;
  eData.student_id = this.student_info.student_id;

  console.log("mtmStudyContainer > onClickClinicContentHandler : ", eData);

  mtoEvents.emit("OnChangeClinicContent", eData);
};

mtmStudyContainer.prototype.onClickExamContentHandler = function (eData) {
  // console.log('mtmStudyContainer : onClickExamContentHandler > ',eData);
  eData.student_id = this.student_info.student_id;

  mtoEvents.emit("OnChangeExamContent", eData);
};

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// API ///////////////////////////////////////
mtmStudyContainer.prototype.setWide = function (bWide) {
  this.clListTableCourseContentNormal.setWide(bWide);
  this.clListTableCourseContentClinic.setWide(bWide);
  // if(bWide)
  //     this.elThis.classList.add('px-0');
  // else
  //     this.elThis.classList.remove('px-0');
};

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// URL  //////////////////////////////////////////
// content = {'class_id': class_id, 'course_id':courses[0].id, 'title':courses[0].title}
// 1) 하나도 없을때,
// 2) 하나만 있을때,
// 3) 여러개 있을때,
mtmStudyContainer.prototype._aurlGetAssignedCourseInfo = function (result) {
  // console.log('mtmStudyContainer : _afterAssignedCourse > ', result);
  this.course_list = [];
  this.coursetitle_list = [];
  this.student_info.student_name = result.student_name;
  this.student_info.student_id = result.student_id;

  if (result.content_list.length == 0) {
    // 하나도 없을 때
    this.clCourseSelector.setList([]);
    this.clCourseSelector.setTitle("코스 없음"); // No Course
    return;
  } else {
    if (result.content_list.length > 1) {
      // content = {'class_id': str(class_id), 'course_id':str(courses[0].id), 'title':courses[0].title}
      var content = { class_id: "?", course_id: "?", title: "모든 코스" };
      this.course_list.push(content);
      this.coursetitle_list.push("모든 코스");
    }

    for (var i = 0; i < result.content_list.length; i++) {
      this.course_list.push(result.content_list[i]);
      this.coursetitle_list.push(result.content_list[i].title);
    }

    if (result.content_list.length == 1) {
      // 코스가 하나면....
      //
      this.clCourseSelector.setList(this.coursetitle_list);
      this.clCourseSelector.setTitle(this.coursetitle_list[0]);

      // 한 개 이니까 무조건 코스 콘텐츠를 부른다.
      var eData = {};
      eData.student_id = this.student_info.student_id;
      eData.course_type = 0;
      eData.course_list = [];
      var course = {};
      // console.log(this.course_list[i]);
      course.class_id = this.course_list[0].class_id;
      course.course_id = this.course_list[0].course_id;
      eData.course_list.push(course);
      // this._urlGetCourseContent(eData);
      this._urlGetCourseContentInfo(eData);
    } // 코스가 여러개면..
    else {
      this.clCourseSelector.setList(this.coursetitle_list);
      this.clCourseSelector.setTitle(this.student_info.student_name + " : 코스 선택");
    }
  }
};

// 이걸 통해서 student_code 를 통해서 student_id 와 student_name 을 구해온다.
//
mtmStudyContainer.prototype._urlGetAssignedCourseInfo = function () {
  console.log(
    "mtmStudyContainer > _urlGetAssignedCourseInfo: ",
    this.student_info.student_code,
    this.student_info.student_name,
  );

  var self = this;
  var formData = new FormData();
  // 여기서는 정해진 student_code 로 시험한다.
  // var student_code = '22090001';

  // this.student_code = student_code;
  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("student_code", this.student_info.student_code);

  var url = "/st/getassignedcourseinfo/";
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
      self._aurlGetAssignedCourseInfo.call(self, res.result);
    },
    error: function (err) {
      console.log(err);
      // window.location.href = "/";
    },
  }); // end of ajax
};

// mtmStudyContainer.prototype._aurlGetAssignedContent = function(result) {

//     console.log('mtmStudyContainer > _aurlGetAssignedContent : ', result);
//     this.content_list = result.content_list;
//     this.clinic_list = result.clinic_list;
//     this.exam_list = result.exam_list;
//     // for(var i=9;i<this.content_list.length;i++)
//     // {
//     //     // setContent

//     // }
//     if(this.content_list)
//     {
//         this.clListTableCourseContentNormal.setContent(this.content_list);
//         this.clContentTabs.setBadge(0, this.content_list.length);
//     }
//     if(this.clinic_list)
//     {
//         this.clListTableCourseContentClinic.setContent(this.clinic_list);
//         this.clContentTabs.setBadge(1, this.clinic_list.length);
//     }
//     if(this.exam_list)
//     {
//         this.clListTableCourseContentExam.setContent(this.exam_list);
//         this.clContentTabs.setBadge(2, this.exam_list.length);
//     }
// }

// // Content = Course Content
// mtmStudyContainer.prototype._urlGetAssignedContent = function(eData) {
//     var self = this;
//     var formData = new FormData();

//     formData.append('csrfmiddlewaretoken', csrftoken);

//     // student_id, class_id , course_id

//     formData.append('student_code', this.student_info.student_code);
//     formData.append('student_id', this.student_info.student_id);

//     // console.log('_urlGetAssignedContent : ', this.student_id)
//     var fromdate = mtoCalendar.formatDate(eData.fromDate.getFullYear(),eData.fromDate.getMonth()+1,eData.fromDate.getDate());
//     var todate = mtoCalendar.formatDate(eData.toDate.getFullYear(),eData.toDate.getMonth()+1,eData.toDate.getDate());
//     formData.append('from_date',fromdate);
//     formData.append('to_date',todate);

//     // 지금 현재는 모든 content_list 에 대하여 가져온다.
//     var content_list = [];
//     // 모든 코스를 보낸다.
//     var all_course_list = [];

//     for(var i=0;i<this.course_list.length;i++)
//         all_course_list.push(this.course_list[i]);

//     // 여기서 어떤 Course 를 선택했는지를 결정해서
//     // 원하는 Course List 를 보낸다.

//     if(this.selected_course_index == -1)
//     {
//         for(var i=0;i<this.course_list.length;i++)
//             content_list.push(this.course_list[i]);
//     }
//     else if(this.course_list.length > this.selected_course_index)
//     {
//         if(this.course_list[this.selected_course_index].class_id == '?')
//         {
//             for(var i=0;i<this.course_list.length;i++)
//                 content_list.push(this.course_list[i]);
//         }
//         else
//         {
//             content_list.push(this.course_list[this.selected_course_index]);
//         }
//     }

//     console.log('mtmStudyContainer > _urlGetAssignedContent : ',content_list);

//     // 선택된 course 리스트 or 전체 course list
//     formData.append('content_list', JSON.stringify(content_list));
//     // 전체 course list
//     formData.append('all_course_list', JSON.stringify(all_course_list));

//     // var url = "/st/getassignedcontent/";
//     var url = "/st/getassignedcontentnew/";

//     $.ajax({
//         url: url,
//         data: formData,
//         // enctype: 'multipart/form-data',
//         processData: false,
//         contentType: false,
//         method: 'POST',
//         type: 'POST',
//         cache: false,

//         success: function(res){
//             // self._setClassList.call(self,res.result);
//             self._aurlGetAssignedContent.call(self,res.result);
//         },
//         error : function() {
//             window.location.href = '/';
//         }
//     }); // end of ajax
// }

mtmStudyContainer.prototype._aurlGetStudentInfo = function (result) {
  this.student_info.student_id = result.id;
  this.student_info.student_code = result.code;
  this.student_info.student_name = result.name;

  if (this.student_info.student_code) this._urlGetAssignedCourse();
};

mtmStudyContainer.prototype._urlGetStudentInfo = function () {
  var self = this;
  var formData = new FormData();
  // 여기서는 정해진 student_code 로 시험한다.
  // var student_code = '22920003';
  // this.student_code = student_code;

  formData.append("csrfmiddlewaretoken", csrftoken);
  // formData.append('student_code', this.student_code);

  var url = "/st/getstudentinfo/";
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
      self._aurlGetStudentInfo.call(self, res.result);
    },
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};

// result = {
//      study_list : [
//          {
//              class_id : , course_id,
//              content_list : JSON([]),
//              results : JSON({ propertiy : [] }),
//          }
//      ]
// }

// 왜 정규 코스와 클리닉 코스는 따로 따로 관리하나??
// 정규 코스의 일정은 Class/학생 에 따라서 조정되나,
// 클리닉 코스는 개별 학생에 따라서 조정되므로...
// 정규 코스의 일정은 산출방식은 Class -> Student 두 단계를 거침.
// 클리닉 코스는 각 Student 별로 관리해도 됨.
mtmStudyContainer.prototype._aurlGetCourseContentInfo = function (result) {
  // var result_list = JSON.parse(result.result_list);
  // console.log('mtmStudyContainer > _aurlGetCourseContentInfo : ', result);
  // result {
  //      study_list : [],
  //      clinic_list : [],
  // }
  this.study_list = [];
  // this.current_list = [];
  this.clinic_list = [];

  for (var i = 0; i < result.study_list.length; i++) {
    var result_info = {};
    result_info.class_id = result.study_list[i].class_id;
    result_info.course_id = result.study_list[i].course_id;

    result_info.content_list = JSON.parse(result.study_list[i].content_list);
    var results = JSON.parse(result.study_list[i].results);
    result_info.result_list = results.property;
    this.study_list.push(result_info);
  }

  for (var i = 0; i < result.clinic_list.length; i++) {
    // var clinic_info = JSON.parse(result.clinic_list[i]);
    this.clinic_list.push({
      class_id: result.clinic_list[i].class_id,
      clinic_id: result.clinic_list[i].clinic_id,
      properties: JSON.parse(result.clinic_list[i].properties),
    });
  }

  console.log("mtmStudyContainer > _aurlGetCourseContentInfo : ", this.study_list, this.clinic_list);

  if (this.study_list.length == 0) {
    this.clListTableCourseContentNormal.setStudyResultListInfo({ content_list: [], study_list: [] });
    this.clContentTabs.setBadge(0, 0);
  } else {
    for (var i = 0; i < this.study_list.length; i++) {
      var size = this.clListTableCourseContentNormal.setStudyResultListInfo(this.study_list[i]);
      this.clContentTabs.setBadge(0, size);
    }
  }

  var size = this.clListTableCourseContentClinic.setClinicList(this.clinic_list);

  this.clContentTabs.setBadge(1, size);
};

mtmStudyContainer.prototype._urlGetCourseContentInfo = function (eData) {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);

  //  parameters : {
  //      student_id : student_id,
  //      course_list : [
  //          {class_id, course_id} ,
  //          {class_id, course_id} ,
  //          ... ,
  //      ]
  //  }
  formData.append("parameters", JSON.stringify(eData.course_list));
  formData.append("course_type", eData.course_type);
  formData.append("student_id", eData.student_id);

  var url = "/st/getcoursecontentinfo/";
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
      self._aurlGetCourseContentInfo.call(self, res.result);
    },
    error: function () {
      // window.location.href = "/";
    },
  }); // end of ajax
};
