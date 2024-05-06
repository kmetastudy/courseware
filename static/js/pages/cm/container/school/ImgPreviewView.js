import View from "../../../classroom/teacher/stat/core/View";

export default class ImgPreviewAndChangeView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        if(!state.img) state.img = ''

        return `
            <label for="${state.inputName}">${state.title}</label>
            <img class="max-h-[200px]" src="${state.img}"/>
            <p class="text-gray-500">이미지를 선택해주세요</p>
            <input type="file" id="fileInput" name="${state.inputName}"/>
        `
    }
}