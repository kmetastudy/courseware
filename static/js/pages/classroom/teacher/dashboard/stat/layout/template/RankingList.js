import LessonQuestion from "../organisms/LessonQuestion.js";

const RankingList = (props) => {
  return `
        <ul>
            ${props
              .map(({ questionIndex, correct, studentCount }, idx) => {
                return LessonQuestion({ questionIndex, correct, studentCount, idx: idx + 1 });
              })
              .join("")}
        </ul>
    `;
};

export default RankingList;
