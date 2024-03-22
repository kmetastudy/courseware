import LessonQuestion from "../organisms/LessonQuestion.js"

const LankingList = props => {

    return `
        <ul>
            ${props.map(obj => {
                return LessonQuestion(obj)
            }).join('')}
        </ul>
    `
}

export default LankingList