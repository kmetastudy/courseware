import LessonQuestion from "../organisms/LessonQuestion.js"

const RankingList = props => {

    return `
        <ul>
            ${props.map(obj => {
                return LessonQuestion(obj)
            }).join('')}
        </ul>
    `
}

export default RankingList