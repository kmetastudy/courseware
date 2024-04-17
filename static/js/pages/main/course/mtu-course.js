export function CourseUnit(options, data) {
  this.options = options
  this.data = data
  this.elThis = null
  
  this.create()

}

CourseUnit.prototype.create = function() {
  const path = window.location.pathname
  const splitedPath = path.split('/')
  let uri = '/'
  if(splitedPath.includes('school')){
      uri = path
  }
  console.log(uri)

  var $elCourseList = $(`<div class="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4"></div>`)
  let pageNumber = this.options.currentPage
  for(let i = this.options.countPerPage * (pageNumber - 1) + 1;
      i <= this.options.countPerPage * (pageNumber - 1) + this.options.countPerPage && i <= this.data.length;
      i++){
        let course = this.data[i-1]
        if(!course.deliver){
          course.deliver=''
          var $elCourse = $(`<div class="m-4 cursor-pointer">
                              <img src="/static/img/thumnail/${course.thumnail}.png">
                              <p class="text-[16px] truncate">${course.courseTitle}</p>
                              <p class="text-gray-600 text-[12px]">megacourse</p>
                              <div class="flex justify-between">
                                <p class="text-[12px] text-[#1E40AF] font-bold">${course.deliver}</p>
                                <div class="flex">
                                  <i class="ri-heart-3-line hover:text-red-500"></i>
                                </div>
                              </div>
                          </div>`)
        } else{
          if(course.deliver.length > 5){
            course.deliver = course.deliver.slice(0,4)+'O'+course.deliver.slice(5)
          }
          var $elCourse = $(`<div class="m-4 cursor-pointer">
                              <img src="/static/img/thumnail/${course.thumnail}.png">
                              <p class="text-[16px] truncate">${course.courseTitle}</p>
                              <p class="text-gray-600 text-[12px]">megacourse</p>
                              <div class="flex justify-between">
                                <p class="text-[12px] text-[#1E40AF] font-bold">${course.deliver} 맞춤형</p>
                                <div class="flex">
                                  <i class="ri-heart-3-line hover:text-red-500"></i>
                                </div>
                              </div>
                          </div>`)
        }
        // if(course.price == '0' | course.price == '무료'){
        //   course.price='무료'
        //   var $elCourse = $(`<div class="m-4 cursor-pointer">
        //                       <img src="/static/img/thumnail/${course.thumnail}.png">
        //                       <p class="text-[16px] truncate">${course.courseTitle}</p>
        //                       <p class="text-gray-600 text-[12px]">megacourse</p>
        //                       <div class="flex justify-between">
        //                         <p class="text-[12px] text-[#1E40AF] font-bold">${(course.price).toLocaleString()}</p>
        //                         <div class="flex">
        //                           <i class="ri-heart-3-line hover:text-red-500"></i>
        //                         </div>
        //                       </div>
        //                   </div>`)
        // } else{
        //   var $elCourse = $(`<div class="m-4 cursor-pointer">
        //                       <img src="/static/img/thumnail/${course.thumnail}.png">
        //                       <p class="text-[16px] truncate">${course.courseTitle}</p>
        //                       <p class="text-gray-600 text-[12px]">megacourse</p>
        //                       <div class="flex justify-between">
        //                         <p class="text-[12px] text-[#1E40AF] font-bold">￦ ${(course.price).toLocaleString()}</p>
        //                         <div class="add-option flex">
        //                           <i class="ri-heart-3-line hover:text-red-500"></i>
        //                         </div>
        //                       </div>
        //                   </div>`)
        // }
    
        var $elCart = $(`<i class="ri-shopping-cart-2-line px-2 hover:text-blue-700"></i>`)
        $elCart.on("click", (e) => {
          e.stopPropagation()
          $.ajax({
            headers: { "X-CSRFToken": csrftoken },
            type: "POST",
            url: `/cart/${course.courseId}/add/`,
            success: function (res) {
              console.log("장바구니에 담기 성공")
            }, //end success
          }); // end of ajax
          toastOn()
        })
    
        $elCourse.find('.add-option').append($elCart)
    
    
        $elCourse.on("click", function(){
          window.location.href = uri + `courses/${course.school}/${course.subject}/${course.courseId}`
        })
    
    
        $elCourseList.append($elCourse)
  }

  var $toastMessage = $(`<div id="toast_message" class="flex justify-between items-center w-[400px]">장바구니에 추가되었습니다. <a href="/cart" class="text-sm text-green-600">보러가기</a></div>`)
    
  function toastOn(){
    $toastMessage.addClass('active');
    setTimeout(function(){
        $toastMessage.removeClass('active');
    },3000);
  }

  $elCourseList.append($toastMessage)

  this.elThis = $elCourseList

}

CourseUnit.prototype.setPageOf = function(pageNumber) {
  for(let i = this.options.countPerPage * (pageNumber - 1) + 1;
      i <= this.options.countPerPage * (pageNumber - 1) + this.options.countPerPage && i <= this.data.length;
      i++){
        let course = this.data[i-1]
        console.log(course)
      }
}
