import { TYPE_MEMBER } from "../../../pages/class/constants";

import { getKeyByValue } from "../../utils/objects";
import { classNames } from "../../../shared/dom";
import elem from "../../utils/elem/elem";

import { Model } from "../../../shared/lib/components";
import { MtuIcon } from "../../mtu/icon/mtu-icon";
export class DrawerSideModel extends Model {
  origin = window.location.origin;
  menuItemCollection = {
    // 학년별 코스
    element: {
      text: "초등",
      on: { click: () => (window.location.href = `${this.origin}/courses/element/all`) },
      key: "element",
      color: "FFF500",
    },
    middle: {
      text: "중등",
      on: { click: () => (window.location.href = `${this.origin}/courses/middle/all`) },
      key: "middle",
      color: "F6D5EA",
    },
    high: {
      text: "고등",
      key: "high",
      on: () => (window.location.href = `${this.origin}/courses/high/all`),
      color: "F17272",
    },
    // 마이페이지
    myPage: {
      text: "마이페이지",
      key: "myPage",
      on: { click: () => (window.location.href = `${this.origin}/dashboard/`) },
      // icon: "Dashboard.svg",
      // icon: MtuIcon("dashboard"),
    },
    myClass: {
      text: "내 클래스",
      key: "myClass",
      icon: MtuIcon("academicCap"),
      on: { click: () => (window.location.href = `${this.origin}/class/`) },
    },
    dashboard: {
      text: "대시보드",
      key: "dashboard",
      on: { click: () => (window.location.href = `${this.origin}/class/`) },
      icon: MtuIcon("dashboard"),
    },
    // 문의하기
    contactUs: {
      text: "문의하기",
      key: "contactUs",
      on: { click: () => (window.location.href = `${origin}/contact/`) },
    },
    // 로그인/로그아웃/회원가입
    login: {
      text: "로그인",
      key: "login",
      on: { click: () => (window.location.href = `${origin}/user/`) },
      icon: MtuIcon("login"),
    },
    logout: {
      text: "로그아웃",
      key: "logout",
      on: { click: () => (window.location.href = `${this.origin}/user/api/logout/`) },
      type: "text",
      // icon: "Signup.svg",
      icon: MtuIcon("logout"),
    },
    signup: {
      text: "회원가입",
      key: "signup",
      on: { click: () => (window.location.href = `${this.origin}/user/`) },
      type: "text",
      // icon: "Signup.svg",
    },
  };

  constructor({ userType, userLogin = false } = {}) {
    super({ userLogin, userType });
  }

  getMenuItems() {
    const userLogin = this.getState("userLogin");
    const userType = this.getState("userType");
    const itemCollection = this._getMenuItemCollection();

    return composeMenuItems({ userLogin, userType, itemCollection });
  }

  createItemNodes(items = []) {
    const itemNodes = items
      .filter((item) => !!item.title)
      .map(({ title, child = [], key, icon, onClick, disabled = false }) => {
        const elItem = elem("li", { class: classNames({ disabled: disabled === true }) });

        isFunction(onClick) && !disabled && elItem.addEventListener("click", onClick);

        // Title
        let elTitle;

        if (child.length > 0) {
          elTitle = elem("h2", { class: "menu-title" }, title);
          elItem.append(elTitle);

          // Child
          const elChildContainer = elem("ul");
          elItem.append(elChildContainer);

          const elChildNodes = this.createItemNodes(child);
          elChildContainer.append(...elChildNodes);
        } else {
          elTitle = elem("a", title);
          elItem.append(elTitle);
        }

        // Icon
        icon && elTitle.prepend(MtuIcon(icon));

        key && this.elItemMap.set(key, elItem);

        return elItem;
      });

    return itemNodes;
  }

  // ============ internal util ============
  _getMenuItemCollection() {
    this.origin = window.location.origin;
    return this.origin ? this.menuItemCollection : [];
  }
}

/**
 * Compose Drawer Side Menu Items
 *
 * @param {object} param
 * @param {boolean} param.userLogin
 * @param {number} param.userType
 * @param {object} param.itemCollection
 * @returns {Array}
 *
 * Three type of Side Menu
 * 1. Teacher
 * * 마이페이지
 *   * 내 클래스
 * * 문의하기
 * * 로그아웃
 *
 * 2. Student
 * * 마이페이지
 *   * 대시보드
 *   * 내 클래스
 * * 문의하기
 * * 로그아웃
 *
 * 3. Annonymous
 * * 문의하기
 * * 로그인
 */
function composeMenuItems({ userLogin, userType, itemCollection }) {
  const { myPage, myClass, dashboard, contactUs, login, logout } = itemCollection;
  const userTypeString = getKeyByValue(TYPE_MEMBER, userType);

  if (!userLogin) {
    return [contactUs, login];
  }

  if (userTypeString === "TEACHER") {
    return [{ ...myPage, child: myClass }, contactUs, logout];
  }

  if (userTypeString === "STUDENT") {
    return [{ ...myPage, child: [dashboard, myClass] }, contactUs, logout];
  }
}
