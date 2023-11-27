import { Sidebar } from "./sidebar"
import { Filter } from "./filter"
import { CourseView } from "./course-view"

export function CourseManager(options, data) {
  this.options = options
  this.subject = "all"
  this.filter = {grade:[], semester:[], difficulty:[], isTest:"True"}
  this.data = data
  this.init()
}

CourseManager.prototype.init = async function() {
  this.sidebarOptions = this.prepareSidebarOptions(this.options.subject_list)
  // console.log(this.sidebarOptions)
  var clSidebar = new Sidebar(this.sidebarOptions);
  $(".sidebar").append(clSidebar.elThis);

  $(".courses_header").text(options.schoolKor + " / 전과목");

  this.filterOptions = this.prepareFilterOptions()
  var clFilter = new Filter(this.filterOptions)
  $(".courses_filter").append(clFilter.elThis);

  this.createCourseView()

}

CourseManager.prototype.prepareSidebarOptions = function(subjects) {
  var self = this
  var options = [{title:'전과목',url:'all',onClick:this.onSidebarHandler.bind(this)}]
  subjects.forEach(function(subject){
    var option = {}
    option.title = subject.kor
    option.url = subject.eng
    option.onClick = self.onSidebarHandler.bind(self)
    options.push(option)
  })

  return options
}

CourseManager.prototype.prepareFilterOptions = function() {
  return {
    grade:[
      {text:'1학년', type:1, onClick:this.onFilterHandler.bind(this)},
      {text:'2학년', type:2, onClick:this.onFilterHandler.bind(this)},
      {text:'3학년', type:3, onClick:this.onFilterHandler.bind(this)}
    ],
    semester:[
      {text:'공통', type:0, onClick:this.onFilterHandler.bind(this)},
      {text:'1학기', type:1, onClick:this.onFilterHandler.bind(this)},
      {text:'2학기', type:2, onClick:this.onFilterHandler.bind(this)},
    ],
    difficulty:[
      {text:'상', type:2, onClick:this.onFilterHandler.bind(this)},
      {text:'중', type:1, onClick:this.onFilterHandler.bind(this)},
      {text:'하', type:0, onClick:this.onFilterHandler.bind(this)},
    ]
  }
}


CourseManager.prototype.createCourseView = function() {
  var clCourseView = new CourseView(this.data)
  $(".courses_main").html(clCourseView.elThis);
}

////////////////////// handler /////////////////////////
CourseManager.prototype.onSidebarHandler = async function(kor,eng) {
  this.subject = eng
  // console.log(this)
  $(".courses_header").text(options.schoolKor + " / " + kor);
  this.data = await this.urlGetCourses()
  this.createCourseView()
}

CourseManager.prototype.onFilterHandler = async function(key, type) {
  const filterData = this.filter[key]
  if (filterData.includes(type)){
    for(let i = 0; i < filterData.length; i++) {
      if(filterData[i] == type)  {
        filterData.splice(i, 1);
        i--;
      }
    }
  } else {
    filterData.push(type)
  }

  console.log(this.filter)
  this.data = await this.urlGetCourses()
  this.createCourseView()
}


//////////////////// API ///////////////////////
CourseManager.prototype.urlGetCourses = async function() {
  var courses;
  $.ajax({
    headers: { "X-CSRFToken": csrftoken },
    type: "POST",
    url: `/courses/${this.options.school}/${this.subject}/`,
    data : this.filter,
    dataType: "json",
    async: false,
    success: function (res) {
      courses = JSON.parse(res.courses)
      console.log(courses)
    }, //end success
  }); // end of ajax

  return courses
}
