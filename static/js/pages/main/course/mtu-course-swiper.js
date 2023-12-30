export function CourseSwiperUnit(data, key) {
    this.options = {}
    this.options.key = key
    this.options.school = {E: '초', M: '중', H:'고'}
    this.options.name = ['삼0중학교', '새0중학교', '남0중학교', '달0초등학교','새0중학교']
    this.data = data
    this.elThis = null
    this.create()
}

CourseSwiperUnit.prototype.create = function() {
    var $elCourseUnitList = $(`<div class="swiper-wrapper pb-[90px]">
                                </div>`)
    
    var cnt = 0
    this.data.forEach(content => {
        
        if (this.options.key == 'etc') {
            var $elCourseUnit = $(`<div class="swiper-slide p-4 flex flex-col justify-center items-center w-[250px] h-[225px] rounded-[30px] bg-[#ADD9CB] cursor-pointer">
                                    <div class="flex flex-col items-center">
                                        <img class="w-[210px] h-[118px]" src="/static/img/${content.thumnail}.png">
                                        <div class="mt-4 w-full flex justify-center items-center rounded-full bg-[#059669]">
                                            <p class="pl-2 text-[24px] text-center text-white">${this.options.name[cnt]}</p>
                                        </div>
                                    </div>
                                </div>`)
            cnt++
        } else {
            var $elCourseUnit = $(`<div class="swiper-slide p-4 flex flex-col justify-center items-center w-[250px] h-[225px] rounded-[30px] bg-[#ADD9CB] cursor-pointer">
                                    <div class="flex flex-col items-center">
                                        <img class="w-[210px] h-[118px]" src="/static/img/${content.thumnail}.png">
                                        <div class="pt-2 flex justify-between items-center">
                                            <div class="flex-none w-[48px] h-[48px] border-2 border-[#FE5BC3] rounded-full text-[24px] font-bold text-center"><span class="align-middle">${this.options.school[content.school]}${content.grade}</span></div>
                                            <div>
                                                <p class="pl-2 text-[16px] text-center">${content.courseTitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`)
        }

        $elCourseUnit.on("click", function(){
            window.location.href = `/courses/${content.school}/${content.subject}/${content.courseId}`
        })
      
        
        $elCourseUnitList.append($elCourseUnit)
    })
    
                    
    

    this.elThis = $elCourseUnitList
}
