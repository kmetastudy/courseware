import { MtmNav } from "./mtm-nav";
export class NavManager {
  constructor(options = {}) {
    this.options = options;

    this.userName = this.options.userName ?? null;
    this.userType = this.options.userType ?? null;
    this.userLogin = this.options.userLogin ?? false;

    this.init();
  }

  init() {
    this.navOptions = this.prepareNavOptions();
    this.clNav = new MtmNav(this.navOptions);
  }

  prepareNavOptions() {
    const logo = { image: "/static/img/Course12Logo.png", onClick: () => (window.location.href = "/") };
    const menu = [
      { title: "초등", onClick: () => (window.location.href = "/courses/element/all") },
      { title: "중등", onClick: () => (window.location.href = "/courses/middle/all") },
      // { title: "예비고1", onClick: () => (window.location.href = "/courses/midhigh/all") },
      { title: "고등", onClick: () => (window.location.href = "/courses/high/all") },
      // { title: "수능", onClick: () => (window.location.href = "/courses/high2/all") },
    ];

    const userName = this.userName;

    let login, logout, searchBar, dashboard, point;
    if (!this.userLogin) {
      login = { text: "로그인", onClick: () => (window.location.href = "/user/"), type: "text" };
    } else {
      point = { text: "포인트 충전", onClick: () => (window.location.href = "/point/charge/") }
      logout = { text: "로그아웃", onClick: () => (window.location.href = "/user/api/logout/"), type: "text" };
    }

    // dashboard = { text: "대시보드", onClick: () => (window.location.href = "#") };

    return {
      logo,
      menu,
      userName,
      login,
      logout,
      point,
      dashboard,
      searchBar,
    };
  }

  //////////// API ////////////
  getElement() {
    return this.clNav.getElement();
  }
}
