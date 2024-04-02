import LessonStudent from "../organisms/LessonStudent.js"

const LessonStudentsList = props => {

    return `
        <ul>
            ${props.map(obj => {
                return LessonStudent(obj)
            }).join('')}
        </ul>
    `
}

export default LessonStudentsList