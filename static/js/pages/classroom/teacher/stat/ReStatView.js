import View from "./core/View.js";

export default class StatView extends View {
    constructor(target) {
        super(target);
    }

    template() {
        return `
            <header class="col-span-12 flex items-center gap-2 lg:gap-4">
                <label for="drawer-course-assign" class="btn btn-square btn-ghost drawer-button lg:hidden">
                    <span class="mtuicon mtuicon-menu" role="img" aria-label="menu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path></svg></span>
                </label>
                <div class="grow"><h1 class="lg:text-2xl lg:font-light">통계</h1></div>
            </header>
            
            <section class="card col-span-12 md:col-span-3 overflow-hidden bg-base-100 shadow-sm" data-component="dashboard-course"></section>
            <section class="card col-span-12 md:col-span-9 overflow-hidden bg-base-100 shadow-sm" data-component="dashboard-result"></section>
        `
    }
}