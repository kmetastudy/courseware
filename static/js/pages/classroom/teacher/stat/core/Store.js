import { observable } from "./Observer.js";

export const store = {
    state: observable({
        selectedStudent: 0,
        selectedLesson: 0,
        selectedClass: 0

    }),

    setState(newState) {
        for (const [key, value] of Object.entries(newState)) {
            if (!this.state[key] && this.state[key] != 0) continue;
            this.state[key] = value;
        }
    },
};
