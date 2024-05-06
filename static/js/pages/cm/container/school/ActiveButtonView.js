import View from "../../../classroom/teacher/stat/core/View.js";

export default class ActiveButtonView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        return `
            <button type="button" class="${state.name} btn w-full bg-white" data-component="active-btn" disabled>${state.text}</button>
        `
    }
}