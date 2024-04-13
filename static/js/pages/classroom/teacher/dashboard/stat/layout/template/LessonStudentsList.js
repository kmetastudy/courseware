import LessonStudent from "../organisms/LessonStudent.js";

const LessonStudentsList = ({ status }) => {
  //
  return `
        <ul>
            ${status
              .map((obj) => {
                return LessonStudent(obj);
              })
              .join("")}
        </ul>
    `;
};

export default LessonStudentsList;
