require("../css/school.css");
import("../css/tailwind.css");

import { CourseView } from "../../../static/js/pages/main/course/mtv-course";
import { CourseSwiperView } from "../../../static/js/pages/main/course/mtv-course-swiper";
import CategoryPaginatedContent from "../../../static/js/pages/school/container/CategoryPaginatedContent";
import HighlightCourse from "../../../static/js/pages/school/container/HighlightCourse";

export function SchoolLandingOnReady(context, sections) {
    console.log(context);
    console.log(sections);

    // new HighlightCourse(document.querySelector(".courses_recomend"), {sections})

    new CategoryPaginatedContent(document.querySelector(".courses_landing"), {sections})
}