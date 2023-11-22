import { StudyCourseContainer } from "../../st/study/study-course-container"

export function DetailManager(parsedContext, data) {
    this.parsedContext = parsedContext
    this.options = {
        school:[
            {text:'초등', type:'element'},
            {text:'중등', type:'middle'},
            {text:'고등', type:'high'},
        ],
        grade:[
            {text:'1학년', type:1},
            {text:'2학년', type:2},
            {text:'3학년', type:3}
        ],
        semester:[
            {text:'공통', type:0},
            {text:'1학기', type:1},
            {text:'2학기', type:2},
        ],
        subject:[
            {text:'국어', type:'kor' },
            {text:'영어', type:'eng' },
            {text:'수학', type:'math' },
            {text:'사회', type:'soc' },
            {text:'역사', type:'hist' },
            {text:'한국사', type:'korhist' },
            {text:'과학', type:'sci' },
            {text:'정보', type:'info' },
            {text:'도덕', type:'mor' }
        ],
        difficulty:[
            {text:'상', type:3},
            {text:'중', type:2},
            {text:'하', type:1},
        ]
    }
    this.data=data
    this.elThis=null
    this.init()
}

DetailManager.prototype.init = function() {
    var $elHeader = $(`<div class="w-[1200px] p-10">
                        <p class="text-2xl">${this.data.courseTitle}</p>
                        ${this.data.courseSummary}
                    </div>`);
    $(".course_header").append($elHeader);

    var $elCategory = $(`<div class="p-2 w-full flex border">
                            <p class="w-[100px]">코스 제목</p>
                            <p>${this.data.courseTitle}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">년도</p>
                            <p>${this.data.year}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">학년</p>
                            <p>${this.options.school.find((obj)=>obj.type == this.data.school).text} ${this.options.grade.find((obj)=>obj.type == this.data.grade).text}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">학기</p>
                            <p>${this.options.semester.find((obj)=>obj.type == this.data.semester).text}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">과목</p>
                            <p>${this.options.subject.find((obj)=>obj.type == this.data.subject).text}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">출판사</p>
                            <p>${this.data.publisher}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">난이도</p>
                            <p>${this.options.difficulty.find((obj)=>obj.type == this.data.difficulty).text}</p>
                        </div>
                        <div class="p-2 w-full flex border">
                            <p class="w-[100px]">제작자</p>
                            <p>${this.data.producer}</p>
                        </div>`);
    $(".desc_category").append($elCategory);


    console.log(this.parsedContext);
    const parsedOptions = {
        demo: this.parsedContext.demo,
        userType: this.parsedContext.userType,
        courseId: this.data.courseId,
        studentId: this.parsedContext.userId,
    };
    var clChapter = new StudyCourseContainer(parsedOptions);
    $(".course_chapter").append(clChapter.elThis)

    // var clCard = new CourseCard();
}