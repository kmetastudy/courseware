import View from "../../core/View.js"

export default class DashboardEveryView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {
        return `
            <div class="card-body grow-0">
                <h2 class="card-title">전체 학생 현황</h2>
            </div>
            <div class="flex p-8 justify-center">
                <div data-component="scatter-every"></div>
            </div>
        `
    }
}