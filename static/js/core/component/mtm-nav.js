import { MtuIcon } from "../mtu/icon/mtu-icon";
import { MtuInput } from "../mtu/input/mtu-input";
import { MtuButton } from "../mtu/button/mtu-button";
import { MtuExpandingButton } from "../mtu/button/mtu-expanding-button";
import { MtuHamburgerMenu } from "../mtu/menu/mtu-hamburger-menu";

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
    // menu.classList.add(`mtu-nav-menu${i}`);
    // menu.textContent = data.title;
    // menu.addEventListener("click", data.onClick);

    // var menu2 = $(`<object type="image/svg+xml" data="Star1.svg></object>"`)
    // var menu2 = $(`<svg class="star${i+1}" width="48" height="48" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M9.41164 11.747C7.48836 2.6987 18.2673 -3.52453 25.1418 2.66525V2.66525C28.2161 5.43341 32.7233 5.90713 36.306 3.83866V3.83866C44.3171 -0.786584 53.5666 7.54172 49.8041 15.9925V15.9925C48.1215 19.7717 49.0637 24.2047 52.1381 26.9728V26.9728C59.0125 33.1626 53.9501 44.533 44.7503 43.5661V43.5661C40.636 43.1337 36.7112 45.3997 35.0285 49.1789V49.1789C31.266 57.6297 18.8878 56.3287 16.9645 47.2803V47.2803C16.1044 43.2338 12.7364 40.2013 8.62216 39.7689V39.7689C-0.577656 38.8019 -3.16542 26.6275 4.84574 22.0022V22.0022C8.42844 19.9338 10.2718 15.7936 9.41164 11.747V11.747Z" fill="#${data.color}"/>
    //                 <text x="14" y="32" fill="black" font-size="16">${data.title}</text>
    //             </svg>`)
    if(i != 3){
      const menu3 = $(`<svg class="star${i+1}" width="72" height="36" viewBox="6 6 78 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="8" width="72" height="32" rx="10" fill="#${data.color}"/>
                    <g filter="url(#filter0_d_157_27)">
                    <path d="M19.3529 20.4368C18.8721 18.1747 21.5668 16.6189 23.2854 18.1663C24.054 18.8584 25.1808 18.9768 26.0765 18.4597C28.0793 17.3034 30.3917 19.3854 29.451 21.4981C29.0304 22.4429 29.2659 23.5512 30.0345 24.2432C31.7531 25.7907 30.4875 28.6333 28.1876 28.3915C27.159 28.2834 26.1778 28.8499 25.7571 29.7947C24.8165 31.9074 21.7219 31.5822 21.2411 29.3201C21.0261 28.3084 20.1841 27.5503 19.1555 27.4422C16.8556 27.2005 16.2086 24.1569 18.2114 23.0006C19.1071 22.4834 19.5679 21.4484 19.3529 20.4368Z" fill="#059669"/>
                    </g>
                    <path d="M17.7831 18.7075C17.2107 16.0144 20.4189 14.1621 22.465 16.0044C23.702 17.1182 25.5155 17.3088 26.9571 16.4765C29.3415 15.0999 32.0945 17.5787 30.9747 20.094C30.2976 21.6146 30.6768 23.3983 31.9138 24.5121C33.9599 26.3544 32.4531 29.7387 29.7149 29.4509C28.0594 29.2769 26.4802 30.1886 25.8032 31.7093C24.6833 34.2245 20.9991 33.8373 20.4266 31.1442C20.0806 29.516 18.7254 28.2958 17.07 28.1218C14.3318 27.834 13.5616 24.2104 15.946 22.8338C17.3875 22.0015 18.1292 20.3357 17.7831 18.7075Z" stroke="white"/>
                    <defs>
                    <filter id="filter0_d_157_27" x="13.0156" y="17.5439" width="21.8164" height="21.6675" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_157_27"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_157_27" result="shape"/>
                    </filter>
                    </defs>
                    <text x="40" y="30" fill="black" font-size="16">${data.title}</text>
                  </svg>`)
      menu3[0].addEventListener("click", data.onClick); 
      // console.log(menu,menu2[0])
      return menu3[0];
    } else {
      const menu3 = $(`<button class="mx-2 px-2 text-white text-[16px]">${data.title}</button>`)
      menu3[0].addEventListener("click", data.onClick); 
      // console.log(menu,menu2[0])
      return menu3[0];
    }
    
  } 

  createRightSection() {
    const section = document.createElement("div");
    section.classList.add(`mtm-nav-right-section`);

    if (this.options.login) {
      const clMenuButton = new MtuExpandingButton(this.options.login)
      const clMenuList = new MtuHamburgerMenu(this.options.login)
      section.appendChild(clMenuButton.elThis[0])
      section.appendChild(clMenuList.elThis)
    }

    if (this.options.logout) {
      const clMenuButton = new MtuExpandingButton(this.options.logout)
      const clMenuList = new MtuHamburgerMenu(this.options.logout)
      section.appendChild(clMenuButton.elThis[0])
      section.appendChild(clMenuList.elThis)
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
