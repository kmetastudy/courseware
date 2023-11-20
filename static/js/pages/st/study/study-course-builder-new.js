import { mtoContentFormat } from "../../../core/utils/mto-content-format";
import { API } from "../../../core/api/api";
import { mtoEvents } from "../../../core/utils/mto-events";

import { TestumPlayer } from "../testum/testum-player";
import { LessonPlayer } from "../lesson/lesson-player";

export class StudyCourseBuilder {
  constructor(options = {}) {
    this.options = options;

    this.courseId = options.courseId ?? null;
    this.data = null;

    this.api = new API();

    this.init();
  }

  init() {
    this.elThis = document.createElement("div");

    const playerOptions = {
      modeStudent: true, // 필요없을거같은데..
      eventExamStartHandler: this.handleExamStart.bind(this),
    };

    this.testumPlayer = new TestumPlayer(playerOptions);
    this.lessonPlayer = new LessonPlayer(playerOptions);

    this.testumPlayer.show(false);
    this.lessonPlayer.show(false);

    // this.elThis.appendChild(this.testumPlayer.getElement());
    // this.elThis.appendChild(this.lessonPlayer.getElement());
    this.elThis.appendChild(this.testumPlayer.elThis);
    this.elThis.appendChild(this.lessonPlayer.elThis);

    this.initEvents();
    this.getCourseData(this.courseId);
  }

  initEvents() {
    mtoEvents.on("OnChangeCourseContent", this.handleContentChange.bind(this));
  }

  //////// Handler ////////
  handleExamStart(eData) {
    const now = new Date();
    const time = parseInt(now.getTime() / 1000);
    this.urlUpdateExamResult(time);
  }

  async handleContentChange(content_id) {
    try {
      const content = this.findContent(this.data.lists, content_id);
      const units = content.units;
      //
      const title = content.title;
      const elements = content.elements; //
      // TODO
      // results = this.urlGetResult()
      const element_list = await this.urlGetElementList({
        ids: elements.ids,
        types: elements.types,
      });

      const content_type = content.type;
      const contentConfig = {
        course_id: this.courseId,
        content_id,
        title,
        content_type,
        results: [],
        // units와 content_list는, 일단은 항상 길이가 1인 배열로 둔다.
        // 나중에 되돌려야되거나 하면, 변경하기 쉽게 하기 위함.
        units: [content.elements], // -> [{ids:[], types:[]}, ]
        content_list: [element_list], // [{result:[], repeat:[], first:[], seconds:[]}, ]
      };

      if (content_type === 11 || content_type === 13) {
        this.studyTestum(contentConfig);
      } else if (content_type === 12) {
        this.studyLesson(contentConfig);
      }
    } catch (err) {
      console.error(err);
    }
  }

  //////// URL ////////
  urlUpdateExamResult(time) {
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
        console.log("update exam result success");
      },
      error: function (err) {
        console.log(err);
        window.location.href = "/";
      },
    }); // end of
  }

  async urlGetCourse(courseId) {
    try {
      const endpoint = `../cp/api/course/${courseId}/`;
      const result = await this.api.get(endpoint);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async urlGetElementList(data) {
    try {
      const endpoint = "../st/get-element-list/";
      console.log(data);
      const result = await this.api.post(endpoint, data);
      if (result.data) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  //////// API ////////
  async getCourseData(courseId) {
    if (!courseId) {
      return;
    }
    try {
      const data = await this.urlGetCourse(courseId);
      if (!data) {
        this.data = null;
      }
      this.data = JSON.parse(data?.json_data);
    } catch (err) {
      throw new Error("getCourseData Error: ", err);
    }
  }

  studyTestum(playOptions) {
    // 테스텀에 동영상이 있으면...
    this.testumPlayer.stopPreviousContent();
    // 무조건 기존에 하던 Lesson Play를 멈춘다.
    this.lessonPlayer.stopLesson();

    this.testumPlayer.setPlayOptions(playOptions);

    this.lessonPlayer.show(false);

    // Todo. Jstar : Exam or Normal Testum
    // 여기도 잠시 ... testum 인지 exam 인지에 따라서 바뀌지 않을까?
    this.testumPlayer.startTestum();
    this.testumPlayer.show(true);
  }

  studyLesson(playOptions) {
    // 테스텀에 동영상이 있으면...
    this.testumPlayer.stopPreviousContent();
    // 무조건 기존에 하던 Lesson Play를 멈춘다.
    this.lessonPlayer.stopLesson();

    // 사실상 Lesson 은 PlayMode 가 중요하지 않는다.
    this.lessonPlayer.setPlayOptions(playOptions);

    this.testumPlayer.show(false);

    this.lessonPlayer.startLesson();
    this.lessonPlayer.show(true);
  }
  //////// UTIL ////////
  findContent(contents, content_id) {
    const filtered = contents.filter((content) => content.id === content_id);
    return filtered.length > 0 ? filtered[0] : {};
  }
}
