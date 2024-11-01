import { MtmNav } from "./mtm-nav";
export class NavManager {
  constructor(options = {}) {
    this.options = options;

    this.userName = this.options.userName ?? null;
    this.userType = this.options.userType ?? null;
    this.userLogin = this.options.userLogin ?? false;
    this.drawer = this.options.drawer ?? null;

    this.init();
  }

  init() {
    const navOptions = this.prepareNavOptions();
    const drawer = this.options.drawer;
    const options = { ...navOptions, drawer };

    this.clNav = new MtmNav(options);
  }

  prepareNavOptions() {
    const logo = { image: "/static/assets/logo_courseware_white.svg", onClick: () => (window.location.href = "/") };
    const menu = [
      { title: "초등", onClick: () => (window.location.href = "/courses/element/all"), color: "FFF500" },
      { title: "중등", onClick: () => (window.location.href = "/courses/middle/all"), color: "F6D5EA" },
      // { title: "예비고1", onClick: () => (window.location.href = "/courses/midhigh/all") },
      { title: "고등", onClick: () => (window.location.href = "/courses/high/all"), color: "F17272" },
      // { title:"기초학력", onClick: () => (window.location.href = "/namdo"), color:""}
      // { title: "수능", onClick: () => (window.location.href = "/courses/high2/all") },
    ];

    const userName = this.userName;

    let login, logout;
    if (!this.userLogin) {
      login = [
        // { text: "포인트 충전", onClick: () => (window.location.href = "/point/charge/"), icon:"Point.svg", display:"close" },
        // { text: "최근학습", onClick: () => (window.location.href = "#"), icon:"RecentStudy.svg", display:"close" },
        // { text: "장바구니", onClick: () => (window.location.href = "/cart/"), icon:"Cart.svg", display:"close" },

        { text: "문의하기", onClick: () => (window.location.href = "/contact/"), icon: "" },
        { text: "로그인", onClick: () => (window.location.href = "/user/"), icon: "Login.svg" },
        { text: "회원가입", onClick: () => (window.location.href = "/user/"), type: "text", icon: "Signup.svg" },
      ];
    } else {
      logout = [
        // { text: "포인트충전", onClick: () => (window.location.href = "/point/charge/"), icon:"Point.svg" },
        { text: "문의하기", onClick: () => (window.location.href = "/contact/"), icon: "" },
        { text: "마이페이지", onClick: () => (window.location.href = "/dashboard/"), icon: "Dashboard.svg" },
        { text: "최근학습", onClick: () => (window.location.href = "#"), icon: "RecentStudy.svg" },

        // { text: "장바구니", onClick: () => (window.location.href = "/cart/"), icon:"Cart.svg", display:"close" },

        {
          text: "로그아웃",
          onClick: () => (window.location.href = "/user/api/logout/"),
          type: "text",
          icon: "Signup.svg",
        },
      ];
    }

    // dashboard = { text: "대시보드", onClick: () => (window.location.href = "/dashboard/") };

    return {
      logo,
      menu,
      userName,
      login,
      logout,
    };
  }

  //////////// API ////////////
  getElement() {
    return this.clNav.getElement();
  }
}
