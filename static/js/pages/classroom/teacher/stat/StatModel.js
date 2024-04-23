import Model from "./core/Model.js"
import { sum, extract, extracts } from "../../../../core/utils/array/";
import isNumber from "../../../../core/utils/type/isNumber.js";

export default class StatModel extends Model {
    static CHAPTER_TYPE = 0;
    static QUESTION_TYPE = "q";

    constructor(state) {
        super(state)
    }

    getTodayLessonResult() {
        /*
        오늘 차시 수업 문제의 정답/오답/미응시 학생들 카운트
        output :
            todayLessonResult = [{date:'', id:'lesson or testum 아이디', 
                                level:2, result:[], title:'lesson or testum 제목', 
                                type:11or12, units:[]}]
        */
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
                acc = matrixAdition(acc, cur)
                return acc
            }, [])
            todayLessonResult.push({result, ...course})
            lessonResultList = []
        })

        // console.log(todayLessonResult)
        
        return {todayLessonResult}
    }


    getAllStatByResult() {
        /*
        학생 전체의 챕터별 stat과 챕터전체 stat
        output :
            studentStat = [{id:'학생아이디', name:'학생이름', 
                        studentChapterStat:[{챕터별 진행률, 정답률}], 
                        studentProgress:전체 진행률, studentPoint:전체 정답률}, ...]
        */
        const {studentsResult} = this.get()
        const studentStat = []

        studentsResult.forEach((obj) => {
            let id = obj.id
            let name = obj.name
            let {studentChapterStat, studentProgress, studentPoint} = this.creatStudentStat(obj.result)
            studentStat.push({id, name, studentChapterStat, studentProgress, studentPoint})
        })
        // console.log(studentStat)

        return {studentStat}
    }

    creatStudentStat(result) {
        /*
        학생의 챕터별 stat과 챕터전체 stat을 구함
        input : result 학생 개별 결과 
        output :
            studentChapterStat = [{id:'챕터아이디', title:'챕터명', progress:-, point:-},...]
            studentProgress = - (코스 전체 평균 진행률)
            studentPoint = - (코스 전체 평균 정답률)
        */
        let studentChapterStat = result.filter((data) => data.type == StatModel.CHAPTER_TYPE)
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


    getScheduledCourse() {
        /*
        course 원본 데이터를 날짜끼리 모아서 차시로 구분 
        chapter가 바뀌면 1차시부터 다시 시작
        output : 
            schedule = [{seq: -, chapter:'', courses:[], date:'', lesson:-}, ...]
        */
        const {course} = this.get()
        let prevLevel = ''
        let prevDate = ''
        let chapter = ''
        let lesson = 0
        let seq = 0
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
                schedule.push({seq:seq, chapter:chapter, lesson:lesson, date:prevDate, courses:courses})
                seq += 1
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
                    schedule.push({seq:seq, chapter:chapter, lesson:lesson, date:prevDate, courses:courses})
                    seq += 1
                    courses = []
                    prevDate = obj.date
                }

                prevLevel = obj.level
                courses.push(obj)
            }

            
        })
        // console.log(schedule)
        return schedule
    }

    getAllChapter() {
        const {course} = this.get()
        
        const allChapter = course.filter(({type}) => type == 0)

        return allChapter
    }

    composeChapterAvg() {
        const studyResults = this.getState("studyResults")

        const properties = studyResults.map(({ json_data: { property } }) => property);

        const chaptersProperties = properties.map((property) => {
            const chapters = groupChapter(property)
            const chaptersProperty = chapters.map((chapter) => {
                let branches = filterBranch(chapter)
                let progress = getAverage(branches, "progress")
                let point = getAverage(branches, "point")
                chapter[0].progress = progress
                chapter[0].point = point
                return chapter[0]
            })
            return chaptersProperty
        })
        return chaptersProperties
    }

    composeSchedule() {
        const course = this.getState("classContentAssign")

        const {json_data: { scheduler_list: schedulerList }} = course

        const chapters = groupChapter(schedulerList)

        const schedules = chapters.map((chapter) => groupByDate(chapter))
        
        return schedules
    }

    getScheduleInProcess() {

    }

    getClassStat(id, type) {
        /*
        전체 학생들 평균(윗라인)
        input DashboardCourse에서 선택된 항목
            id: []
            type: null이면 전체, 0이면 단원, - 차시
        */
        const branches = this.getSelectedBranch(id, type).flat()
        console.log(branches)
        const progress = getAverage(branches, "progress")
        const point = getAverage(branches, "point")

        const classSummary = this.getSummary(branches, type, "class")

        const selectedSchedule = this.getSelectedSchedule()

        return {progress:parseInt(progress), point:parseInt(point), classSummary}
    }

    getSelectedSchedule() {
        const { classContentAssign } = this.get();

        const {
            json_data: { scheduler_list: schedulerList },
        } = classContentAssign;



        return
    }

    getStudentStat(id, type) {
        /*
        학생들 각각 평균
        input
            id: []
            type: null이면 전체, 0이면 단원, - 차시
        */
        const studyResults = this.getState("studyResults")
        const users = this.getState("users")

        const students = studyResults.map(({id_student,  json_data: { property }}) => { return {id_student, property}});

        const studentsBranches = students.map(({id_student, property}) => {
            const name = filterStudentName(users, id_student)[0].full_name
            const branch = filterBranch(property, id, type)
            return {id_student:id_student, name:name, branches:branch}
        })

        const studentsResult = studentsBranches.map((obj) => {
            const progress = getAverage(obj.branches, "progress")
            const point = getAverage(obj.branches, "point")
            const studentSummary = this.getSummary(obj.branches, type, "student")
            return {progress:parseInt(progress), point:parseInt(point), studentSummary, ...obj}
        })

        return studentsResult
    }

    getSelectedBranch(id, type) {
        const studyResults = this.getState("studyResults")

        const properties = studyResults.map(({ json_data: { property } }) => property);

        const branches = properties.map((property) => filterBranch(property, id, type))

        return branches
    }

    getSummary(array, type, key) {

        
        if(!Number.isInteger(type)) {
            const chapters = this.composeChapterAvg().flat()
            console.log(chapters)
            const chaptersById = groupByBranchId(chapters)
            const scheduleProgress = []
            const schedulePoint = []
            Object.keys(chaptersById).forEach((key, index) => {
                const branches = chaptersById[key]
                const progress = getAverage(branches, "progress")
                const point = getAverage(branches, "point")
                scheduleProgress.push(parseInt(progress))
                schedulePoint.push(parseInt(point))
            })
            return {scheduleProgress, schedulePoint}
        } else if(type == 0) {
            const scheduledBranchesByDate = groupByDate(array)
            const scheduleProgress = []
            const schedulePoint = []
            Object.keys(scheduledBranchesByDate).forEach((key, index) => {
                const branches = scheduledBranchesByDate[key]
                const progress = getAverage(branches, "progress")
                const point = getAverage(branches, "point")
                scheduleProgress.push(parseInt(progress))
                schedulePoint.push(parseInt(point))
            })

            return {scheduleProgress, schedulePoint}
        } else {
            const scheduledBranchesByDate = groupByBranchId(array)
            const scheduleBranches = []
            const scheduleProgress = []
            const schedulePoint = []
            Object.keys(scheduledBranchesByDate).forEach((key, index) => {
                const branches = scheduledBranchesByDate[key]
                const progress = getAverage(branches, "progress")
                const point = getAverage(branches, "point")
                scheduleBranches.push(branches[0])
                scheduleProgress.push(parseInt(progress))
                schedulePoint.push(parseInt(point))
            })

            return {scheduleBranches, scheduleProgress, schedulePoint}
        }
        
    }

    getStudentQuestionResult() {
        const scheduledBranchesById = groupByBranchId(array)
            console.log(scheduledBranchesById)
            const branchIds = Object.keys(scheduledBranchesById)

            const branchUnits = this.getDefaultBranchUnits(scheduledBranchesById, branchIds) // Unit 형태를 본따 0으로 채워넣음

            const branchUnitsResult = this.getResultBranchUnits(scheduledBranchesById, branchIds) // 실제 Unit 결과
            
            const convertedUnitsResult = branchUnitsResult.map((branch, index_branch) => {
                return {id:branch.id, title:branch.title, type:branch.type, result:this.convertResult(branch.studentsResult, branchUnits[index_branch], key)}
            })

            const resultAverage = convertedUnitsResult.map((result) => {
                const average = result.result.reduce((acc, cur, index, arr) => {
                    if (acc.length == 0) {
                        acc = cur;
                        return acc;
                      }
                      acc = matrixAdition(acc, cur);
                      return acc;
                }, [])
                return {id:result.id, title:result.title, type:result.type, average:average}
            })
            console.log(resultAverage)

            return resultAverage
    }

    getDefaultBranchUnits(scheduledBranchesById, branchIds) {
        const branchUnits = branchIds.map((branch) => {
            const unitType = scheduledBranchesById[branch].map(({units}) => {
                const types = units.map(({types}) => new Array(types.length).fill(0))
                return types
            })
            return {id:branch, units:unitType[0]}
        })

        return branchUnits
    }

    getResultBranchUnits(scheduledBranchesById, branchIds) {
        const branchUnitsResult = branchIds.map((branch) => {
            const studentsResult = scheduledBranchesById[branch].map(({results}) => {
                const unitsResult = results.map(({result}) => result)
                return unitsResult
            })
            return {id:branch, title:scheduledBranchesById[branch][0].title, type:scheduledBranchesById[branch][0].type, studentsResult:studentsResult}
        })

        return branchUnitsResult
    }

    convertResult(branchResult, branchUnits, key) {
        // console.log(branchUnits)
        const studentResult = branchResult.map((result, index_student) => {
            if(result.length == 0) {
                result = branchUnits.units
            }
            const convertedResult = result.map((unit, index_unit) => {
                let unitData = unit
                const unitDataLength = unitData.length
                const defaultUnitLength = branchUnits.units[index_unit].length
                // console.log(unitData, unitDataLength, branchUnit.units[index_unit])
                if(unitData.length == 0) {
                    unitData = branchUnits.units[index_unit]
                } else if(unitDataLength < defaultUnitLength) {
                    unitData = unit.concat(branchUnits.units[index_unit].slice(unitData.length-1, -1))
                }
                // console.log(key)
                if(key == "student") {
                    return unitData
                } 
                const unitResult = []
                // console.log(unitData)
                unitData.forEach((item) => {
                    if(item == "O") {unitResult.push(1)}
                    else if(item == "X") {unitResult.push(0)}
                    else if(item == "?") {unitResult.push(0)}
                    else {unitResult.push(item)}
                })
                return unitResult
                
            })
            return convertedResult
        })
        return studentResult
    }
}

function getAverage(array, key) {
    const keyData = extract(array, key)
    return calculateAverage(keyData)
}

function filterChapter(array) {
    return array.filter((item) => item.type == StatModel.CHAPTER_TYPE)
}

function filterStudentName(array, id) {
    return array.filter((item) => item.id == id)
}

function filterBranch(array, id, type) {
    /*
    학생 결과에서 필요한 브랜치를 반환한다.(전체, 한 단원, 한 차시)
    input
        array: [] 학생 개별 결과
        id: [] 챕터 id or 브랜치 ids array
        type: - 전체/단원/차시
    output : [{level: -, type: - , title:'', ...}, ...]
    */
    if(!Number.isInteger(type)) {
        return array.filter((item) => item.type !== StatModel.CHAPTER_TYPE)
    } else if(type == 0) {
        let chapters = []
        array.reduce((acc, item, index, arr) => {
            if(id.includes(item.id)) {
                return index
            } 
            if(Number.isInteger(acc) && item.level == 1) {
                chapters = arr.slice(acc+1, index)
                return null

            } else if(Number.isInteger(acc) && index === arr.length - 1) {
                chapters = arr.slice(acc+1, index+1)
                return null
            }
            return acc
        }, null)

        return chapters
    } else {
        return array.filter((item) => id.includes(item.id))
    }
    
}

function groupChapter(array) {
    let chapters = []
    array.reduce((acc, obj, index, arr) => {
        if(index == 0) {return acc}

        if(index === arr.length - 1) {chapters.push(arr.slice(acc, index+1))}

        if(obj.level == 1) {
            chapters.push(arr.slice(acc, index))
            return index
        }
        
        return acc
    }, 0)
    
    return chapters
}

function groupByDate(array) {
    return Object.groupBy(array, ({date}) => date.length > 0 ? utcToLocalString(date) : "chapter")
}

function groupByBranchId(array) {
    return Object.groupBy(array, ({id}) => id)
}

function utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
}

function calculateAverage(array) {
    const total = sum(array);
    const average = total / (array.length * 100);
    const percent = average * 100;
    return percent;
}

function arrayAdition(a, b){
    return b.map((x, y) => {
        if (a.length < b.length) {

        }
        if(a[y] == "O") return x + 1
        x + a[y]
    })
}

function matrixAdition(a, b){
    let resultArr = [];
    for(let i = 0; i < a.length; i += 1){
      resultArr.push(a[i].map((x, y) => (a[i][y] + b[i][y])/2));
    }
    return resultArr; // [[3, 6, 8,], [5, 7, 12,]]
}