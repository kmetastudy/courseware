const LessonQudstion = props => {
    if(props.type == 'lesson'){
        return `
        <div class="flex">
            <div class="border rounded-lg m-2 p-2">2</div>
            <li class="grid grid-cols-3 flex-1 border rounded-lg m-2 p-2 gap-4">
                <div class="flex items-center">
                    <svg data-src="https://unpkg.com/heroicons/20/solid/play.svg" class="h-5 w-5 fill-red-600"></svg>
                    <p class="pl-2 m-0">수업 2</p>
                </div>
                <div class="flex items-center gap-4">
                    <p class="font-bold text-lg m-0">${props.q}번</p>
                </div>
                <div class="flex-col xl:flex-row justify-end text-center gap-4">
                    <p class="text-sm m-0">맞춘 학생 수</p>
                    <p class="text-sm m-0">${props.num}/30</p>
                </div>
            </li>
        </div>
        `
    }
    if(props.type == 'test'){
        return `
        <div class="flex">
            <div class="border rounded-lg m-2 p-2">1</div>
            <li class="grid grid-cols-3 flex-1 justify-between items-center border rounded-lg m-2 p-2 gap-4">
                <div class="flex items-center">
                    <svg data-src="https://unpkg.com/heroicons/20/solid/check.svg" class="h-5 w-5 fill-blue-600"></svg>
                    <p class="pl-2 m-0">단원평가</p>
                </div>
                <div class="flex items-center gap-4">
                    <p class="font-bold text-lg m-0">${props.q}번</p>
                </div>
                <div class="flex-col xl:flex-row justify-end text-center gap-4">
                    <p class="text-sm m-0">맞춘 학생 수</p>
                    <p class="text-sm m-0">${props.num}/30</p>
                </div>
            </li>
        </div>
        `
    }
}

export default LessonQudstion