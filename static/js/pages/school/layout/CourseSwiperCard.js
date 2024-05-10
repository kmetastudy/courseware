const CourseSwiperCard = (courses) => {
    let pathname = window.location.pathname
    let splitedPath = pathname.split('/')
    let startURL = ''
    if(splitedPath.includes('school')) startURL = '.'
    else startURL = ''

        return `
        ${courses.map((course, index) => {
            
            return `
            <div class="swiper-slide card card-compact h-auto bg-base-100 shadow-xl cursor-pointer" onclick="window.location='${startURL}/courses/${course.course.school}/${course.course.subject}/${course.course.courseId}'">
                <figure><img class="w-full" src="/static/img/thumnail/${course.course.thumnail}.png"></figure>    
                <div class="card-body">
                        <h2 class="font-semibold break-keep">${course.course.courseTitle}</h2>
                </div>
            </div>
            `
        }).join('')}
        `
    
    
}

export default CourseSwiperCard