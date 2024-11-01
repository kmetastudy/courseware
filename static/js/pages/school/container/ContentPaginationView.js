import View from "../../classroom/teacher/stat/core/View.js";

export default class ContentPaginationView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {totalPageCount, currentPage} = state

        let pageNumber = ''

        pageNumber += `
                    <svg class="prev-btn hidden cursor-pointer" style="margin: 0 10px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 15L8 10L13 5" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
        `
        
        for(let i = 1; i <= totalPageCount; i++){
                if(i == currentPage) {
                    pageNumber += `<div data-seq="${i}" class="page-click text-center text-[16px] text-[#3db051] font-bold cursor-pointer" style="width: 22px; height:24px; margin: 0 10px;">${i}</div>`
                } else {
                    pageNumber += `<div data-seq="${i}" class="page-click text-center text-[16px] text-[#8c8c8c] cursor-pointer" style="width: 22px; height:24px; margin: 0 10px;">${i}</div>`
                }
        }

        pageNumber += `
                    <svg class="next-btn cursor-pointer" style="margin: 0 10px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 15L12 10L7 5" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
        `


        return `
            <div id="pagination" class="flex justify-center items-center">
                
            </div>
        `
    }
}