import Lesson from "../molecules/Lesson.js"

const LessonChange = props => {
    return `
        <div class="flex justify-between">
            ${Lesson(props)}
            <div class="btn">단원 변경</div>
        </div>
    `
}

export default LessonChange