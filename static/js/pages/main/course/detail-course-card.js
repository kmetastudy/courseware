// import { MtuViewCard } from "./mtu-view-card";
import { MtuCard } from "../../../core/mtu/card/mtu-card";
export function CourseCardManager(options, data) {
  this.options = options
  this.data = data
  this.elThis = null
  this.create()
}

CourseCardManager.prototype.create = function() {

  var price = this.data.price=='0'?'무료':this.data.price

  var $elCard = $(`<div class="flex flex-row md:flex-col border rounded-md lg:w-[300px] lg:fixed">
                      <img class="p-2 w-1/2 h-auto md:w-full" src="../../../../static/img/${this.data.thumnail}.png">
                      <div class="p-2 w-1/2 md:w-full">
                          <p class="text-base">${this.data.courseTitle}</p>
                          <div class="p-2 grid grid-cols-2 border-b">
                              <p class="text-sm text-gray-400">제작자</p>
                              <p class="text-sm">${this.data.producer}</p>

                              <p class="text-sm text-gray-400">난이도</p>
                              <p class="text-sm">${this.options.difficulty.find((obj)=>obj.type == this.data.difficulty).text}</p>

                              <p class="text-sm text-gray-400">수강기간</p>
                              <p class="text-sm">무제한</p>

                          </div>
                          <p class="p-2 text-xl text-end">${price}</p>
                          <div class="flex"></div>
                      </div>
                    </div>`)

  
  var $elCart = $(`<button class="rounded-lg"><i class="ri-shopping-cart-2-line text-[24px] hover:text-blue-800"></i></button>`)
  var $elButton = $(`<button class="mx-2 p-2 flex-1 rounded-lg bg-blue-800 text-white" onclick='window.location.href="/st/?course_id=${this.data.courseId}"'>체험하기</button>`)

  
  $elCart.on("click", () => {
    $.ajax({
      headers: { "X-CSRFToken": csrftoken },
      type: "POST",
      url: `/cart/${this.data.courseId}/add/`,
      success: function (res) {
        console.log("장바구니에 담기 성공")
      }, //end success
    }); // end of ajax
  })

  $elCard.children('div').children('div:eq(1)').append($elCart)
  $elCard.children('div').children('div:eq(1)').append($elButton)

  this.elThis = $elCard
}
