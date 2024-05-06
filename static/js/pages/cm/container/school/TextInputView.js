import View from "../../../classroom/teacher/stat/core/View";

export default class TextInputAndChangeView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        if(!state.text) state.text = ''
        
        return `
            <label for="${state.inputName}">${state.title}</label>
            <input type="text" id="textInput" name="${state.inputName}" value="${state.text}" placeholder="${state.placeholder}"/>
        `
    }
}