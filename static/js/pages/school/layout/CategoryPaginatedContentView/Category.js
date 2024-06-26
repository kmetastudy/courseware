const Category = (sections) => {

    return `
        <div data-component="category" class="categoryMobile w-fit text-[#474747] font-normal text-center break-keep" style="margin-top:20px;margin-bottom: 40px;">
            <div class="category-click cursor-pointer text-[#3db051] font-bold" data-seq="0">전체보기</div>
            ${sections.map(({title}, index) => {
                return `<div class="category-click cursor-pointer" data-seq="${index+1}">${title}</div>`
            }).join('')}
        </div>
    `
}

export default Category