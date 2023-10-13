require("../../../../css/core/ui/navi/mtm-navi-bar-v2.css");

// CodePen Home / Responsive Navbar with pure JavaScript - 기본
// https://www.codehim.com/menu/responsive-navbar-with-vanilla-javascript/
// https://codepen.io/naieem/pen/MWYowgO

// Vanilla JavaScript/CSS & HTML Navbar
// https://github.com/stevenhughes08/vanilla-js-navbar

// Creating a Smart Navbar With Vanilla JavaScript
// https://css-tricks.com/creating-a-smart-navbar-with-vanilla-javascript/

// Let’s build a simple, responsive navigation bar with HTML CSS and a little bit of vanilla JS.
// https://medium.com/@adamwojnicki/lets-build-a-simple-responsive-navigation-bar-with-html-css-and-a-little-bit-of-vanilla-js-5abba28da32e

// Create a Responsive Navbar using Vanilla JavaScript
// https://engineertodeveloper.com/create-a-responsive-navbar-using-vanilla-javascript/

// Sticky Navigation Bar On Scroll Using Vanilla JavaScript
// https://codecary.com/sticky-navigation-bar-on-scroll-using-vanilla-javascript/

// How to create a responsive and animated navbar using vanilla HTML, CSS, and js for beginners
// https://blog.chirag.codes/how-to-create-a-responsive-and-animated-navbar-using-vanilla-html-css-and-js-for-beginners

// Header Blue
// https://epicbootstrap.com/snippets/header-blue

import { mtmInputButton } from "../input/mtm-input-button.js";
import { mtmInputColorSwitcher } from "../input/mtm-input-color-switcher.js";

export var mtmNaviBar = function (options) {
  this.id = "id-mtm-navi-bar-" + mtmNaviBar.id++;
  this.options = options;
  this.elThis = null;

  this._init();
};

mtmNaviBar.id = 0;

mtmNaviBar.prototype._setLogo = function () {
  if (document.documentElement.clientWidth < 450) {
    if (this.elLogo) {
      this.elLogo.innerHTML = "M";
    }
  } else {
    if (this.elLogo) {
      this.elLogo.innerHTML = "MEGA-COURSE";
    }
  }
};

mtmNaviBar.prototype._initEvents = function () {
  this.elMenuToggler.addEventListener("click", this.onTogglerClickHandler.bind(this));
  window.addEventListener("resize", this.resizeWindowHandler.bind(this));
};

mtmNaviBar.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-navi-bar");
  if (this.options && this.options.classList) this.elThis.classList.add(this.options.classList);

  this.elContainerDiv = document.createElement("div");
  this.elContainerDiv.classList.add("container");

  this.elNavContainerDiv = document.createElement("div");
  this.elNavContainerDiv.classList.add("navbar-container");

  this.elThis.appendChild(this.elContainerDiv);

  this.elContainerDiv.appendChild(this.elNavContainerDiv);

  this.elLogo = null;
  // Logo
  if (this.options && this.options.logo) {
    this.elLogo = document.createElement("a");
    this.elLogo.classList.add("navbar-logo");
    this.elLogo.setAttribute("href", "/");
    this.elLogo.innerHTML = this.options.logo;
    this.elNavContainerDiv.appendChild(this.elLogo);
  }

  // Main Menu
  this.elMenuDiv = document.createElement("ul");
  this.elMenuDiv.classList.add("main-bar", "m-auto");
  this.elNavContainerDiv.appendChild(this.elMenuDiv);

  // Menu Short Cut
  this.elMenuShortCut = document.createElement("ul");
  this.elMenuShortCut.classList.add("nav-shortcut");
  this.elNavContainerDiv.appendChild(this.elMenuShortCut);

  this.elLogInName = document.createElement("li");
  this.elLogInName.classList.add("nav-login-name", "m-auto");
  // this.elLogInName.style.color = 'white';
  // this.elLogInName.style.fontSize = '12px';

  // Login User Display
  if (this.options && this.options.context) {
    if (this.options.context.userType & 1)
      // admin
      this.elLogInName.innerHTML = '<i class="fa-solid fa-user-shield"></i>';
    else if (this.options.context.userType == 2)
      // operator
      this.elLogInName.innerHTML = '<i class="fa-solid fa-user-gear"></i>';
    else if (this.options.context.userType == 4)
      // content producer
      this.elLogInName.innerHTML = '<i class="fa-solid fa-user-pen"></i>';
    else if (this.options.context.userType == 8)
      // teacher
      this.elLogInName.innerHTML = '<i class="fa-solid fa-user-tie"></i>';
    else if (this.options.context.userType == 16)
      // student
      this.elLogInName.innerHTML = '<i class="fa-solid fa-user-graduate"></i>';

    if (this.options && this.options.context && this.options.context.userName)
      this.elLogInName.innerHTML += " " + this.options.context.userName;
  }

  if (this.options && this.options.context && !this.options.context.userLogin) this.elLogInName.style.display = "none";

  this.elMenuShortCut.appendChild(this.elLogInName);

  var btnLogInOptions = {};
  btnLogInOptions.text = "로그인";
  btnLogInOptions.iClass = " ";
  btnLogInOptions.btnClass = "mtm-input-button mtm-input-button-theme";
  btnLogInOptions.eventHandler = this.options.eventLogin;

  this.clLogIn = new mtmInputButton(btnLogInOptions);
  this.clLogIn.elThis.style.fontSize = "12px";
  this.elMenuShortCut.appendChild(this.clLogIn.elThis);

  // console.log(this.options);

  if (this.options && this.options.context && this.options.context.userLogin) this.clLogIn.show(false);

  var btnLogOutOptions = {};
  if (this.options && this.options.context && this.options.context.demo) btnLogOutOptions.text = "체험종료";
  else btnLogOutOptions.text = "로그아웃";

  btnLogOutOptions.iClass = " ";
  btnLogOutOptions.btnClass = "mtm-input-button mtm-input-button-theme";
  if (this.options && this.options.eventLogout) btnLogOutOptions.eventHandler = this.options.eventLogout;
  else btnLogOutOptions.eventHandler = this.onLogoutHandler.bind(this);

  this.clLogOut = new mtmInputButton(btnLogOutOptions);
  this.clLogOut.elThis.style.fontSize = "12px";
  this.elMenuShortCut.appendChild(this.clLogOut.elThis);
  if (this.options && this.options.context && !this.options.context.userLogin) this.clLogOut.show(false);

  this.clThemeColor = new mtmInputColorSwitcher();
  this.elMenuShortCut.appendChild(this.clThemeColor.elThis);

  this.elMenuToggler = document.createElement("button");
  this.elMenuToggler.classList.add("nav-toggler");
  var el = document.createElement("span");
  this.elMenuToggler.appendChild(el);

  this.elNavContainerDiv.appendChild(this.elMenuToggler);

  // this.elMenu
  if (this.options && this.options.menuItems) {
    for (var i = 0; i < this.options.menuItems.length; i++) {
      var itemLi = document.createElement("li");
      var itemA = document.createElement("a");
      itemA.setAttribute("href", this.options.menuItems[i].url);
      itemA.innerHTML = this.options.menuItems[i].title;
      itemLi.appendChild(itemA);
      this.elMenuDiv.appendChild(itemLi);
    }
  }

  this._initEvents();
  this._setLogo();
};

//////////////////////////////////////////////////////////////////////////
/////////////////////////////// Handler //////////////////////////////////
mtmNaviBar.prototype.resizeWindowHandler = function () {
  // this._arrangePanelLayout();
  this._setLogo();
};

mtmNaviBar.prototype.onLogoutHandler = function () {
  // Demo Mode ...
  // if(this.options && this.options.context && this.options.context.demo)
  //     return;

  $.ajax({
    headers: { "X-CSRFToken": csrftoken },
    type: "POST",
    async: false,
    // Todo. Jstar : jstar
    // url:'/logoutcheck/',
    // url:'/ml/logoutcheck/',
    url: "/ml/logoutcheck/",
    // data : JSON.stringify(argIn) ,
    dataType: "json",
    success: function (argOut) {
      // if(fnSuccess)
      //     fnSuccess(argSuccess,argOut);
      window.location.href = "/ml/";
    }, //end success
  }); // end of ajax
};

mtmNaviBar.prototype.onTogglerClickHandler = function () {
  this.elMenuToggler.classList.toggle("toggler-open");
  this.elMenuDiv.classList.toggle("open");
  if (this.elMenuDiv.classList.contains("open")) {
    // console.log('onTogglerClickHandler : ',this.elMenuDiv.style.top, this.elThis.clientHeight);
    this.elMenuDiv.style.top = this.elThis.clientHeight + "px";
  }
};
