import { Sidebar } from "./sidebar"
import { FilterView } from "./mtv-filter"
import { CourseView } from "./course-view"

export function CourseManager(options, data) {
  this.options = options
  this.subject = "all"
  this.filter = {grade:[], semester:[], publisher:[], difficulty:[], isTest:"True"}
  this.oriData = data
  this.data = data
  this.init()
}

CourseManager.prototype.init = async function() {
  this.sidebarOptions = this.prepareSidebarOptions(this.options.subject_list)
  // console.log(this.sidebarOptions)
  var clSidebar = new Sidebar(this.sidebarOptions);
  clSidebar.elThis.children('div:eq(0)').addClass('bg-[#1E40AF]').addClass('text-white')
  $(".sidebar").append(clSidebar.elThis);

  $(".courses_header").text(options.schoolKor + " / 전과목");

  this.filterOptions = this.prepareFilterOptions()
  var clFilterView = new FilterView(this.filterOptions)
  $(".courses_filter").append(clFilterView.elThis);

  // var $elSearch = $(`<div class="flex flex-1 items-center">
  //                       <input type="text" class="mx-2 p-2 w-[150px] 2xl:w-full border rounded-full text-xs">
  //                       <i class="ri-search-line cursor-pointer"></i>
  //                   </div>`)

  // $elSearch[0].children[1].addEventListener('click', () => {
  //     console.log($elSearch[0].children[1].previousElementSibling.value)
  //     var keyword = $elSearch[0].children[1].previousElementSibling.value
  //     var obj = this.oriData
  //     // console.log(obj)
  //     var courses = obj.filter(course => course.courseTitle.includes(keyword))
  //     console.log(courses)
  //     this.data = courses
  //     this.createCourseView()
  // })

  // $(".courses_filter > div").append($elSearch)

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
      {text:'공통', type:0, onClick:this.onFilterHandler.bind(this)},
      {text:'1학년', type:1, onClick:this.onFilterHandler.bind(this)},
      {text:'2학년', type:2, onClick:this.onFilterHandler.bind(this)},
      {text:'3학년', type:3, onClick:this.onFilterHandler.bind(this)}
    ],
    semester:[
      {text:'전체 학기', type:0, onClick:this.onFilterHandler.bind(this)},
      {text:'1학기 중간', type:1, onClick:this.onFilterHandler.bind(this)},
      {text:'1학기 기말', type:2, onClick:this.onFilterHandler.bind(this)},
      {text:'2학기 중간', type:3, onClick:this.onFilterHandler.bind(this)},
      {text:'2학기 기말', type:4, onClick:this.onFilterHandler.bind(this)},
    ],
    publisher:[
      {text:'미래엔', type:'miraen', onClick:this.onFilterHandler.bind(this)},
      {text:'비상', type:'visang', onClick:this.onFilterHandler.bind(this)},
      {text:'천재', type:'chunjae', onClick:this.onFilterHandler.bind(this)}
    ],
    difficulty:[
      {text:'개념과 기초', type:0, onClick:this.onFilterHandler.bind(this)},
      {text:'실력향상', type:1, onClick:this.onFilterHandler.bind(this)},
      {text:'심화', type:2, onClick:this.onFilterHandler.bind(this)},
    ]
  }
}


CourseManager.prototype.createCourseView = function() {
  var clCourseView = new CourseView(this.data)
  if(this.data.length == 0) {
    $(".courses_main").html(`<div class="h-[500px] p-4 text-center flex flex-col justify-center items-center"><i class="ri-information-line text-[40px]"></i>코스를 준비하고 있어요.</div>`);
  } else {
    $(".courses_main").html(clCourseView.elThis);
  }
  
  
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
