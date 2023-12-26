import { StudyCourseBuilder } from "./study-course-builder";
import { mtmInputColorSwitcher } from "../../../core/ui/input/mtm-input-color-switcher";

require("../../../../css/css-reset.css");
require("../../../../css/pages/st/study/study-preview.css");
export class StudyPreview extends StudyCourseBuilder {
  constructor(options) {
    super(options);
  }

  _init() {
    super._init();

    this.clColor = new mtmInputColorSwitcher();
    this.elThis.classList.add("study-preview");
    // this.elThis.style.minHeight = "0%";
    this.elThis.style.width = "100%";
    this.courseId = this.options.courseId;
    this.demoContentId = this.options?.demoContentId;
    this.startDemoStudy(this.courseId);

    this.setStyle();
  }

  setStyle() {
    // this.mtmPlyrTestumTitle = this.elThis.querySelector("#" + `id-mtm-player-testum-title-0`);
    // this.mtmPlyrTestumTitle.textContent = this.options.courseTitle;

    const clSubmitButton = this.elThis.querySelector(".mtm-input-button-hover-theme");
    clSubmitButton.style.background = "var(--theme-color-v2-c0-rgb)";
  }

  async startDemoStudy(course_id) {
    try {
      const courseData = await this.urlGetCourse(course_id);

      if (!courseData) {
        return;
      }

      const title = courseData.title;

      const lists = courseData.json_data.lists;

      let content, content_id, content_type;

      if (this.demoContentId) {
        content_id = this.demoContentId;

        content = this.findContent(lists, content_id);

        content_type = content?.type;
      } else {
        content = this.findFirstContent(lists);

        content_id = content.id;
        this.demoContentId = content_id;

        content_type = content.type;
      }

      if (content_id) {
        this.onChangeCourseContentHandler({
          student_id: this.options.studentId,
          course_id,
          content_id,
          content_type,
          title,
          results: [],
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  urlGetCourse(courseId) {
    try {
      return axios
        .get(`../../../../cp/api/course_n/${courseId}/`)
        .then((res) => {
          if (res.data) {
            return res.data;
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.log(err);
    }
  }

  urlGetContent({ course_id, content_id, content_type }) {
    try {
      const formData = new FormData();
      formData.append("course_id", course_id);
      formData.append("content_id", content_id);
      formData.append("content_type", content_type);

      return axios.post("../../../../st/get-content/", formData).then((res) => {
        if (res.data.result) {
          return res.data.result;
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  findContent(data, contentId) {
    return data.find((item) => item.id === contentId) ?? [];
  }

  findFirstContent(data) {
    return data.find((item) => item?.units.length > 0) ?? [];
  }
}
