import View from "../../../classroom/teacher/stat/core/View";

export default class SchoolDatailView extends View {
    constructor(target) {
        super(target)
    }

    template() {
        return `
        <form id="schoolForm">
            <div class="grow flex">
                <div class="p-2 w-1/2">
                    <div class="p-2" data-component="school-title"></div>
                    <div class="p-2" data-component="upload-logo"></div>
                    <div class="p-2" data-component="upload-banner"></div>
                </div>
                <div class="p-2 w-1/2">
                    <p>공지사항</p>
                </div>
            </div>
            <div data-component="save-btn"></div>
        </form>
        `
    }
}