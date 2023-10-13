import { mtvComponentBuilder } from "../../../core/utils/mtv-component-builder.js";
import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";
import { mtvEvents } from "../../../core/utils/mtv-events.js";
import { mtmInputSelectScroll } from "../../../core/ui/input/mtm-input-select-scroll.js";

export var mtmStatContainer = function (options) {
  this.id = "id-mtm-stat-container-" + mtmStatContainer.id++;
  this.elThis = null;
  this.options = options;

  this.course_list = [];
  this.coursetitle_list = [];
  this.student_info = {};

  this._init();
};

mtmStatContainer.id = 0;

mtmStatContainer.staticPlayground = [
  // 전체
  { level: 0, tag: "div" },
  // 내 코스 선택 보기
  { level: 1, comp: "mtm-input-select-scroll" },
  // 통계 보기
  // {'level':1, 'comp':'mtv-stat-testum',},
];

mtmStatContainer.prototype._create = function (tagList) {
  var topElement = document.createElement("div");

  // topElement.setAttribute('class','mtv-top-element');

  var componentList = [];
  var level = 0;
  var element = null;

  componentList.push(topElement);

  if (tagList) {
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i]["comp"]) {
        if (tagList[i]["comp"] == "mtm-input-select-scroll") {
          var options = {};
          options.items = ["코스 선택"];
          // options.list = [];
          options.eventHandler = this.onChangeCourseHandler.bind(this);

          // this.clCourseSelector = mtvComponentBuilder.build(tagList[i]["comp"],options);
          this.clCourseSelector = new mtmInputSelectScroll(options);
          // console.log(this.clCourseSelector);
          element = this.clCourseSelector.elThis;
          // this.selectCourseId = this.clCourseSelector.id;
          this.clCourseSelector.elThis.style.width = "80%";
          // console.log('element : ', element);
        } else if (tagList[i]["comp"] == "mtv-stat-testum") {
          var options = {};
          console.log("mtv-stat-testum");
          this.clStatTestum = new mtvStatTestum(options);
          element = this.clStatTestum.elThis;
        } else if (tagList[i]["comp"] == "mtv-stat-lesson") {
          var options = {};
        }
      } else {
        element = mtvElementBuilder.createElement(tagList[i]);
      }

      level = tagList[i]["level"];

      componentList[level].appendChild(element);
      componentList[level + 1] = element;
    }
  }

  return topElement;
};

mtmStatContainer.prototype._init = function () {
  this.elThis = document.createElement("div");

  var container = this._create(mtmStatContainer.staticPlayground);

  this.elThis.appendChild(container);

  this._requestStudentInfo();
};

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Ajax  /////////////////////////////////////////
// content = {'class_id': class_id, 'course_id':courses[0].id, 'title':courses[0].title}
mtmStatContainer.prototype._afterAssignedCourse = function (result) {
  this.course_list = [];
  this.coursetitle_list = [];
  this.student_info.student_name = result.student_name;
  this.student_info.student_id = result.student_id;

  if (result.content_list.length > 1) {
    // content = {'class_id': str(class_id), 'course_id':str(courses[0].id), 'title':courses[0].title}
    var content = { class_id: "?", course_id: "?", title: "전체 코스" };
    this.course_list.push(content);
    this.coursetitle_list.push("전체 코스");
  }

  for (var i = 0; i < result.content_list.length; i++) {
    this.course_list.push(result.content_list[i]);
    this.coursetitle_list.push(result.content_list[i].title);
  }

  // this.clQuestionBookSelector.setList(this.questionBookItems);
  this.clCourseSelector.setList(this.coursetitle_list);
  this.clCourseSelector.setTitle(this.student_info.student_name + " : 코스 선택");
  // 위로 올리자...
  // mtvEvents.emit('OnCourseListInfo',this.course_list);
};

mtmStatContainer.prototype._requestAssignedCourse = function () {
  console.log(
    "mtmStatContainer > _requestAssignedCourse: ",
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

  var url = "/st/getassignedcourse/";
  $.ajax({
    url: url,
    data: formData,
    // enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._afterAssignedCourse.call(self, res.result);
    },
  }); // end of ajax
};

mtmStatContainer.prototype._afterAssignedContent = function (result) {
  this.content_list = result.content_list;
  // for(var i=9;i<this.content_list.length;i++)
  // {
  //     // setContent

  // }
  this.clCourseListViewer.setContent(this.content_list);
};

mtmStatContainer.prototype._requestAssignedContent = function (eData) {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("student_code", this.student_info.student_code);
  formData.append("student_id", this.student_info.student_id);

  // console.log('_requestAssignedContent : ', this.student_id)
  var fromdate = mtvCalendar.formatDate(
    eData.fromDate.getFullYear(),
    eData.fromDate.getMonth() + 1,
    eData.fromDate.getDate(),
  );
  var todate = mtvCalendar.formatDate(eData.toDate.getFullYear(), eData.toDate.getMonth() + 1, eData.toDate.getDate());
  formData.append("from_date", fromdate);
  formData.append("to_date", todate);

  // 지금 현재는 모든 content_list 에 대하여 가져온다.
  var content_list = [];

  // 여기서 어떤 Course 를 선택했는지를 결정해서
  // 원하는 Course List 를 보낸다.
  if (this.selected_course_index == -1) {
    for (var i = 0; i < this.course_list.length; i++) content_list.push(this.course_list[i]);
  } else if (this.course_list.length > this.selected_course_index) {
    if (this.course_list[this.selected_course_index].class_id == "?") {
      for (var i = 0; i < this.course_list.length; i++) content_list.push(this.course_list[i]);
    } else {
      content_list.push(this.course_list[this.selected_course_index]);
    }
  }

  formData.append("content_list", JSON.stringify(content_list));

  var url = "/st/getassignedcontent/";
  $.ajax({
    url: url,
    data: formData,
    // enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    method: "POST",
    type: "POST",
    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._afterAssignedContent.call(self, res.result);
    },
  }); // end of ajax
};

mtmStatContainer.prototype._afterStudentInfo = function (result) {
  this.student_info.student_id = result.id;
  this.student_info.student_code = result.code;
  this.student_info.student_name = result.name;

  // 위로 올리자
  // 심지어는 Menu(메뉴) 까지도....
  // mtvEvents.emit('OnStudentInfo',this.student_info);
  console.log("mtmStatContainer > _afterStudentInfo :", this.student_info);
  if (this.student_info.student_code) this._requestAssignedCourse();
};

mtmStatContainer.prototype._requestStudentInfo = function () {
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
    success: function (res) {
      // self._setClassList.call(self,res.result);
      self._afterStudentInfo.call(self, res.result);
    },
  }); // end of ajax
};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler ////////////////////////////////////
mtmStatContainer.prototype.onChangeCourseHandler = function (text, index) {
  console.log("mtmStatContainer > onChangeCourseHandler :", text, index);
  var eData = {};
  eData.text = text;
  eData.index = index;
  // eData.studentInfo = this.studentInfo;
  eData.studentInfo = this.student_info;

  // eData.courseListInfo = this.courseListInfo;
  eData.courseListInfo = this.course_list;
  console.log("mtmStatContainer > onChangeCourseHandler :", eData.courseListInfo);

  mtvEvents.emit("OnChangeStatCourse", eData);
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// API //////////////////////////////////////

mtmStatContainer.prototype.show = function () {
  // this.clStatTestum.show();
};
