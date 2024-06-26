import View from "../../classroom/teacher/stat/core/View.js";

export default class ContentPaginationView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {totalPageCount, currentPage} = state

        let start = 1
        let end = 5

        if(totalPageCount < 5){
            end = totalPageCount
            console.log('1',start, end)
        } else if(currentPage == 1) {
            start = 1
            end = start + 4
            console.log('2',start, end)
        } else if(currentPage > 1 && currentPage <= totalPageCount - 5) {
            start = currentPage
            end = Number(currentPage) + 4
            console.log('3',start, end)
        } else {
            start = Number(totalPageCount) - 4
            end = totalPageCount
            console.log('4',start, end)
        }

        let pageNumber = ''

        pageNumber += `
                    <svg class="prev-btn cursor-pointer" style="margin: 0 10px;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 15L8 10L13 5" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
        `
        
        for(let i = start; i <= end; i++){
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
            <div class="flex justify-center items-center">
                ${pageNumber}
            </div>
        `
    }
}