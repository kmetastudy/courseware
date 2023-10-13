import { mtvComponentBuilder } from "../../../core/utils/mtv-component-builder.js";
import { mtvEvents } from "../../../core/utils/mtv-events.js";
import { mtmListTableStatisticsCourseTruth } from "../../../core/component/mtm-list-table-statistics-course-truth.js";
import { mtmPlayerTestumTitle } from "../testum/mtm-player-testum-title.js";

// this.clListTableStatisticsCourseTruth = new mtvStatCourseTruthTable();
export var mtmStatStudyCourseTruthViewer = function (options) {
  this.id = "id-mtm-stat-study-course-truth-viewer-" + mtmStatStudyCourseTruthViewer.id++;
  this.options = options;
  if (!this.options) this.options = {};

  this.elThis = null;

  this._init();
};

mtmStatStudyCourseTruthViewer.id = 0;

mtmStatStudyCourseTruthViewer.staticBody = [
  // Study 결과
  { level: 0, comp: "mtm-stat-study-course-title" },
  { level: 0, comp: "mtm-stat-study-course-truth" },
];

mtmStatStudyCourseTruthViewer.prototype._create = function (tagList) {
  var topElement = document.createElement("div");

  // topElement.setAttribute('class','mtv-top-element');

  var componentList = [];
  var level = 0;
  var element = null;

  componentList.push(topElement);

  if (tagList) {
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i]["comp"]) {
        if (tagList[i]["comp"] == "mtm-stat-study-course-title") {
          var options = {};
          options.title = "코스 제목";

          // this.clCourseTitle = mtvComponentBuilder.build(tagList[i]["comp"],options);
          this.clCourseTitle = new mtmPlayerTestumTitle(options);

          element = this.clCourseTitle.elThis;
        }
        if (tagList[i]["comp"] == "mtm-stat-study-course-truth") {
          this.clListTableStatisticsCourseTruth = new mtmListTableStatisticsCourseTruth();
          element = this.clListTableStatisticsCourseTruth.elThis;
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

mtmStatStudyCourseTruthViewer.prototype._init = function () {
  this.elThis = this._create(mtmStatStudyCourseTruthViewer.staticBody);
  mtvEvents.on("OnChangeStatCourse", this.onChangeStatCourse.bind(this));
};

mtmStatStudyCourseTruthViewer.prototype._afterCourseStat = function (result) {
  console.log("mtmStatStudyCourseTruthViewer > _afterContentStat : ", result);
  this.clListTableStatisticsCourseTruth.setRawData(result.content_list, result.contentresult_list);
};

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Ajax //////////////////////////////////////
mtmStatStudyCourseTruthViewer.prototype._requestCourseStat = function () {
  var self = this;
  var formData = new FormData();

  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("student_id", this.options.student_id);
  formData.append("class_id", this.options.class_id);
  formData.append("course_id", this.options.course_id);
  // formData.append('content_id', this.options.content_id);
  // formData.append('content_type', this.options.content_type);

  console.log("mtmStatStudyCourseTruthViewer > _requestCourseStat :", this.options.class_id, this.options.course_id);
  var url = "/st/getcoursestat/";
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
      self._afterCourseStat.call(self, res.result);
    },
  }); // end of ajax
};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler ////////////////////////////////////
mtmStatStudyCourseTruthViewer.prototype.onChangeStatCourse = function (eData) {
  // eData.text = text;
  // eData.index = index;
  // eData.studentInfo = this.studentInfo;
  // eData.courseListInfo = this.courseListInfo;
  this.requestCourseStat(
    eData.studentInfo.student_id,
    eData.courseListInfo[eData.index].class_id,
    eData.courseListInfo[eData.index].course_id,
  );
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// API //////////////////////////////////////
mtmStatStudyCourseTruthViewer.prototype.requestCourseStat = function (student_id, class_id, course_id) {
  this.options.student_id = student_id;
  this.options.class_id = class_id;
  this.options.course_id = course_id;
  this._requestCourseStat();
};
