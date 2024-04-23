import { sum, extract } from "../../../../core/utils/array/";
import { StatModelNew } from "../dashboard/stat/StatModelNew.js";
import Model from "./core/Model.js"

export default class StatModel extends Model {
    static #CHAPTER_TYPE = 0;
    static #QUESTION_TYPE = "q";

    constructor(state) {
        super(state)
    }

    getChapterAverage() {
        const course = this.getState("course")
    }

    getClassAverage(key) {
        const studyResult = this.getState("studentsResult")

        const properties = studyResult.map(({result}) => result)

        const branches = properties.map((property) => filterBranch(property)).flat()
        
        const keyData = extract(branches, key)

        return calculateAverage(keyData)
    }
}



function filterBranch(array) {
    return array.filter((item) => item.type !== StatModelNew.CHAPTER_TYPE)
}

function calculateAverage(array) {
    const total = sum(array);
    const average = total / (array.length * 100);
    const percent = average * 100;
    return percent;
}