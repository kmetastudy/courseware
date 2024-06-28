import { observable } from "../../classroom/teacher/stat/core/Observer.js";

export const store = {
    state: observable({
        sections: [],
        selectedCategory: 0,
        currentPage: 1,
        currentPageGroup: 0
    }),

    setState(newState) {
        for(const [key, value] of Object.entries(newState)) {
            if(!this.state.hasOwnProperty(key)) continue
            this.state[key] = value
        }
    }
}