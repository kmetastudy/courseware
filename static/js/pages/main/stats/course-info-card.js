import { dashboardHeader } from "../dashboard/common/dashboard-header";

export class CourseInfoCard {
  constructor(prefixCls) {
    this.prefixCls = prefixCls;
    this.className = "course-info-card";
    this.title = "코스 정보";
    this.url = "#";
    this.anchorTitle = "학습 하기";

    this.init();
  }

  init() {
    // this.setup();
    this.create();
  }

  create() {
    this.elThis = createElement("div", { className: this.className });

    this.elHeader = dashboardHeader({
      className: `${this.className}-header`,
      title: { title: this.title, className: `${this.className}-title` },
      anchor: { className: `${this.className}-anchor`, title: this.anchorTitle, url: this.url },
    });

    this.elBody = createElement("div", { className: `${this.className}-body` });

    this.elTextContainer = createElement("div", { className: `${this.className}-body-text-wrapper` });
    this.elBody.append(this.elTextContainer);

    this.elThis.append(this.elHeader, this.elBody);
  }

  setData(data) {
    if (isObject(data) === false) {
      return;
    }

    this.data = data;

    this.composeChartData(data);
    this.setChartConfig();

    this.render(this.elThis, this.chartConfig);
  }
}
