// import { MtuViewCard } from "./mtu-view-card";
import { MtuCard } from "../../../core/mtu/card/mtu-card";
import { TYPE_USER } from "../../user/constants";
export function CourseCardManager(options, data, context) {
  this.userType = context?.userType;
  this.userId = context?.userId;
  this.options = options;
  this.data = data;
  this.elThis = null;
  this.create();
}

CourseCardManager.prototype.create = function () {
  var price = this.data.price == "0" ? "무료" : this.data.price;

  var $elCard = $(`<div class="flex flex-row md:flex-col border rounded-md lg:w-[300px] lg:fixed">

                      <img class="p-2 w-1/2 md:w-full" src="/static/img/thumnail/${
                        this.data.thumnail
                      }.png">

                      <div class="p-2 w-1/2 md:w-full">
                          <p class="text-base">${this.data.courseTitle}</p>
                          <div class="p-2 grid grid-cols-2 border-b">
                              <p class="text-sm text-gray-400">제작자</p>
                              <p class="text-sm">${this.data.producer}</p>

                              <p class="text-sm text-gray-400">난이도</p>
                              <p class="text-sm">${
                                this.options.difficulty.find((obj) => obj.type == this.data.difficulty).text
                              }</p>

                              <p class="text-sm text-gray-400">수강기간</p>
                              <p class="text-sm">무제한</p>

                          </div>
                          <div class="flex"></div>
                          <div class="mt-2 py-2 grid grid-cols-2 border-t"></div>
                      </div>
                    </div>`);

  var $elCart = $(
    `<button class="rounded-lg"><i class="ri-shopping-cart-2-line text-[24px] hover:text-blue-800"></i></button>`,
  );
  var $elButton = $(
    `<button class="mx-2 p-2 flex-1 rounded-lg bg-blue-800 text-white" onclick='window.location.href="../../st/?course_id=${this.data.courseId}"'>체험하기</button>`,
  );

  $elCart.on("click", () => {
    $.ajax({
      headers: { "X-CSRFToken": csrftoken },
      type: "POST",
      url: `/cart/${this.data.courseId}/add/`,
      success: function (res) {
        console.log("장바구니에 담기 성공");
      }, //end success
    }); // end of ajax
  });

  // $elCard.children("div").children("div:eq(1)").append($elCart);
  $elCard.children("div").children("div:eq(1)").append($elButton);

  // Class
  // Teacher -> create class
  // Else -> join class
  const classButton =
    this.userType === TYPE_USER.TEACHER ? this.createClassLaunchButton() : this.createClassRegistrationButton();

  $elCard.children("div").children("div:eq(2)").append(classButton);

  this.elThis = $elCard;
};

CourseCardManager.prototype.createClassLaunchButton = function () {
  return $(
    `<button class="mx-2 p-2 col-span-2 rounded-lg bg-blue-800 text-white" onclick='window.location.href="/class/launch?id_course=${this.data?.courseId}"'>클래스 만들기</button>`,
  );
};

CourseCardManager.prototype.createClassRegistrationButton = function () {
  const $elButton = $(`<button class="mx-2 p-2 col-span-2 rounded-lg bg-blue-800 text-white">클래스 참가하기</button>`);

  $elButton.on("click", () => {
    const modal = document.getElementById("class_registration_modal");
    modal.showModal();
  });

  return $elButton;
};
