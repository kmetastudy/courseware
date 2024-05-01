import { MtmNav } from "./mtm-nav";
import elem from "../utils/elem/elem";
import { pick } from "../utils/objects";
export class NavManagerNew {
  /**
   * @description 현재 사용하지 않음(2024/05/01)
   * @param {object} options
   * @param {string} options.userName
   * @param {number} options.userType
   * @param {boolean} options.userLogin
   * @param {object} options.drawer
   */
  constructor({ userName, userType, userLogin = false, drawer, ...rest } = {}) {
    this.userName = userName;
    this.userType = userType;
    this.userLogin = userLogin;
    this.drawerApi = drawer;

    this.init();
  }

  init() {
    const { userName, userType, userLogin, drawerApi } = this;

    const logo = this.createLogo();

    const { leftMenuItems, rightMenuItems } = this.composeMenuItems({ userLogin });

    this.navOptions = this.createNavOptions({ userName, userType, userLogin, drawerApi });

    this.clNav = new MtmNav(this.navOptions);
  }

  composeMenuItems({ userLogin }) {
    const leftItems = [];
    const rightItems = [];

    const itemCollection = this.getMenuItemCollection();

    leftItems.push(pick(itemCollection, ["element", "middle", "high"]));

    switch (userLogin) {
      case true:
        rightItems.push(pick(itemCollection, ["contactUs", "myPage", "logout"]));
        break;
      default:
        rightItems.push(pick(itemCollection, ["contactUs", "login"]));
        break;
    }

    return { leftItems, rightItems };
  }

  getMenuItemCollection() {
    const origin = window.location.origin;
    const menuItemCollection = {
      element: {
        title: "초등",
        onClick: () => (window.location.href = `${origin}/courses/element/all`),
        color: "FFF500",
      },
      middle: {
        title: "중등",
        onClick: () => (window.location.href = `${origin}/courses/middle/all`),
        color: "F6D5EA",
      },
      high: { title: "고등", onClick: () => (window.location.href = `${origin}/courses/high/all`), color: "F17272" },
      contactUs: { text: "문의하기", onClick: () => (window.location.href = `${origin}/contact/`), icon: "" },
      myPage: {
        text: "마이페이지",
        onClick: () => (window.location.href = `${origin}/dashboard/`),
        icon: "Dashboard.svg",
      },
      login: { text: "로그인", onClick: () => (window.location.href = `${origin}/user/`), icon: "Login.svg" },
      signup: {
        text: "회원가입",
        onClick: () => (window.location.href = `${origin}/user/`),
        type: "text",
        icon: "Signup.svg",
      },
      logout: {
        text: "로그아웃",
        onClick: () => (window.location.href = "/user/api/logout/"),
        type: "text",
        icon: "Signup.svg",
      },
    };

    return menuItemCollection;
  }

  createLogo() {
    // const origin = window.location.origin;
    return elem("img", {
      src: "/static/assets/logo_courseware_white.svg",
      on: {
        click: () => (window.location.href = "/"),
      },
    });
  }

  //////////// API ////////////
  getElement() {
    return this.clNav.getElement();
  }

  // createNavOptions({ userName, userType, userLogin }) {
  //   const logo = { image: "/static/assets/logo_courseware_white.svg", onClick: () => (window.location.href = "/") };

  //   const leftMenu = [
  //     { title: "초등", onClick: () => (window.location.href = "/courses/element/all"), color: "FFF500" },
  //     { title: "중등", onClick: () => (window.location.href = "/courses/middle/all"), color: "F6D5EA" },
  //     { title: "고등", onClick: () => (window.location.href = "/courses/high/all"), color: "F17272" },
  //   ];

  //   let rightMenu;
  //   //

  //   if (!this.userLogin) {
  //     login = [
  //       // { text: "포인트 충전", onClick: () => (window.location.href = "/point/charge/"), icon:"Point.svg", display:"close" },
  //       // { text: "최근학습", onClick: () => (window.location.href = "#"), icon:"RecentStudy.svg", display:"close" },
  //       // { text: "장바구니", onClick: () => (window.location.href = "/cart/"), icon:"Cart.svg", display:"close" },
  //       { text: "문의하기", onClick: () => (window.location.href = "/contact/"), icon: "" },
  //       { text: "로그인", onClick: () => (window.location.href = "/user/"), icon: "Login.svg" },
  //       { text: "회원가입", onClick: () => (window.location.href = "/user/"), type: "text", icon: "Signup.svg" },
  //     ];
  //   } else {
  //     logout = [
  //       // { text: "포인트충전", onClick: () => (window.location.href = "/point/charge/"), icon:"Point.svg" },
  //       { text: "문의하기", onClick: () => (window.location.href = "/contact/"), icon: "" },
  //       { text: "마이페이지", onClick: () => (window.location.href = "/dashboard/"), icon: "Dashboard.svg" },
  //       { text: "최근학습", onClick: () => (window.location.href = "#"), icon: "RecentStudy.svg" },
  //       // { text: "장바구니", onClick: () => (window.location.href = "/cart/"), icon:"Cart.svg", display:"close" },

  //       {
  //         text: "로그아웃",
  //         onClick: () => (window.location.href = "/user/api/logout/"),
  //         type: "text",
  //         icon: "Signup.svg",
  //       },
  //     ];
  //   }

  //   // dashboard = { text: "대시보드", onClick: () => (window.location.href = "/dashboard/") };

  //   return {
  //     logo,
  //     menu,
  //     userName,
  //     login,
  //     logout,
  //   };
  // }
}
