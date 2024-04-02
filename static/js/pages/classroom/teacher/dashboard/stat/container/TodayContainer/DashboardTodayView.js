import View from "../../core/View.js";

import LessonToday from "../../layout/organisms/LessonToday.js";

export default class DashboardTodayView extends View {
  constructor(target) {
    super(target);
  }

  template(state) {
    const { todayScheduler } = state;

    // console.log(scheduledCourse[date])

    return `
            <div class="card-body grow-0">
                <h2 class="card-title">오늘 수업</h2>
            </div>
            <div class="p-8 pt-0 flex flex-col gap-8" data-component="today-lesson">
                ${LessonToday(todayScheduler)}
                <div class="grid grid-cols-3 gap-2">
                    <div class="p-2 card rounded-box bg-[#00a96e] text-center font-bold">
                        <p>학습완료</p>
                        <p>10명</span></p>
                    </div>
                    <div class="p-2 card rounded-box bg-[#00a96e]/60 text-center font-bold">
                        <p>학습중</p>
                        <p>15명</span></p>
                    </div>
                    <div class="p-2 card rounded-box bg-[#00a96e]/20 text-center font-bold">
                        <p>학습전</p>
                        <p>5명</span></p>
                    </div>
                </div>
            </div>
        `;
  }
}
