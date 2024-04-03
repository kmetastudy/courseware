const LessonQuestion = props => {
    if(props.type == 'lesson'){
        return `
        <div class="flex">
            <div class="border rounded-lg m-2 p-2">1</div>
            <li class="grid grid-cols-3 flex-1 border rounded-lg m-2 p-2 gap-4">
                <div class="flex items-center">
                    <p class="pl-2 m-0">수업 2</p>
                </div>
                <div class="flex items-center gap-4">
                    <p class="font-bold text-lg m-0">${props.q}번</p>
                </div>
                <div class="flex-none flex-col xl:flex-row justify-end text-center gap-4">
                    <p class="text-xs m-0">정답</p>
                    <p class="text-xs m-0">${props.num}/30 명</p>
                </div>
            </li>
        </div>
        `
    }
    if(props.type == 'test'){
        return `
        <div class="flex">
            <div class="border rounded-lg m-2 p-2">2</div>
            <li class="grid grid-cols-3 flex-1 justify-between items-center border rounded-lg m-2 p-2 gap-4">
                <div class="flex items-center">
                    <p class="pl-2 m-0">단원평가</p>
                </div>
                <div class="flex items-center gap-4">
                    <p class="font-bold text-lg m-0">${props.q}번</p>
                </div>
                <div class="flex-none flex-col xl:flex-row justify-end text-center gap-4">
                    <p class="text-xs m-0">정답</p>
                    <p class="text-xs m-0">${props.num}/30 명</p>
                </div>
            </li>
        </div>
        `
    }
}

export default LessonQuestion