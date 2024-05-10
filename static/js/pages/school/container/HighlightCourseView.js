import View from "../../classroom/teacher/stat/core/View.js";

import CourseSwiperCard from "../layout/CourseSwiperCard.js";

export default class HighlightView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {sections} = state
        return `
            ${sections.map(({title, courses}, index) => {
                return `
                <div class="swiper-background${index+1} my-6 flex justify-center items-center">
                    <div class="swiper-container m-4 w-full lg:w-2/3 overflow-hidden">
                        <div class="w-fit flex items-center text-[20px] sm:text-[24px] font-bold"><object type="image/svg+xml" data="/static/assets/Star4.svg"></object><p class="text-[20px] sm:text-[24px] font-bold">${title}</p></div>
                        <div class="pl-[60px] pb-4 flex justify-end items-center">
                            <div class="flex">
                                <div class="next-btn px-2 w-[40px]"><img src="/static/img/landing/arrow_left.png"></div>
                                <div class="prev-btn px-2 w-[40px]"><img src="/static/img/landing/arrow_right.png"></div>
                            </div>
                        </div>
                        <div class="swiper-wrapper">
                            ${CourseSwiperCard(courses)}
                        </div>
                    </div>
                </div>
                `
            }).join('')}
            <div></div>
        `
    }
}