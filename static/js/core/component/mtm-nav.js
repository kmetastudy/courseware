import { MtuIcon } from "../mtu/icon/mtu-icon";
import { MtuInput } from "../mtu/input/mtu-input";
import { MtuButton } from "../mtu/button/mtu-button";
import { MtuExpandingButton } from "../mtu/button/mtu-expanding-button";

require("../../../css/core/component/mtm-nav.css");
export class MtmNav {
  constructor(options = {}) {
    console.log(options);
    this.options = options;
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.nav = document.createElement("div");
    this.nav.classList.add("mtm-nav");

    // header
    this.header = document.createElement("div");
    this.header.classList.add("mtm-nav-header");
    this.logo = this.createLogo(this.options.logo);

    this.header.appendChild(this.logo);

    // body
    this.body = document.createElement("div");
    this.body.classList.add("mtm-nav-body");
    this.leftSection = this.createLeftSection();
    this.rightSection = this.createRightSection();

    this.body.appendChild(this.leftSection);
    this.body.appendChild(this.rightSection);

    //
    this.nav.appendChild(this.header);
    this.nav.appendChild(this.body);
  }

  createLogo(config) {
    const logo = document.createElement("div");
    logo.classList.add("mtm-nav-logo");
    if (config.onClick) {
      logo.addEventListener("click", config.onClick);
    }

    const logoImage = document.createElement("img");
    logoImage.classList.add("mtm-nav-logo-image");
    logoImage.setAttribute("src", config.image);
    logo.appendChild(logoImage);

    return logo;
  }

  createLeftSection() {
    const section = document.createElement("div");
    section.classList.add(`mtm-nav-left-section`);

    if (this.options.menu) {
      this.menuElements = [];
      this.options.menu.forEach((data, index) => {
        const menu = this.createMenu(data, index);
        // console.log("menu: ", menu);
        section.appendChild(menu);
        this.menuElements.push(menu);
      });
    }
    return section;
  }

  createMenu(data, i) {
    // const menu = document.createElement("div");
    // menu.classList.add("mtu-nav-menu");
    // menu.textContent = data.title;
    // menu.addEventListener("click", data.onClick);

    // var menu2 = $(`<object type="image/svg+xml" data="Star1.svg></object>"`)
    var menu2 = $(`<svg class="star${i+1}" width="48" height="48" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.41164 11.747C7.48836 2.6987 18.2673 -3.52453 25.1418 2.66525V2.66525C28.2161 5.43341 32.7233 5.90713 36.306 3.83866V3.83866C44.3171 -0.786584 53.5666 7.54172 49.8041 15.9925V15.9925C48.1215 19.7717 49.0637 24.2047 52.1381 26.9728V26.9728C59.0125 33.1626 53.9501 44.533 44.7503 43.5661V43.5661C40.636 43.1337 36.7112 45.3997 35.0285 49.1789V49.1789C31.266 57.6297 18.8878 56.3287 16.9645 47.2803V47.2803C16.1044 43.2338 12.7364 40.2013 8.62216 39.7689V39.7689C-0.577656 38.8019 -3.16542 26.6275 4.84574 22.0022V22.0022C8.42844 19.9338 10.2718 15.7936 9.41164 11.747V11.747Z" fill="#${data.color}"/>
                    <text x="14" y="32" fill="black" font-size="16">${data.title}</text>
                </svg>`)
    menu2[0].addEventListener("click", data.onClick); 
    // console.log(menu,menu2[0])
    return menu2[0];
  } 

  createRightSection() {
    const section = document.createElement("div");
    section.classList.add(`mtm-nav-right-section`);

    if (this.options.login) {
      var clButton = new MtuExpandingButton(this.options.login)
      section.appendChild(clButton.elThis[0])
    }

    if (this.options.logout) {
      var clButton = new MtuExpandingButton(this.options.logout)
      section.appendChild(clButton.elThis[0])
    }

    // if (this.options.search) {
    //   this.searchBar = createSearchBar(this.options.search);
    //   this.searchBar ? section.appendChild(this.searchBar) : null;
    // }

    // if (this.options.dashboard) {
    //   this.dashboard = this.createDashboardButton(this.options.dashboard);
    //   section.appendChild(this.dashboard);
    // }

    // if (this.options.point) {
    //   this.point = this.createPointButton(this.options.point);
    //   section.appendChild(this.point);
    // }

    // if (this.options.userName) {
    //   this.userName = this.createUserName(this.options.userName);
    //   section.appendChild(this.userName);
    // }

    // if (this.options.login) {
    //   this.loginButton = this.createLogin(this.options.login);
    //   section.appendChild(this.loginButton);
    // }

    // if (this.options.logout) {
    //   this.logoutButton = this.createLogout(this.options.logout);
    //   section.appendChild(this.logoutButton);
    // }

    return section;
  }

  createSearchBar() {
    //TODO
    // Create Select(Serach) component
    return;
  }

  createDashboardButton(config) {
    config.className = "mtm-nav-dashboard-button";
    const clDashboard = new MtuButton(config);
    const dashboard = clDashboard.getElement();
    return dashboard;
  }

  createPointButton(config) {
    config.className = "mtm-nav-point-button";
    const clPoint = new MtuButton(config);
    const point = clPoint.getElement();
    return point;
  }

  createUserName(name) {
    const userName = document.createElement("div");
    userName.classList.add("mtm-nav-user-name");
    userName.textContent = name;
    return userName;
  }

  createLogin(config) {
    config.className = "mtm-nav-login-button";
    const clLogin = new MtuButton(config);
    const login = clLogin.getElement();
    return login;
  }

  createLogout(config) {
    config.className = "mtm-nav-logout-button";
    const clLogout = new MtuButton(config);
    const logout = clLogout.getElement();
    return logout;
  }

  //////////// API ////////////
  getElement() {
    return this.nav;
  }
}
