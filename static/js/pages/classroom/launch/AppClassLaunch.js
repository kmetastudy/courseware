import elem from "../../../core/utils/elem/elem";
import { LaunchForm } from "./LaunchForm";
import { apiClass } from "../../../core/api/class";
export class AppClassLaunch {
  constructor({ userId, userType, courseId }) {
    this.userId = userId;
    this.courseId = courseId;
    this.userType = userType;

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("div", { class: "h-screen bg-base-200 flex justify-center item-center" });

    this.clForm = new LaunchForm({ onSubmit: this.handleSubmit.bind(this) });
    this.elForm = this.clForm.getElement();
    this.elThis.append(this.elForm);
  }

  handleSubmit(evt, formData) {
    this.requestCreateSingleCourseClass({ formData });
  }

  /**
   *
   * @param {object} param
   * @property {FormData} param.formData
   */
  async requestCreateSingleCourseClass({ formData }) {
    try {
      formData.append("id_owner", this.userId);
      formData.append("id_course", this.courseId);

      // let entries = formData.entries();
      // for (const pair of entries) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }
      const response = await apiClass.singleCourseClass.create(formData);
      if (response.data) {
        const { id } = response.data;
        const rootUrl = window.location.origin;
        window.location.href = `${rootUrl}/class/classroom/teacher/${id}/`;
      }
    } catch (error) {
      console.log(error);
      this.handleSubmitError(error);
    }
  }

  handleSubmitError(error) {
    // console.
  }

  getElement() {
    return this.elThis;
  }
}
