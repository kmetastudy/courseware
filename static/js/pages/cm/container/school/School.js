import { apiCm } from "../../../../core/api/cm/index.js";
import Component from "../../../classroom/teacher/stat/core/Component.js";

import SchoolModel from "./SchoolModel.js"
import SchoolView from "./SchoolView.js"

import SchoolList from "./SchoolList.js";
import SchoolDetail from "./SchoolDetail.js";

export default class School extends Component {
    constructor(target) {
        super(target, new SchoolView(target))
        this._model = new SchoolModel()
    }

    async initState() {
        await loadData()
        .then((result) => {
            this._model.setState(result)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {

        })
    }

    mounted() {
        const school = this._model.getState("school")
        console.log(school)

        const $schoolList = this.$target.querySelector('[data-component="school-list"]')
        const $schoolDetail = this.$target.querySelector('[data-component="school-detail"]')

        new SchoolList($schoolList, {school})
        new SchoolDetail($schoolDetail, {})
    }
}


async function loadData() {
    try{
        const response = await apiCm.school.list()
        const data = {}
        data["school"] = response.data

        return data

    } catch(error) {
        console.log(error)
    }
}