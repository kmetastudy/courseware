import Section from "../molecules/Section.js";

const SectionChange = (props) => {
  const { seq, todayLessonResult } = props;
  console.log(seq);
  console.log(todayLessonResult);
  return `
    <ul class="menu menu-horizontal bg-base-200 rounded-box">
        ${todayLessonResult
          .map(({ type }, index) => {
            if (type == "12") {
              return `
                <li>
                    <button class="selectSection ${seq == index ? "focus" : ""}" data-seq="${index}">
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="play-circle" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M719.4 499.1l-296.1-215A15.9 15.9 0 00398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 000-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"></path></svg>
                    </button>
                </li>
                `;
            } else if (type == "11") {
              return `
                <li>
                    <button class="selectSection ${seq == index ? "focus" : ""}" data-seq=${index}>
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>
                    </button>
                </li>
                `;
            }
          })
          .join("")}
    </ul>
    `;
};

export default SectionChange;

//sectionChange 처럼 이벤트를 담당하는거 말고 molecules들의 조합을 여러개로 표현
