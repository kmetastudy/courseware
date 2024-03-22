import Lesson from "../molecules/Lesson.js"

const LessonToday = props => {
    return `
        <div class="flex flex-col justify-around lg:gap-8">
            ${Lesson(props)}
            <div class="p-2 border rounded-lg font-bold text-sm">
                ${props.courses.map(({type, title}) => {
                    if(type == 12) {
                        return `<div class="flex items-center">
                                    <svg data-src="https://unpkg.com/heroicons/20/solid/play.svg" class="h-5 w-5 fill-red-600"></svg>
                                    <p class="pl-2">${title}</p>
                                </div>`
                    } else if(type == 11) {
                        return `<div class="flex items-center">
                                    <svg data-src="https://unpkg.com/heroicons/20/solid/check.svg" class="h-5 w-5 fill-blue-600"></svg>
                                    <p class="pl-2">${title}</p>
                                </div>`
                    }
                }).join('')}
            </div>
        </div>`

}

export default LessonToday