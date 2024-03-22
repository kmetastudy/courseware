import Model from "./core/Model.js"

export default class StatModel extends Model {
    static #CHAPTER_TYPE = 0;
    static #QUESTION_TYPE = "q";

    constructor(state) {
        super(state)
    }

    getAllStatByResult() {
        const {studentsResult} = this.get()
        const studentStat = []

        studentsResult.forEach((obj) => {
            let id = obj.id
            let name = obj.name
            let {studentChapterStat, studentProgress, studentPoint} = this.creatStudentStat(obj.result)
            studentStat.push({id, name, studentChapterStat, studentProgress, studentPoint})
        })

        return {studentStat}
    }

    creatStudentStat(result) {
        /* 
        데이터 구조
        studentChapterStat = [{id:'', chapter:'', progress:[]},]
        
        */
        let studentChapterStat = result.filter((data) => data.type == StatModel.#CHAPTER_TYPE)
        let studentProgress = 0
        let studentPoint = 0

        let prevLevel = ''
        let chapter = 0
        let progress = []
        let point = []
        
        result.forEach((obj) => {
            
            if(!prevLevel){
                prevLevel = obj.level
                return
            } 
            
            if(obj.level >= prevLevel) {
                progress.push(obj.progress)
                point.push(obj.point / obj.numOfQuestion * 100)

                prevLevel = obj.level

                return
            }

            studentChapterStat[chapter].progress = progress.reduce((a, b) => a + b, 0) / progress.length
            studentChapterStat[chapter].point = point.reduce((a, b) => a + b, 0) / point.length

            progress = []
            point = []
            prevLevel = obj.level
            chapter +=1
        })
        studentChapterStat[chapter].progress = progress.reduce((a, b) => a + b, 0) / progress.length
        studentChapterStat[chapter].point = point.reduce((a, b) => a + b, 0) / point.length

        studentProgress = studentChapterStat.reduce((a, b) => a + b.progress, 0) /studentChapterStat.length
        studentPoint = studentChapterStat.reduce((a, b) => a + b.point, 0) /studentChapterStat.length

        return {studentChapterStat, studentProgress, studentPoint}
    }


    getScheduledCourse() {  // Level 1인지 2인지 구분해주는 데코레이터로 변경해야함
        const {course} = this.get()
        let prevLevel = ''
        let prevDate = ''
        let chapter = ''
        let lesson = 0
        let courses = []
        const schedule = []

        course.forEach((obj) => {
            if(!prevLevel) {
                prevLevel = obj.level
                chapter = obj.title
                lesson = 0
                return
            } 

            if(obj.level < prevLevel) {
                lesson += 1
                schedule.push({chapter:chapter, lesson:lesson, date:prevDate, courses:courses})
                courses = []
                prevDate = obj.date
                prevLevel = obj.level
                chapter = obj.title
                lesson = 0
                return
            }

            if(obj.level >= prevLevel) {
                
                if(!prevDate) {
                    prevDate = obj.date
                    courses.push(obj)
                    return
                } 
                if(prevDate == obj.date){
                    courses.push(obj)
                    return
                } else {
                    lesson += 1
                    schedule.push({chapter:chapter, lesson:lesson, date:prevDate, courses:courses})
                    courses = []
                    prevDate = obj.date
                }

                prevLevel = obj.level
                courses.push(obj)
            }

            
        })
        return schedule
    }
}