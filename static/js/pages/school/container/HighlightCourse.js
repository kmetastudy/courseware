import Component from "../../classroom/teacher/stat/core/Component.js";

import HighlightCourseView from "./HighlightCourseView.js";

export default class HighlightCourse extends Component {
    constructor(target, props) {
        super(target, new HighlightCourseView(target), props)
    }

    mounted() {

        var slider = new Swiper(".swiper-container", {
            slidesPerView: 2,
            spaceBetween: 10,
            breakpoints: {
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1536: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            },
            navigation: {
              nextEl: ".prev-btn",
              prevEl: ".next-btn",
            },
        });
    }
}