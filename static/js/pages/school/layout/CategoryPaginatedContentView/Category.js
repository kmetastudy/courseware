const Category = (sections) => {

    return `
        <div data-component="category" class="w-fit grid grid-rows-2 min-[744px]:grid-rows-1 grid-flow-col gap-5 min-[1280px]:gap-10 text-[16px] min-[1280px]:text-[18px] text-[#474747] font-normal" style="margin-top:20px;margin-bottom: 40px;">
            <div class="category-click cursor-pointer text-[#3db051] font-bold" data-seq="0">전체보기</div>
            ${sections.map(({title}, index) => {
                return `<div class="category-click cursor-pointer" data-seq="${index+1}">${title}</div>`
            }).join('')}
        </div>
    `
}

export default Category