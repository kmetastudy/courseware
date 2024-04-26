import Component from "../../../classroom/teacher/stat/core/Component.js";

import CourseImportView from "./CourseImportView.js"

export default class CourseImport extends Component {
    constructor(target) {
        super(target, new CourseImportView(target))
    }

    mounted() {

        
    }

    setEvent() {
        this.addEvent('change', '#fileInput', ({target}) => {
            console.log(target.files[0])
        })

        this.addEvent('click', '#uploadBtn', ({target}) => {
            const fileInput = document.getElementById('fileInput')
            const file = fileInput.files[0]
            const formData = new FormData()
            formData.append('file', file)
            console.log(formData)

            axios.post('course_import/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then(res => console.log(res))
        })
    }
}