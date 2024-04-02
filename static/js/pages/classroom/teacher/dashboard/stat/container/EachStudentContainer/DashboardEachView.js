import View from "../../core/View.js"

export default class DashboardEachView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {
        const name = state.selectedStudent.name
        return `
            <div class="card-body grow-0">
                <h2 class="card-title">개별 학생 현황</h2>
            </div>
            <div class="flex p-8 justify-around">
                <div class="flex flex-col gap-4">
                    <div>
                        <p class="font-bold text-2xl">${name}</p>
                        <p class="badge badge-error text-white">학업 성취도 낮음</p>
                    </div>
                    <div>
                        <p>잘하고 있어요!</p>
                        <p class="badge badge-outline">1단원 실수와 그 연산</p>
                    </div>
                    <div>
                        <p>도움이 필요해요</p>
                        <p class="badge badge-outline">3단원 도형의 이해</p>
                    </div>
                </div>
                <div data-component="barLine-each"></div>
            </div>
        `
    }
}