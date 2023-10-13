import { mtoSVGBuilder } from "../../core/utils/mto-svg-builder";
import { mtoValidator } from "../utils/mto-validator";

require("../../../css/core/component/mtm-nav.css");
export const mtmNav = function (element, options = {}) {
  this.elParent = element;
  this.options = options;

  this._init();
};

mtmNav.prototype._init = function () {
  this._validate();
  this._initOptions();
  this._create();
};

mtmNav.prototype._validate = function () {
  const isDom = mtoValidator.isDom(this.elParent);
  if (isDom === false) {
    throw new Error("MtmNav Creation Error - Invalid element provided: ", this.elParent);
  }
};

mtmNav.prototype._initOptions = function () {};

mtmNav.prototype._create = function () {
  this.elThis = document.createElement("nav");
  this.elThis.classList.add("mtm-nav");
  this.elParent.appendChild(this.elThis);

  this.elLogoWrapper = document.createElement("div");
  this.elLogoWrapper.classList.add("nav-logo-wrapper");
  this.elThis.appendChild(this.elLogoWrapper);

  this.elLogo = document.createElement("div");
  this.elLogo.classList.add("nav-logo");
  this.elLogoWrapper.appendChild(this.elLogo);

  this.elTitle = document.createElement("h1");
  this.elTitle.classList.add("nav-title");
  this.elThis.appendChild(this.elTitle);

  this.elMenu = document.createElement("div");
  this.elMenu.classList.add("nav-menu");
  this.elThis.appendChild(this.elMenu);

  this.elIconWrapper = document.createElement("div");
  this.elIconWrapper.classList.add("nav-icon-wrapper");
  this.elThis.appendChild(this.elIconWrapper);
};
