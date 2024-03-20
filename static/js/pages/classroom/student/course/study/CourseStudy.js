import { TYPE_CONTENT } from "../../../../st/constants";
import { store } from "../../Store";

import elem from "../../../../../core/utils/elem/elem";

import { TestumPlayer } from "../../../../st/testum/testum-player";
import { LessonPlayer } from "../../../../st/lesson/lesson-player";

require("../../../../../../css/pages/st/study/study-course-builder.css");
export class CourseStudy {
  constructor() {
    this.title = "일정 할당하기";

    this.initStates();

    this.initPlayers();

    this.create();
  }

  initStates() {
    this.isActive = false;

    this.studyResult = null;
    this.course = null;

    this.playerConfig = {
      student_id: null,
      course_id: null,
      content_id: null,
      title: null,
      content_list: null,
      content_type: null,
      units: null,
      results: null,
    };
  }

  initPlayers() {
    this.clTestumPlayer = new TestumPlayer({ modeStudent: true });
    this.elTestumPlayer = this.clTestumPlayer.elThis;

    this.clLessonPlayer = new LessonPlayer({ modeStudent: true });
    this.elLessonPlayer = this.clLessonPlayer.elThis;

    this.clTestumPlayer.show(false);
    this.clLessonPlayer.show(false);
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10 hidden",
    });

    this.elPlayerContainer = elem("div", { class: "st-course-builder col-span-12" });
    this.elThis.append(this.elPlayerContainer);

    this.elPlayerContainer.append(this.elTestumPlayer, this.elLessonPlayer);
  }

  activate() {
    this.elThis.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate() {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  updateData({ studyResult } = {}) {
    this.studyResult = studyResult;
  }

  async changeContent({ content, studyResultProperty } = {}) {
    const { content_list, content_type, units } = content;
    const { id: content_id, title, results } = studyResultProperty;
    const { id_student: student_id, id_course: course_id } = this.studyResult;

    this.playerConfig.student_id = student_id;
    this.playerConfig.course_id = course_id;
    this.playerConfig.content_id = content_id;
    this.playerConfig.title = title;
    this.playerConfig.content_list = content_list;
    this.playerConfig.content_type = content_type;
    this.playerConfig.units = units;
    this.playerConfig.results = results;

    console.log(this.playerConfig);
    const { TESTUM, LESSON, EXAM } = TYPE_CONTENT;

    switch (content_type) {
      case TESTUM:
      case EXAM:
        this.studyTestum(this.playerConfig);
        break;
      case LESSON:
        this.studyLesson(this.playerConfig);
      default:
        console.log(`Wrong Content Type: ${content_type}`);
        break;
    }
  }

  studyTestum(playerConfig) {
    this.clTestumPlayer.stopPreviousContent();

    this.clLessonPlayer.stopLesson();

    this.clTestumPlayer.setPlayOptions(playerConfig);

    this.clLessonPlayer.show(false);

    this.clTestumPlayer.startTestum();

    this.clTestumPlayer.show(true);
  }

  studyLesson(playerConfig) {
    this.clTestumPlayer.stopPreviousContent();

    this.clLessonPlayer.stopLesson();

    this.clLessonPlayer.setPlayOptions(playerConfig);

    this.clTestumPlayer.show(false);

    this.clLessonPlayer.startLesson();

    this.clLessonPlayer.show(true);
  }

  getElement() {
    return this.elThis;
  }
}
