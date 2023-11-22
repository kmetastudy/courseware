/*
1. 코스 리스트 전체/필터링된
2. 랜딩페이지 추천 코스  
*/
export function CourseView(data) {
  this.options = null
  this.data = data
  this.elThis = null
  this.init()

}

CourseView.prototype.init = function() {
  var $elCourseList = $(`<div class="grid grid-cols-4"></div>`)
  this.data.forEach(function(course) {
    var $elCourse = $(`<div class="p-4 cursor-pointer">
                          <img src="../../../static/img/001.png">
                          <p>${course.courseTitle}</p>
                          <p class="text-gray-600 text-sm">megacourse</p>
                          <p class="text-md">${course.cost}</p>
                      </div>`)

    $elCourse.on("click", function(){
      window.location.href = `../${course.subject}/${course.courseId}`
    })

    $elCourseList.append($elCourse)
  });

  this.elThis = $elCourseList
}
