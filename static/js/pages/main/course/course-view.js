import { CourseCardManager } from "./course-card-manager";
require("../../../../css/pages/main/course/course-view.css");
export class CourseView {
  constructor() {
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.viewer = document.createElement("div");
    this.viewer.classList.add("main-course-view");
  }

  async render() {
    try {
      const cardManagers = [];
      const cards = [];

      const courses = await this.urlGetCourses();
      console.log(courses);

      for (let i = 0; i < courses.length; i++) {
        const cardManager = this.initCardManager(courses[i], i);
        const card = cardManager.getCard();

        cardManagers.push(cardManager);
        cards.push(card);
      }

      for (let card of cards) {
        this.viewer.appendChild(card);
      }
      this.cardManagers = cardManagers;
      this.cards = cards;
    } catch (err) {
      console.log(err);
    }
  }

  initCardManager(course_data, index) {
    const cardManager = new CourseCardManager({ data: course_data, index: index });
    // cardManager.setData(course_data);
    return cardManager;
  }

  urlGetCourses() {
    return axios.get("../cp/api/course_book/").then((res) => {
      if (res?.data) {
        return res.data;
      } else {
        console.log(res);
        return [];
      }
    });
  }

  getElement() {
    return this.viewer;
  }
}
// course view -> course 를 모두 뿌려주자 일단은?
//    course card manager? -> 1개의 course card 담당, 누르면 course로 가는 등..
//        course card -> ui 기능만 담당
//
