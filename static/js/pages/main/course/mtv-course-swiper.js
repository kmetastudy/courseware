import { CourseSwiperUnit } from "./mtu-course-swiper"

export function CourseSwiperView(data, title={kor: "초등 추천 코스",
                                                eng: "중등 추천 코스",
                                                math: "고등 추천 코스",
                                                etc: "학교별 강의",
                                                basic: "기초수학 추천 코스"}) {
    this.options = title
    this.text = {kor:'', eng:'', math:'', etc:'', basic:''}
    this.data = data
    this.elThis = null
    console.log(data, title)
    this.init()
  
}

CourseSwiperView.prototype.init = function() {
    var elCourseSwiperList = $(`<div class="course-swiper"></div>`)

    var keys = Object.keys(this.data)

    keys.forEach((key, index) => {
        var elCourseSwiperCointer = $(`<div class="swiper-background${index+1} my-6 flex justify-center items-center">
                                            <div class="swiper-container m-4 lg:w-2/3 overflow-hidden">
                                                <div class="w-fit flex items-center text-[20px] sm:text-[24px] font-bold"><object type="image/svg+xml" data="/static/assets/Star4.svg"></object><p class="text-[20px] sm:text-[24px] font-bold">${this.options[key]}</p><span class="text-sm text-red-400">new</span></div>
                                                <div class="pl-[60px] pb-4 flex justify-between items-center">
                                                    <p class="text-[16px] sm:text-[20px]">${this.text[key]}</p>
                                                    <div class="flex">
                                                        <div class="next-btn px-2 w-[40px]"><img src="/static/img/landing/arrow_left.png"></div>
                                                        <div class="prev-btn px-2 w-[40px]"><img src="/static/img/landing/arrow_right.png"></div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>`)

        var clCourseSwiperUnit = new CourseSwiperUnit(this.data[key], key)

        elCourseSwiperCointer.children('div').append(clCourseSwiperUnit.elThis)
        elCourseSwiperList.append(elCourseSwiperCointer)
    })

    
    

    this.elThis = elCourseSwiperList

}