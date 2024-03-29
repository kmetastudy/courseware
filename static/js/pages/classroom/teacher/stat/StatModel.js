import Model from "./core/Model.js"

export default class StatModel extends Model {
    static #CHAPTER_TYPE = 0;
    static #QUESTION_TYPE = "q";

    constructor(state) {
        super(state)
    }

    getTodayLessonResult() {
        const selectedLesson = 0
        const scheduledCourse = this.getScheduledCourse()
        const {studentsResult} = this.get()
        console.log(scheduledCourse[0].courses)

        let lessonResult = []
        let lessonResultList = []
        let todayLessonResult = []


        scheduledCourse[selectedLesson].courses.forEach((course) => {
            studentsResult.forEach((obj) => {
                let results = obj.result.filter((value) => value.id == course.id)
                // console.log(results)
                results[0].results.forEach((r)=>{
                    lessonResult.push(r.result)
                })
                let lessonResultVec = lessonResult.flat().map((x)=>{
                    if(x == 'O') {
                        return [1,0,0]
                    } else if(x == 'X') {
                        return [0,1,0]
                    } else {
                        return [0,0,1]
                    }
                })
                lessonResultList.push(lessonResultVec)
                lessonResult = []
            })
            // console.log(lessonResultList)
            const result = lessonResultList.reduce((acc, cur) => {
                if(acc.length == 0) {
                    acc = cur
                    return acc
                }
                acc = this.matrixAdition(acc, cur)
                return acc
            }, [])
            todayLessonResult.push({result, ...course})
            lessonResultList = []
        })

        console.log(todayLessonResult)
        
        return {todayLessonResult}
    }

    matrixAdition(a, b){
        let resultArr = [];
        for(let i = 0; i < a.length; i += 1){
          resultArr.push(a[i].map((x, y) => a[i][y] + b[i][y]));
        }
        return resultArr; // [[3, 6, 8,], [5, 7, 12,]]
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

    getAllChapter() {
        const {course} = this.get()
        
        const allChapter = course.filter(({type}) => type == 0)

        return {allChapter}
    }
}