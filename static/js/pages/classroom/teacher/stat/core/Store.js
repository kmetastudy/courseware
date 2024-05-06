import { observable } from "./Observer.js";

export const statStore = {
    state: observable({
        selectedStudent: 0,
        selectedClass: 0,
        selectedSection: 0,
        selectedSchedule: 0,

    }),

    setState(newState) {
        for (const [key, value] of Object.entries(newState)) {
            if (!this.state[key]) continue;
            this.state[key] = value;
        }
    },
};
