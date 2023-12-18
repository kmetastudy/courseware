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
  var $elCourseList = $(`<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4"></div>`)
  this.data.forEach(function(course) {
    if(course.price == '0'){
      course.price='무료'
      var $elCourse = $(`<div class="m-4 cursor-pointer">
                          <img src="../../../static/img/${course.thumnail}.png">
                          <p class="text-[16px] truncate">${course.courseTitle}</p>
                          <p class="text-gray-600 text-[12px]">megacourse</p>
                          <div class="flex justify-between">
                            <p class="text-[12px] text-[#1E40AF] font-bold">${(course.price).toLocaleString()}</p>
                            <div class="flex">
                              <i class="ri-heart-3-line hover:text-red-500"></i>
                            </div>
                          </div>
                      </div>`)
    } else{
      var $elCourse = $(`<div class="m-4 cursor-pointer">
                          <img src="../../../static/img/${course.thumnail}.png">
                          <p class="text-[16px]">${course.courseTitle}</p>
                          <p class="text-gray-600 text-[12px]">megacourse</p>
                          <div class="flex justify-between">
                            <p class="text-[12px] text-[#1E40AF] font-bold">￦ ${(course.price).toLocaleString()}</p>
                            <div class="add-option flex">
                              <i class="ri-heart-3-line hover:text-red-500"></i>
                            </div>
                          </div>
                      </div>`)
    }

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
      window.location.href = `/courses/${course.school}/${course.subject}/${course.courseId}`
    })


    $elCourseList.append($elCourse)
  });

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
