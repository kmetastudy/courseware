import { createElement } from "../../../core/utils/dom-utils";
import { TYPE_USER } from "../../user/constants";
import { TYPE_MEMBER } from "../../class/constants";
import { mtmSideMenu } from "../../../core/ui/sideMenu/mtm-side-menu";
import { MtmDashboardManager } from "./mtm-dashboard-manager";
import { TeacherClassManager } from "../class/TeacherClassManager";
import { StudentClassManager } from "../class/StudentClassManager";
require("../../../../css/pages/main/dashboard/app-dashboard.css");
export class AppDashboard {
  /**usertype, userId, userLogin
   *
   * @param {Object} config
   * @property {string} config.userId
   * @property {string} config.usertype
   * @property {string} config.userLogin
   */
  constructor(config) {
    this.config = config;
    this.currentContent = null;
    this.currentSideKey = null;

    this.init();
  }

  init() {
    this.setup();

    this.create();
  }

  setup() {
    const { userType } = this.config;
    switch (userType) {
      case TYPE_USER.TEACHER:
        this.sideItems = this.createTeacherSideItems();
        break;

      default:
        this.sideItems = this.createDefaultSideItems();
        break;
    }
  }

  create() {
    this.elThis = createElement("main", { className: "app-dashboard" });

    this.clSide = new mtmSideMenu({ item: this.sideItems });
    this.elSide = this.clSide.getElement();

    this.elDashboard = createElement("div", { className: "dashboard-wrapper" });

    const { userType, userId: studentId, userLogin } = this.config;
    this.clDashboardManager = new MtmDashboardManager({ userType, studentId, userLogin });
    this.elDashboardManager = this.clDashboardManager.getElement();
    this.elDashboard.append(this.elDashboardManager);

    switch (this.config.userType) {
      case TYPE_MEMBER.TEACHER:
        this.clClassManager = new TeacherClassManager({ userId: this.config.userId });
        this.elClassManager = this.clClassManager.getElement();
        break;
      default:
        this.clClassManager = new StudentClassManager({ userId: this.config.userId });
        this.elClassManager = this.clClassManager.getElement();
        break;
    }

    // this.clTeacherClassManager = new TeacherClassManager({ userId: this.config.userId });
    // this.elTeacherClassManager = this.clTeacherClassManager.getElement();
    this.handleSideClick("dashboard");
    // this.elDashboard.append(this.elTeacherClassManager);
    this.elDashboard.append(this.elClassManager);

    this.elThis.append(this.elSide, this.elDashboard);
  }

  //
  createTeacherSideItems() {
    const sideItems = [
      { title: "대시보드", onClick: this.handleSideClick.bind(this, "dashboard") },
      { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user" },
      { title: "통계", onClick: () => (window.location.href = "../stats/"), icon: "barChart" },
      {
        title: "클래스",
        children: [{ title: "내 클래스", onClick: this.handleSideClick.bind(this, "class") }, { title: "수강전 문의" }],
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

    return sideItems;
  }

  createDefaultSideItems() {
    const sideItems = [
      { title: "대시보드" },
      { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user" },
      { title: "통계", onClick: () => (window.location.href = "../stats/"), icon: "barChart" },
      {
        title: "클래스",
        children: [{ title: "내 클래스", onClick: this.handleSideClick.bind(this, "class") }, { title: "수강전 문의" }],
      },
      {
        title: "학습 관리",
        children: [{ title: "내 학습", onClick: () => (window.location.href = "../mycourse/") }],
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

    return sideItems;
  }

  handleSideClick(key, evt) {
    if (this.currentSideKey && this.currentSideKey === key) {
      return;
    }

    this.currentContent?.classList.add("hidden");
    this.currentKey = key;

    switch (key) {
      case "dashboard":
        this.elDashboardManager.classList.remove("hidden");
        this.currentContent = this.elDashboardManager;
        break;
      case "class":
        this.elClassManager.classList.remove("hidden");
        this.currentContent = this.elClassManager;
        break;

      default:
        break;
    }
  }

  getElement() {
    return this.elThis;
  }
}
