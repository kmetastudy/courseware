import { Sidebar } from "../sidebar/sidebar"

export function CourseManager(options) {
  this.option = options
  this.subject = null
  this.data = null
  this.init()
}

CourseManager.prototype.init = async function() {
  this.sidebarOptions = this.prepareSidebarOptions(this.option.subject_list)
  console.log(this.sidebarOptions)
  var clSidebar = new Sidebar(this.sidebarOptions);
  $(".sidebar").append(clSidebar.elThis);


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
    option.text = subject.kor
    option.url = subject.eng
    option.onClick = self.onSidebarHandler.bind(self)
    options.push(option)
  })

  return options
}


////////////////////// handler /////////////////////////
CourseManager.prototype.onSidebarHandler = function(data) {
  this.subject = data
  // console.log(this)
  this.urlGetCourses()
}


//////////////////// API ///////////////////////
CourseManager.prototype.urlGetCourses = function() {
  $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        type: "POST",
        url: `/courses/${this.option.school}/${this.subject}/`,
        data : {},
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