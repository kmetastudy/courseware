import { CourseSwiperUnit } from "./mtu-course-swiper"

export function CourseSwiperView(data) {
    this.options = {kor:'국어 추천 코스', eng:'영어 추천 코스', math:'수학 추천 코스', etc:'학교별 강의'}
    this.text = {kor:'내신 국어의 논리정석 추천 코스! ', eng:'야 너도 할 수 있어 영어 추천 코스! ', math:'수직적 과목의 특화 쉽게 배울수있는 수학 추천 코스!', etc:''}
    this.data = data
    this.elThis = null
    this.init()
  
}

CourseSwiperView.prototype.init = function() {
    var elCourseSwiperList = $(`<div class="course-swiper"></div>`)

    var keys = Object.keys(this.data)

    keys.forEach((key, index) => {
        var elCourseSwiperCointer = $(`<div class="swiper-background${index+1} my-7 flex justify-center items-center">
                                            <div class="swiper-container py-2 w-[1000px] overflow-hidden">
                                                <p class="w-fit flex items-center text-[24px] font-bold"><object type="image/svg+xml" data="/static/assets/Star4.svg"></object>${this.options[key]}<span class="text-sm text-red-400">new</span></p>
                                                <div class="pl-[60px] pb-4 flex justify-between items-center">
                                                    <p class="text-[20px]">${this.text[key]}</p>
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