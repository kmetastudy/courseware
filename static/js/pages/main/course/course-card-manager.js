// import { MtuViewCard } from "./mtu-view-card";
import { MtuCard } from "../../../core/mtu/card/mtu-card";
export function CourseCardManager(data) {
  this.options = null
  this.data = data
  this.elThis = null
  this.create()
}

CourseCardManager.prototype.create = function() {
  var $elCard = $(`<div class="border rounded-md">
                      <img src="../../../../static/img/001.png">
                      <div class="p-2">
                          <p class="text-base">${this.data.courseTitle}</p>
                          <div class="p-2 grid grid-cols-2 border-b">
                              <p class="text-sm text-gray-400">제작자</p>
                              <p class="text-sm">${this.data.producer}</p>

                              <p class="text-sm text-gray-400">난이도</p>
                              <p class="text-sm">${this.data.difficulty}</p>

                              <p class="text-sm text-gray-400">수강기간</p>
                              <p class="text-sm">무제한</p>

                              <p class="text-sm text-gray-400">총 강의 수</p>
                              <p class="text-sm">10강(12시간)</p>
                          </div>
                          <p class="p-2 text-2xl">${this.data.price}</p>
                          <button class="p-2 w-full rounded-lg bg-gray-200">수강하기</button>
                      </div>
                    </div>`)

  this.elThis = $elCard
}