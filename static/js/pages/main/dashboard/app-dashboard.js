import { TYPE_USER } from "../../user/constants";
import { TYPE_MEMBER } from "../../class/constants";

import elem from "../../../core/utils/elem/elem";

import { mtmSideMenu } from "../../../core/ui/sideMenu/mtm-side-menu";

import { MtmDashboardManager } from "./mtm-dashboard-manager";
import { TeacherClassManager } from "../class/TeacherClassManager";
import { StudentClassManager } from "../class/StudentClassManager";
import { InactiveClassManager } from "../class/InactiveClassManager";

require("../../../../css/pages/main/dashboard/app-dashboard.css");
export class AppDashboard {
  /**userType, userId, userLogin
   *
   * @param {Object} config
   * @property {string} config.userId
   * @property {string} config.userType
   * @property {string} config.userLogin
   */
  constructor(config = {}) {
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

    this.sideItems = this.setSideItems(userType);
  }

  setSideItems(userType) {
    switch (userType) {
      case TYPE_USER.TEACHER:
        return this.createTeacherSideItems();

      default:
        return this.createDefaultSideItems();
    }
  }
  create() {
    const { userType, userId, userLogin } = this.config;

    this.elThis = elem("div", {
      class: "grid w-full relative",
      style: "grid-auto-columns: max-content auto max-content",
    });

    this.clSide = new mtmSideMenu({ item: this.sideItems });
    this.elSide = this.clSide.getElement();
    this.elSide.classList.add("col-start-1");
    this.elSide.classList.add("row-start-1");
    this.elSide.classList.add("overflow-x-hidden");

    this.elThis.append(this.elSide);

    switch (this.config.userType) {
      case TYPE_MEMBER.TEACHER:
        this.clClassManager = new TeacherClassManager({ userId });
        this.elClassManager = this.clClassManager.getElement();

        this.elThis.append(this.elClassManager);

        this.clInactiveClassManager = new InactiveClassManager({ userId });
        this.elInactiveClassManager = this.clInactiveClassManager.getElement();

        this.elThis.append(this.elInactiveClassManager);

        this.handleSideClick("class");
        break;

      default:
        this.clDashboardManager = new MtmDashboardManager({ userType, studentId: userId, userLogin });
        this.elDashboardManager = this.clDashboardManager.getElement();

        this.elThis.append(this.elDashboardManager);

        this.clClassManager = new StudentClassManager({ userId });
        this.elClassManager = this.clClassManager.getElement();

        this.elThis.append(this.elClassManager);

        this.handleSideClick("dashboard");
        break;
    }
  }

  createTeacherSideItems() {
    const sideItems = [
      {
        title: "클래스",
        child: [
          { title: "내 클래스", onClick: this.handleSideClick.bind(this, "class"), key: "class" },
          { title: "종료된 클래스", onClick: this.handleSideClick.bind(this, "inactiveClass"), key: "inactiveClass" },
        ],
      },
    ];

    return sideItems;
  }

  createDefaultSideItems() {
    const sideItems = [
      { title: "대시보드", key: "dashboard", onClick: this.handleSideClick.bind(this, "dashboard"), icon: "dashboard" },
      { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user", key: "profile", disabled: true },
      {
        title: "통계",
        onClick: () => (window.location.href = "../stats/"),
        icon: "barChart",
        key: "stats",
        disabled: true,
      },
      {
        title: "클래스",
        child: [
          { title: "내 클래스", icon: "academicCap", onClick: this.handleSideClick.bind(this, "class"), key: "class" },
        ],
      },
    ];

    return sideItems;
  }

  handleSideClick(key, evt) {
    if (!key || (this.currentSideKey && this.currentSideKey === key)) {
      return;
    }

    this.currentContent && this.currentContent.classList.add("hidden");
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
