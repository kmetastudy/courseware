const LessonStudent = props => {
    return `
        <li class="flex justify-between items-center p-2 gap-4">
            <div class="flex flex-none items-center">
                
                <p class="m-0 text-sm">${props.name}</p>
            </div>
            <div class="">
                <div class="flex justify-between items-center">
                    <p class="text-sm text-[#005140] m-0">학습률</p>
                    <p class="text-sm m-0">${props.progress}%</p>
                </div>
                <progress class="progress progress-success w-30" value="${props.progress}" min="0" max="100"></progress>
            </div>
            <div class="flex flex-col flex-none text-center">
                <p class="text-xs m-0">맞춘 문제 수</p>
                <p class="text-sm m-0">${props.point}/${props.numOfQuestion}</p>
            </div>
            <button class="btn btn-sm btn-disabled">확인하기</button>
        </li>
    `
}

export default LessonStudent