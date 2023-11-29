import { MtuIcon } from "../mtu/icon/mtu-icon";
import { mtoValidator } from "../utils/mto-validator";
import { MtuInput } from "../mtu/input/mtu-input";
import { MtuButton } from "../mtu/button/mtu-button";

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
      this.options.menu.forEach((data) => {
        const menu = this.createMenu(data);
        // console.log("menu: ", menu);
        section.appendChild(menu);
        this.menuElements.push(menu);
      });
    }
    return section;
  }

  createMenu(data) {
    const menu = document.createElement("div");
    menu.classList.add("mtu-nav-menu");
    menu.textContent = data.title;
    menu.addEventListener("click", data.onClick);
    return menu;
  }

  createRightSection() {
    const section = document.createElement("div");
    section.classList.add(`mtm-nav-right-section`);

    // if (this.options.search) {
    //   this.searchBar = createSearchBar(this.options.search);
    //   section.appendChild(this.searchBar);
    // }

    if (this.options.userName) {
      this.userName = this.createUserName(this.options.userName);
      section.appendChild(this.userName);
    }

    if (this.options.login) {
      this.loginButton = this.createLogin(this.options.login);
      section.appendChild(this.loginButton);
    }

    if (this.options.logout) {
      this.logoutButton = this.createLogout(this.options.logout);
      section.appendChild(this.logoutButton);
    }

    return section;
  }

  createSearchBar() {
    //TODO
    // Create Select(Serach) component
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
