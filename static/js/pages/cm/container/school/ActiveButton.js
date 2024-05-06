import Component from "../../../classroom/teacher/stat/core/Component.js";

import ActiveButtonView from "./ActiveButtonView.js"

export default class ActiveButton extends Component {
    constructor(target, props) {
        super(target, new ActiveButtonView(target), props)
    }

    mounted() {

    }

    setEvent() {
        
    }
}