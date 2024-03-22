import View from "../../core/View.js"

export default class DashboardInfoView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {
        const { totalStudents } = state

        return `
            <div class="grow">
                <h1 class="lg:text-2xl lg:font-light">통계</h1>
            </div>
            <div>
                <p class="lg:font-bold">정지윤 선생님</p>
            </div>
            <div class="dropdown dropdown-end z-10">
                <div tabindex="0" class="btn btn-circle btn-ghost">
                    <div class="indicator">
                        <span class="badge indicator-item badge-error badge-xs"></span>
                        <svg data-src="https://unpkg.com/heroicons/20/solid/bell.svg" class="h-5 w-5"></svg>
                    </div>
                </div>
                <ul
                    tabindex="0"
                    class="menu dropdown-content mt-3 w-80 rounded-box bg-base-100 p-2 shadow-2xl">
                    <li>
                        <a class="gap-4">
                            <div class="avatar">
                                <div class="w-8 rounded-full">
                                    <img src="https://picsum.photos/80/80?1" />
                                </div>
                            </div>
                            <span>
                                <b>New message</b>
                                <br />
                                Alice: Hi, did you get my files?
                            </span>
                        </a>
                    </li>
                    <li>
                        <a class="gap-4">
                            <div class="avatar">
                                <div class="w-8 rounded-full">
                                    <img src="https://picsum.photos/80/80?2" />
                                </div>
                            </div>
                            <span>
                                <b>Reminder</b>
                                <br />
                                Your meeting is at 10am
                            </span>
                        </a>
                    </li>
                    <li>
                        <a class="gap-4">
                            <div class="avatar">
                                <div class="w-8 rounded-full">
                                    <img src="https://picsum.photos/80/80?3" />
                                </div>
                            </div>
                            <span>
                                <b>New payment</b>
                                <br />
                                Received $2500 from John Doe
                            </span>
                        </a>
                    </li>
                    <li>
                        <a class="gap-4">
                            <div class="avatar">
                                <div class="w-8 rounded-full">
                                    <img src="https://picsum.photos/80/80?4" />
                                </div>
                            </div>
                            <span>
                                <b>New payment</b>
                                <br />
                                Received $1900 from Alice
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        `
    }
}