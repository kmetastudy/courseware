import View from "./core/View.js";

export default class StatView extends View {
  constructor(target) {
    super(target);
  }

  template(state) {
    const name = state.name ?? "학생";
    return `
            <header class="col-span-12 flex items-center gap-2 lg:gap-4">
                <label for="drawer-course-assign" class="btn btn-square btn-ghost drawer-button lg:hidden">
                    <span class="mtuicon mtuicon-menu" role="img" aria-label="menu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path></svg></span>
                </label>
                <div class="grow"><h1 class="lg:text-2xl lg:font-light">${name}님 환영합니다</h1></div>
            </header>
            <section class="stats stats-vertical xl:stats-horizontal col-span-12 w-full shadow-sm" data-component="dashboard-stat"></section>
            <section class="card col-span-12 xl:col-span-3 2xl:col-span-4 overflow-hidden bg-base-100 shadow-sm" data-component="dashboard-today"></section>
            <section class="card col-span-12 xl:col-span-9 2xl:col-span-8 overflow-hidden bg-base-100 shadow-sm" data-component="dashboard-chapter-stat-chart"></section>
        `;
  }
}
