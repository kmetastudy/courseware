const Category = (sections) => {

        return `
            <div data-component="category" class="categoryMobile flex justify-between text-[#474747] font-normal text-center" style="margin-top:20px; margin-bottom: 40px;">
                <div class="category-click-border border-b-[2px] border-[#3db051] cursor-pointer text-[#3db051] font-bold" data-seq="0">전체보기</div>
                ${sections.map(({title}, index) => {
                    return `<div class="category-click-border cursor-pointer" data-seq="${index+1}">${title}</div>`
                }).join('')}
            </div>
        `
}

export default Category