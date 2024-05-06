import { observable } from "../../../classroom/teacher/stat/core/Observer.js";

export const store = {
    state: observable({
        selectedSchool: 0
    }),

    setState(newState) {
        for(const [key, value] of Object.entries(newState)) {
            if(!this.state.hasOwnProperty(key)) continue
            this.state[key] = value
        }
    }
}