import { apiCm } from "../../../../core/api/cm/index.js";
import Component from "../../../classroom/teacher/stat/core/Component.js";
import { store } from "./Store.js";

import SchoolModel from "./SchoolModel.js"
import SchoolDatailView from "./SchoolDetailView.js"

import LogoUpload from "../../layout/LogoUpload.js";
import ImgPreview from "./ImgPreview.js";
import TextInput from "./TextInput.js";
import ActiveButton from "./ActiveButton.js";


export default class SchoolDetail extends Component {
    constructor(target, props) {
        super(target, new SchoolDatailView(target), props)
    }

    mounted() {
        const {selectedSchool} = this
        
        const $schoolTitle = this.$target.querySelector('[data-component="school-title"]')
        const $uploadLogo = this.$target.querySelector('[data-component="upload-logo"]')
        const $uploadBanner = this.$target.querySelector('[data-component="upload-banner"]')
        const $saveButton = this.$target.querySelector('[data-component="save-btn"]')

        // $uploadLogo.innerHTML = LogoUpload({'title':'로고', 'img':school[0].img_logo})

        new TextInput($schoolTitle, {title:'학교이름', inputName:'title', text:selectedSchool.title, placeholder:'OOOOO학교', activateBtn:this.activateBtn.bind(this)})
        new ImgPreview($uploadLogo, {title:'로고', inputName:'img_logo', img:selectedSchool.img_logo, activateBtn:this.activateBtn.bind(this)})
        new ImgPreview($uploadBanner, {title:'배너', inputName:'img_banner', img:selectedSchool.img_banner, activateBtn:this.activateBtn.bind(this)})
        new ActiveButton($saveButton, {})
    }

    setEvent() {
        this.addEvent('click', '.addBtn', async ({target}) => {
            const schoolForm = this.$target.querySelector('#schoolForm')
            const formData = new FormData(schoolForm)

            // const logoFile = formData.get('img_logo')
            // const bannerFile = formData.get('img_banner')
            // const base64_logo = await encodeFileToBase64(logoFile)
            // const base64_banner = await encodeFileToBase64(bannerFile)
            // formData.set('img_logo', base64_logo)
            // formData.set('img_banner', base64_banner)

            formData.append('message', 'hi')
            try {
                const response = await apiCm.school.create(formData);
                return response.data;
            } catch (error) {
                console.log(error);
            }
        })
    }

    get selectedSchool() {
        const {selectedSchool} = store.state
        return selectedSchool
    }

    activateBtn() {
        this.$target.querySelector('[data-component="save-btn"]').disabled = false
    }
}

function encodeFileToBase64(target) {

    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = (e) => {
            resolve(e.target.result)
        }
        reader.readAsDataURL(target)
        reader.onerror = reject
    })
    
}
