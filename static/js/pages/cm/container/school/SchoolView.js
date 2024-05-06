import View from "../../../classroom/teacher/stat/core/View";

export default class SchoolView extends View {
    constructor(target) {
        super(target)
    }

    template() {
        return `
            <h2 class="w-full p-4">학교 관리</h2>
            <div class="p-4 h-[600px] flex bg-base-200">
                <div class="p-2 w-1/3" data-component="school-list"></div>
                <div class="p-2 w-2/3 flex flex-col" data-component="school-detail"></div>
            </div>
            <div class="w-full" data-component="section-course"></div>
        `
    }
}