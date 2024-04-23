const ScheduleSummaryHeatMap = props => {
    console.log(props)
    const data = props.data
    return `
        <div>
            ${data.map((item) => {
                if(item.type == 12){
                    return `
                    <div>
                        <div class="flex items-center">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="play-circle" class="flex-none h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M719.4 499.1l-296.1-215A15.9 15.9 0 00398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 000-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"></path></svg>
                            <p class="pl-2">${item.title}</p>
                        </div>
                        <div class="flex">
                            ${item.average.map((unit) => {
                                return `
                                    <div class="p-2 flex">
                                        ${unit.map((element, index) => {
                                            return `
                                            <div>
                                                <p class="text-xs text-center">Q${index+1}</p>
                                                <div class="w-[30px] border text-xs text-center">${element*100}%</div>
                                            </div>
                                            `
                                        }).join('')}
                                    </div>
                                `
                            }).join('')}
                        </div>
                    </div>
                    `
                } else if(item.type == 11){
                    return `
                    <div>
                        <div class="flex items-center">
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" class="flex-none h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>
                            <p class="pl-2">${item.title}</p>
                        </div>
                        <div class="flex">
                            ${item.average.map((unit) => {
                                return `
                                    <div class="p-2 flex">
                                        ${unit.map((element, index) => {
                                            return `
                                            <div>
                                                <p class="text-xs text-center">Q${index+1}</p>
                                                <div class="w-[30px] border text-xs text-center">${element*100}%</div>
                                            </div>
                                            `
                                        }).join('')}
                                    </div>
                                `
                            }).join('')}
                        </div>
                    </div>
                    `
                }
            }).join('')}
        </div>
    `

}

export default ScheduleSummaryHeatMap