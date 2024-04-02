import { observable } from "./core/Observer.js";

export const statStore = {
  state: observable({
    classId: null,
    courseId: null,
    selectedStudent: 0,
    selectedLesson: 0,
    selectedClass: 0,
    selectedSection: 0,
  }),

  setState(newState) {
    for (const [key, value] of Object.entries(newState)) {
      if (!this.state[key] && this.state[key] != 0) continue;
      this.state[key] = value;
    }
  },
};
