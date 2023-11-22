import { Sidebar } from "./sidebar"
import { Filter } from "./filter"

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

  this.filterOptions = this.prepareFilterOptions()
  var clFilter = new Filter(this.filterOptions)
  $(".courses_filter").append(clFilter.elThis);

  // const courses = await this.urlGetCourses();
  // console.log(courses);

  // var $elCourses = $(`<div class="grid grid-cols-4"></div>`)

  // for (let i = 0; i < courses.length; i++) {
  //     // console.log(courses[i])
  //     var elCourseCard = new CourseCard(courses[i], i)
      
  //     $elCourses.append(elCourseCard.elThis)
  // }

  // $(".courses_main").html($elCourses);
}

CourseManager.prototype.prepareSidebarOptions = function(subjects) {
  var self = this
  var options = []
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
      {text:'상', type:3, onClick:this.onFilterHandler.bind(this)},
      {text:'중', type:2, onClick:this.onFilterHandler.bind(this)},
      {text:'하', type:1, onClick:this.onFilterHandler.bind(this)},
    ]
  }
}

////////////////////// handler /////////////////////////
CourseManager.prototype.onSidebarHandler = function(data) {
  this.subject = data
  // console.log(this)
  this.urlGetCourses()
}

CourseManager.prototype.onFilterHandler = function(key, type) {
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
  this.urlGetCourses()
}


//////////////////// API ///////////////////////
CourseManager.prototype.urlGetCourses = function() {
  $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        type: "POST",
        url: `/courses/${this.options.school}/${this.subject}/`,
        data : this.filter,
        dataType: "json",
        success: function (res) {
          console.log(res)

        }, //end success
      }); // end of ajax
}

// CourseManager.prototype.urlGetCourses = function() {
//     return axios.get("../../../cp/api/course_book/").then((res) => {
//       if (res?.data) {
//         return res.data;
//       } else {
//         console.log(res);
//         return [];
//       }
//     });
// }

function CourseCard(data, index) {
  this.data = data
  this.elThis = $(`<div class="p-4 cursor-pointer" onclick="location.href='../../../st/?course_id=${this.data.id}'">
                      <img src="../../../static/img/001.png">
                      <p>${this.data.title}</p>
                      <p class="text-gray-600 text-sm">megacourse</p>
                      <p class="text-md">55,000원</p>
                  </div>`)
}