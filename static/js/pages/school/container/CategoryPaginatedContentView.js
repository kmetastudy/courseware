import View from "../../classroom/teacher/stat/core/View.js";

export default class CategoryPaginatedContentView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {sections} = state
        // console.log(sections)
        return `
            <div class="">
                <div data-component="category" class="w-fit grid grid-rows-1 grid-flow-col text-[20px] text-[#474747]" style="margin: 40px 0; column-gap:40px;">
                    <div class="category-click cursor-pointer text-[#3db051] font-bold" data-seq="0">전체보기</div>
                    ${sections.map(({title}, index) => {
                        return `<div class="category-click cursor-pointer" data-seq="${index+1}">${title}</div>`
                    }).join('')}
                </div>
                <div data-component="paginatedContent" style="padding: 0 15px;"></div>
            </div>
        `
    }
}