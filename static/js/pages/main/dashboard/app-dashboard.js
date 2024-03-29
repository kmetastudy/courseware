import { createElement } from "../../../core/utils/dom-utils";
import { TYPE_USER } from "../../user/constants";
import { TYPE_MEMBER } from "../../class/constants";
import { mtmSideMenu } from "../../../core/ui/sideMenu/mtm-side-menu";
import { MtmDashboardManager } from "./mtm-dashboard-manager";
import { TeacherClassManager } from "../class/TeacherClassManager";
import { StudentClassManager } from "../class/StudentClassManager";
import { InactiveClassManager } from "../class/InactiveClassManager";
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

    this.elBody = createElement("div", { className: "dashboard-wrapper" });

    const { userType, userId: studentId, userLogin } = this.config;

    switch (this.config.userType) {
      case TYPE_MEMBER.TEACHER:
        this.clClassManager = new TeacherClassManager({ userId: this.config.userId });
        this.elClassManager = this.clClassManager.getElement();
        this.elBody.append(this.elClassManager);

        this.clInactiveClassManager = new InactiveClassManager({ userId: this.config.userId });
        this.elInactiveClassManager = this.clInactiveClassManager.getElement();
        this.elBody.append(this.elInactiveClassManager);

        this.handleSideClick("class");
        break;
      default:
        this.clDashboardManager = new MtmDashboardManager({ userType, studentId, userLogin });
        this.elDashboardManager = this.clDashboardManager.getElement();
        this.elBody.append(this.elDashboardManager);

        this.clClassManager = new StudentClassManager({ userId: this.config.userId });
        this.elClassManager = this.clClassManager.getElement();
        this.elBody.append(this.elClassManager);

        this.handleSideClick("dashboard");
        break;
    }

    this.elThis.append(this.elSide, this.elBody);
  }

  createTeacherSideItems() {
    const sideItems = [
      {
        title: "클래스",
        children: [
          { title: "내 클래스", onClick: this.handleSideClick.bind(this, "class"), key: "class" },
          { title: "종료된 클래스", onClick: this.handleSideClick.bind(this, "inactiveClass"), key: "inactiveClass" },
        ],
      },
      // { title: "설정", children: [{ title: "계정 정보" }, { title: "알림 설정" }] },
    ];

    return sideItems;
  }

  createDefaultSideItems() {
    const sideItems = [
      { title: "대시보드", key: "dashboard" },
      { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user", key: "profile" },
      { title: "통계", onClick: () => (window.location.href = "../stats/"), icon: "barChart", key: "stats" },
      {
        title: "클래스",
        children: [{ title: "내 클래스", onClick: this.handleSideClick.bind(this, "class"), key: "class" }],
      },
      {
        title: "학습 관리",
        children: [{ title: "내 학습", onClick: () => (window.location.href = "../mycourse/"), key: "mycourse" }],
      },
      {
        title: "수강신청 관리",
        children: [
          { title: "수강바구니", onClick: () => (window.location.href = "../cart/"), key: "cart" },
          { title: "구매내역", onClick: () => (window.location.href = "../orders/"), key: "orders" },
        ],
      },
      {
        title: "설정",
        children: [
          { title: "계정 정보", key: "accountSetting" },
          { title: "알림 설정", key: "notificationSetting" },
        ],
      },
    ];

    return sideItems;
  }

  handleSideClick(key, evt) {
    if (!key || (this.currentSideKey && this.currentSideKey === key)) {
      return;
    }

    this.currentContent?.classList.add("hidden");
    this.currentKey = key;

    switch (key) {
      case "dashboard":
        this.elDashboardManager?.classList.remove("hidden");
        this.currentContent = this?.elDashboardManager;
        break;
      case "class":
        this.elClassManager.classList.remove("hidden");
        this.currentContent = this.elClassManager;
        break;
      case "inactiveClass":
        this.elInactiveClassManager?.classList.remove("hidden");
        this.currentContent = this?.elInactiveClassManager;
        break;
      default:
        break;
    }

    this.clSide.activate(key);
  }

  getElement() {
    return this.elThis;
  }
}
