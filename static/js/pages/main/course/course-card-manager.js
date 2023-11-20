// import { MtuViewCard } from "./mtu-view-card";
import { MtuCard } from "../../../core/mtu/card/mtu-card";
export class CourseCardManager {
  constructor(options = {}) {
    this.options = options;
    this.index = options.index ?? null;
    this.data = null;
    this.clCard = null;
    this.#init();
  }

  #init() {
    if (this.options.data) {
      this.setData(this.options.data);
    }
    // const cardConfig = this.setCardConfig();
  }

  setData(data) {
    this.data = data;
    const config = this.composeConfig(data);
    this.clCard = new MtuCard(config);
    if (this.index === 1) {
      console.log(config);
    }
  }

  ////////////////// Handler //////////////////
  handleClick(evt) {
    const course_id = this.data.id;
    console.log(course_id);
    this.urlRedirectStudy(course_id);
  }
  ////////////////// URL //////////////////
  urlRedirectStudy(course_id) {
    if (!course_id) {
      return;
    }
    window.location.href = `../st/?course_id=${course_id}`;
  }
  ////////////////// API //////////////////
  composeConfig(data) {
    return {
      title: data.title ?? null,
      hoverable: true,
      className: `course-view-card`,
      onClick: this.handleClick.bind(this),
    };
  }
  getCard() {
    return this.clCard.getElement();
  }
}
