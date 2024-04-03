import { CourseUnit } from "./mtu-course"
import { PaginationUnit } from "./mtu-pagination"

/*
1. 코스 리스트 전체/필터링된
2. 페이징
*/
const COUNT_PER_PAGE = 12

export function CourseView(data) {
  this.options = null
  this.data = data
  this.elThis = null
  
  this.currentPage = 1

  this.init()
  

}

CourseView.prototype.init = function() {
  var $elCourseView = $(`<div>
                          <div class="course-container"></div>
                          
                        </div>`)
  let courseOptions = {currentPage:this.currentPage, countPerPage:COUNT_PER_PAGE}
  var clCourseUnit = new CourseUnit(courseOptions, this.data)
  $elCourseView.find('.course-container').append(clCourseUnit.elThis)

  let pagenationOptions = {page:this.getTotalPageCount(), onClick:this.pageHandler.bind(this)}
  var clPaginationUnit = new PaginationUnit(pagenationOptions)
  $elCourseView.append(clPaginationUnit.elThis)
  

  this.elThis = $elCourseView

}

CourseView.prototype.getTotalPageCount = function() {
  return Math.ceil(this.data.length / COUNT_PER_PAGE)
}


CourseView.prototype.pageHandler = function(el) {
  // console.log(el.target.innerText)
  this.currentPage = el.target.innerText

  let courseOptions = {currentPage:this.currentPage, countPerPage:COUNT_PER_PAGE}
  var clCourseUnit = new CourseUnit(courseOptions, this.data)
  $('.course-container').html(clCourseUnit.elThis)
}