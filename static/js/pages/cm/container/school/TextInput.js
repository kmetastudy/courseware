import { apiCm } from "../../../../core/api/cm/index.js";
import Component from "../../../classroom/teacher/stat/core/Component.js";
import TextInputView from "./TextInputView.js";

export default class TextInputAndChange extends Component {
    constructor(target, props) {
        super(target, new TextInputView(target), props)
    }

    mounted() {

    }

    setEvent() {
        const {activateBtn} = this._props
        this.addEvent('change', '#textInput', ({target}) => {
            activateBtn()
        })
    }

}