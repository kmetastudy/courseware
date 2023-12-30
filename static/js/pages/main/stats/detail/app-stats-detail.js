import { createElement } from "../../../../core/utils/dom-utils";

import { mtmSideMenu } from "../../../../core/ui/sideMenu/mtm-side-menu";
import { StatsDetailManager } from "./stats-detail-manager";

require("../../../../../css/pages/main/stats/detail/app-stats-detail.css");
export class AppStatsDetail {
  /**usertype, studentId, userLogin
   *
   * @param {Object} config
   * @property {string} config.studentId
   * @property {string} config.usertype
   * @property {string} config.userLogin
   * @property {string} config.courseId
   */
  constructor(config = {}) {
    this.config = config;

    this.init();
  }

  init() {
    this.setup();

    this.create();
  }

  setup() {
    this.sideItems = [
      { title: "대시보드", onClick: () => (window.location.href = "../../dashboard/") },
      { title: "프로필", icon: "user" },
      { title: "통계", onClick: () => (window.location.href = "../"), icon: "barChart" },
      {
        title: "학습 관리",
        children: [
          { title: "내 학습", onClick: () => (window.location.href = "../mycourse/") },
          { title: "수강전 문의" },
        ],
      },
      {
        title: "수강신청 관리",
        children: [
          { title: "수강바구니", onClick: () => (window.location.href = "../cart/") },
          { title: "좋아요" },
          { title: "쿠폰함" },
          { title: "포인트" },
          { title: "구매내역", onClick: () => (window.location.href = "../orders/") },
        ],
      },
      { title: "설정", children: [{ title: "계정 정보" }, { title: "알림 설정" }] },
    ];
  }

  create() {
    this.elThis = createElement("main", { className: "app-stats-detail" });

    this.clSide = new mtmSideMenu({ item: this.sideItems });
    this.elSide = this.clSide.getElement();

    this.elStats = createElement("div", { className: "stats-wrapper" });

    this.clStatsManager = new StatsDetailManager({ ...this.config });
    this.elStatsManager = this.clStatsManager.getElement();
    this.elStats.append(this.elStatsManager);

    // this.elThis.append(this.elSide, this.elStats);
    this.elThis.append(this.elStats);
  }

  getElement() {
    return this.elThis;
  }
}
