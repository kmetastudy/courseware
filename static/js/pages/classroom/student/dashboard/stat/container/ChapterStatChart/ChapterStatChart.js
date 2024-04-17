import { Component } from "../../../../../../../shared/component/Component";
import { store } from "./store";
import { ChapterStatChartModel } from "./ChapterStatChartModel";
import { createTabs } from "../../../../../../../core/mtu/tab/create-tabs";
import { classNames } from "../../../../../../../core/utils/class-names";

export class ChapterStatChart extends Component {
  constructor({ target, props }) {
    super({ target, props, model: new ChapterStatChartModel({ ...props, selectedTabValue: "progress" }) });
  }

  template() {
    const currentValue = store.state.selectedTabValue;
    const tabs = createTabs();

    const elTabRoot = tabs.Root({
      defaultValue: currentValue,
    });

    const TabList = tabs.List({ class: "tabs-bordered" });
    this.TabList = TabList;

    const ProgressTab = tabs.Tab({
      value: "progress",
      child: "성취도",
      class: classNames("tab", { "tab-active": currentValue === "progress" }),
      "data-component": "chapter-stat-chart-tab",
      "data-value": "progress",
    });

    const PointTab = tabs.Tab({
      value: "point",
      child: "점수",
      class: classNames("tab", { "tab-active": currentValue === "point" }),
      "data-component": "chapter-stat-chart-tab",
      "data-value": "point",
    });

    const ProgressPanel = tabs.Panel({
      value: "progress",
      child: null,
    });

    const PointContent = tabs.Panel({
      value: "point",
      child: null,
    });

    elTabRoot.append(TabList, ProgressPanel, PointContent);
    TabList.append(ProgressTab, PointTab);

    tabs.init();

    const TabRoot = elTabRoot.outerHTML;

    return `
      <div class="card-body">
        <div class="flex justify-between gap-2">
          <h2 class="card-title grow">단원 별 현황</h2>
          ${TabRoot}
        </div>
        <div data-component="section-chapter-stat-chart"></div>
      </div>
    `;
  }

  setEvent() {
    const tabs = this.$target.querySelectorAll('[data-component="chapter-stat-chart-tab"]');
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabValue = tab.dataset.value;
        this.$model.setState({ selectedTabValue: tabValue });
        store.commit("SET_selectedTabValue", tabValue);
      });
    });
  }

  mounted() {
    this.renderChart();
  }

  renderChart() {
    const chartElement = this.$target.querySelector('[data-component="section-chapter-stat-chart"]');

    const chartOptions = this.$model.getChartOptions();

    const chart = new ApexCharts(chartElement, chartOptions);

    chart.render();
  }
}
