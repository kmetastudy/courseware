import { createElement } from "../../../../core/utils/dom-utils";
import { MtuButton } from "../../../../core/mtu/button/mtu-button";
import { dashboardHeader } from "../../dashboard/common/dashboard-header";
import { classNames } from "../../../../core/utils/class-names";

require("../../../../../css/pages/main/stats/detail/recent-chapter.css");
export class RecentChapter {
  static #CHAPTER_TYPE = 0;

  constructor({ className } = {}) {
    this.className = className ?? "stats-recent-chapter";
    // this.chapters = chapters;

    this.init();
  }

  async init() {
    this.initVariables();
    this.prepareData();
    this.render();
  }

  initVariables() {
    this.title = "최근 학습 강의";
    this.prefixCls = "recent-chapter";
    this.noDataText = "아직 수강하신 강의가 없습니다.";
  }

  async prepareData() {
    this.courseUrl = "#";
  }

  render() {
    this.elThis = createElement("div", { className: classNames(this.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();
    this.elFooter = this.createFooter();

    this.elThis.append(this.elHeader, this.elBody, this.elFooter);
  }

  createHeader() {
    const elHeader = dashboardHeader({
      className: `${this.prefixCls}-header`,
      title: {
        title: this.title,
        className: `${this.prefixCls}-title`,
      },
    });
    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });

    this.elBranchTitle = createElement("a", {
      className: `${this.prefixCls}-branch-title`,
      attributes: { href: this.courseUrl },
    });

    this.elBranchTitle.textContent = this.noDataText;

    elBody.append(this.elBranchTitle);
    return elBody;
  }

  createFooter() {
    const elFooter = createElement("div", { className: `${this.prefixCls}-footer` });

    const elWrapper = createElement("div", { className: `${this.prefixCls}-footer-button-container` });

    const studyButton = new MtuButton({
      text: "바로 학습",
      size: "large",
      onClick: () => (window.location.href = this.courseUrl),
    });
    const elStudyButton = studyButton.getElement();

    elFooter.appendChild(elWrapper);
    elWrapper.appendChild(elStudyButton);

    return elFooter;
  }

  // ============ API ============
  setData(data) {
    if (data) {
      const recentData = this.getRecentData(data);
      this.elBranchTitle.textContent = recentData?.title ? recentData.title : this.noDataText;
    }
  }

  getRecentData(data = []) {
    const dataWithDate = data.filter((data) => data.type !== RecentChapter.#CHAPTER_TYPE && data.updated_date);
    dataWithDate.forEach((data) => {
      if (data.updated_date) {
        data.updated_date = new Date(data.updated_date);
      }
    });
    dataWithDate.sort((a, b) => a.updated_date - b.updated_date);
    return dataWithDate[0];
  }

  getElement() {
    return this.elThis;
  }
}
