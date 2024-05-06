import { apiCm } from "../../../../core/api/cm/index.js";
import Component from "../../../classroom/teacher/stat/core/Component.js";
import { store } from "./Store.js";

import SchoolModel from "./SchoolModel.js"
import SchoolListView from "./SchoolListView.js"

import LogoUpload from "../../layout/LogoUpload.js";


export default class SchoolList extends Component {
    constructor(target, props) {
        super(target, new SchoolListView(target), props)
    }

    mounted() {
        
    }

    setEvent() {
        this.addEvent('click', '.selectSchool', ({target}) => {
            let seq = target.closest('[data-seq]').dataset.seq
            this.selectSchool(seq)
        })

        this.addEvent('click', '.addSchool', ({target}) => {
            this.addSchool()
        })
    }

    selectSchool(seq) {
        const {school} = this._props
        store.setState({ selectedSchool: school[seq]})
    }

    addSchool() {
        store.setState({ selectedSchool: 0})
    }
}
