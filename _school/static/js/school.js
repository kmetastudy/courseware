require("../css/school.css");
import("../css/tailwind.css");

import { CourseView } from "../../../static/js/pages/main/course/mtv-course";
import { CourseSwiperView } from "../../../static/js/pages/main/course/mtv-course-swiper";
import HighlightCourse from "../../../static/js/pages/school/container/HighlightCourse";

export function SchoolLandingOnReady(context, sections) {
    console.log(context);
    console.log(sections);

    const courses = []
    sections.forEach((section) => {
        section.courses.forEach((course) => {
            courses.push(course.course)
        })
    })

    console.log(courses)

    new HighlightCourse(document.querySelector(".courses_recomend"), {sections})

    var clCourseView = new CourseView(courses);
    $(".courses_landing").append(clCourseView.elThis);
}