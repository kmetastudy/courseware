import View from "../../../classroom/teacher/stat/core/View.js";

export default class CourseView extends View {
    constructor(target) {
        super(target)
    }

    template() {
        return `
            <div class="p-8">
                <h2>코스 추가하기</h2>
                <input type="file" id="fileInput" />
                <button id="uploadBtn">업로드</button>
            </div>
        `
    }
}