import View from "../../core/View.js";

export default class DashboardStatView extends View {
  constructor(target) {
    super(target);
  }

  template(state) {
    let { totalProgress, totalPoint, progressLow, progressMiddle, progressHigh } = state;

    return `
            <div class="stat">
                <div class="stat-title">학급 평균 성취율</div>
                <div class="flex justify-around items-center">
                    <p>성취율</p>
                    <div class="radial-progress bg-base-200 border-4 border-base-200" style="--value:${parseInt(
                      totalProgress,
                    )};" role="progressbar">${parseInt(totalProgress)}%</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">학급 평균 정답률</div>
                <div class="flex justify-around items-center">
                    <p>정답률</p>
                    <div class="radial-progress bg-base-200 border-4 border-base-200" style="--value:${parseInt(
                      totalPoint,
                    )};" role="progressbar">${parseInt(totalPoint)}%</div>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">학업 성취도</div>
                <div class="stat-value p-4 grid grid-cols-3 gap-4">
                    <div class="p-4 card rounded-box border">
                        <p class="text-start font-normal text-base">높음</p>
                        <p class="text-end">${parseInt(
                          progressHigh,
                        )}명<span class="pl-2 font-normal text-base"></span></p>
                    </div>
                    <div class="p-4 card rounded-box border">
                        <p class="text-start font-normal text-base">중간</p>
                        <p class="text-end">${parseInt(
                          progressMiddle,
                        )}명<span class="pl-2 font-normal text-base"></span></p>
                    </div>
                    <div class="p-4 card rounded-box border">
                        <p class="text-start font-normal text-base">낮음</p>
                        <p class="text-end">${parseInt(
                          progressLow,
                        )}명<span class="pl-2 font-normal text-base"></span></p>
                    </div>
                </div>
            </div> 
        `;
  }
}
