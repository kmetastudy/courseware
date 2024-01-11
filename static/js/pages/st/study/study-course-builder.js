import { mtoEvents } from "../../../core/utils/mto-events";
import { mtoContentFormat } from "../../../core/utils/mto-content-format.js";

import { TestumPlayer } from "../testum/testum-player";
import { LessonPlayer } from "../lesson/lesson-player";

require("../../../../css/pages/st/study/study-course-builder.css");
export class StudyCourseBuilder {
  constructor(options = {}) {
    this.id = "id-mtm-study-builder-" + StudyCourseBuilder.id++;
    this.elThis = null;
    this.options = options;

    this.initialize();
  }

  initialize() {
    this.initializePlayer();

    this.createNodes();

    this.initializeEvents();
  }

  initializePlayer() {
    this.clTestumPlayer = new TestumPlayer({ modeStudent: true });

    this.clLessonPlayer = new LessonPlayer({ modeStudent: true });

    this.clTestumPlayer.show(false);
    this.clLessonPlayer.show(false);
  }

  createNodes() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add("st-course-builder");

    this.elThis.appendChild(this.clTestumPlayer.elThis);
    this.elThis.appendChild(this.clLessonPlayer.elThis);
  }

  initializeEvents() {
    mtoEvents.on("OnChangeCourseContent", this.handleChangeContent.bind(this));
    mtoEvents.on("onAsidePositionChange", this.handleAsidePositionChange.bind(this));
  }
  // ============ Handler ============
  /**
   *
   * @param {Object} params
   * @param {string} params.course_id - id of course book
   * @param {string} params.title - title of branch
   * @param {string} params.content_id - id of branch(lesson/testum), format:  'aa-aa-bb'
   * @param {number} params.content_type - type of branch(lesson/testum), testum: 11, lesson: 12, exam: 13
   */
  async handleChangeContent({ student_id, course_id, content_id, content_type, title, results }) {
    try {
      // const options = {
      //   demo: parsedContext.demo,
      //   userType: parsedContext.userType,
      //   courseId: parsedContext.courseId,
      //   studentId: parsedContext.userId,
      //   userLogin: parsedContext.userLogin,
      //   contentId: parsedContext.contentId,
      // };
      const content = await this.urlGetContent({
        course_id: course_id,
        content_id: content_id,
        content_type: content_type,
      });

      this.options.student_id = student_id;
      this.options.course_id = course_id;
      this.options.content_id = content_id;
      this.options.title = title;
      this.options.content_list = content.content_list;
      this.options.content_type = content.content_type;
      this.options.units = content.units;

      this.options.results = results ?? [];

      const { TESTUM, LESSON, EXAM } = mtoContentFormat;

      if (content.content_type === TESTUM || content.content_type === EXAM) {
        this._studyTestum();
        // } else if (content.content_type === 11) {
      } else {
        this._studyLesson();
      }
    } catch (err) {
      console.error(err);
    }
  }

  handleAsidePositionChange({ position, width }) {
    this.setPosition(position, width);
  }
  // ============ Api ============
  _studyTestum() {
    this.clTestumPlayer.stopPreviousContent();

    this.clLessonPlayer.stopLesson();

    this.clTestumPlayer.setPlayOptions(this.options);

    this.clLessonPlayer.show(false);

    this.clTestumPlayer.startTestum();

    this.clTestumPlayer.show(true);
  }

  _studyLesson() {
    this.clTestumPlayer.stopPreviousContent();

    this.clLessonPlayer.stopLesson();

    this.clLessonPlayer.setPlayOptions(this.options);

    this.clTestumPlayer.show(false);

    this.clLessonPlayer.startLesson();

    this.clLessonPlayer.show(true);
  }

  setPosition(position, width) {
    const positionAttribute = `margin-${position}:${width}px;`;
    this.elThis.setAttribute("style", positionAttribute);
  }
  // ============ Ajax ============
  async urlGetContent({ course_id, content_id, content_type }) {
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
  }
}
