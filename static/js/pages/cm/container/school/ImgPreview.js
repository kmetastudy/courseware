import { apiCm } from "../../../../core/api/cm/index.js";
import Component from "../../../classroom/teacher/stat/core/Component.js";
import ImgPreviewView from "./ImgPreviewView.js";

export default class ImgPreviewAndChange extends Component {
    constructor(target, props) {
        super(target, new ImgPreviewView(target), props)
    }

    mounted() {

    }

    setEvent() {
        const {activateBtn} = this._props

        this.addEvent('change', '#fileInput', ({target}) => {
            const $targetComponent = this.$target
            // console.log(target.files[0])
            if(target.files && target.files[0]){
                this.encodeFileToBase64.bind(this)(target)
                
            }
            
            activateBtn()
        })
    }

    encodeFileToBase64(target) {
        let reader = new FileReader()
        reader.readAsDataURL(target.files[0])
        reader.onload = (e) => {
            this.$target.querySelector("img").src = e.target.result
        }
    }

}