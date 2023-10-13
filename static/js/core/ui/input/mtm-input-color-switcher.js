require("../../../../css/core/ui/input/mtm-input-color-switcher-v2.css");
import { mtvElementBuilder } from "../../component/mtv-element-builder.js";
import { mtoCommon } from "../../component/mto-common.js";

// Create A Theme Color Switcher Using HTML CSS And Vanilla JAVASCRIPT - 8:14 / 9:13
// https://www.youtube.com/watch?v=3Qr6-WHtIRc
// document.querySelector(':root').setProperty('--main-color',dataColor);

// CSS Theme Switcher by Reverse-Engineering Alligator.io
// https://www.youtube.com/watch?v=rXuHGLzSmSE

// CSS: Circle with half one color and the other half another color?
// https://stackoverflow.com/questions/43809707/css-circle-with-half-one-color-and-the-other-half-another-color

// options = font-family , font-size , font-weight
export var mtmInputColorSwitcher = function (options) {
  this.id = "id-mtm-input-color-switcher-" + mtmInputColorSwitcher.id++;
  this.options = options;
  this.elThis = null;
  this.version = 2;

  this._init();
};

mtmInputColorSwitcher.id = 0;
mtmInputColorSwitcher.staticBody = [
  { level: 0, tag: "button", class: "mtm-input-button mtm-input-button-default", attr: { type: "button" } },
  { level: 1, tag: "i", class: "fa fa-magic" },
  { level: 1, text: " 새로 만들기" },
];

mtmInputColorSwitcher.prototype._prepare = function () {
  var text = "저장하기";
  var iClass = "fa fa-check";
  var btnClass = "mtm-input-button mtm-input-button-default";
  var id = this.id;

  if (this.options && this.options.text) text = this.options.text;

  if (this.options && this.options.iClass) iClass = this.options.iClass;

  if (this.options && this.options.btnClass) btnClass = this.options.btnClass;

  mtmInputColorSwitcher.staticBody[0]["id"] = id;
  mtmInputColorSwitcher.staticBody[0]["class"] = btnClass;
  mtmInputColorSwitcher.staticBody[1]["class"] = iClass;
  mtmInputColorSwitcher.staticBody[2]["text"] = text;
};

/* <button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button> */
mtmInputColorSwitcher.prototype._initColorV1 = function () {
  this.colors = ["#8e44ad", "#2980b9", "#f39c12", "#27ae60", "#ea2027", "#e84393", "#ff4757", "#ffc312", "#17c0eb"];

  this.lights = ["#ca61f7", "#329fe8", "#f3ae3f", "#3af889", "#ec4c52", "#e96faa", "#f77580", "#ffd864", "#5ad0ee"];

  this.deeplights = ["#db93fa", "#66b4e9", "#f4c272", "#6df5a6", "#ee7b7e", "#e795bd", "#f799a1", "#fbe08d", "#9ae1f3"];

  this.darks = ["#ca61f7", "#206492", "#b3730d", "#1b703e", "#a6181d", "#ad336e", "#b83540", "#b68c0c", "#0e7f9b"];

  this.deepdarks = ["#3b0453", "#042f4c", "#784e09", "#01481f", "#7a0307", "#680535", "#6c050d", "#7c5f05", "#046279"];

  this.themeColorIndex = localStorage.getItem("theme-color-index");
  if (!this.themeColorIndex) this.themeColorIndex = mtoCommon.defaultThemeIndex;
  else this.themeColorIndex = parseInt(this.themeColorIndex);

  this._setThemeColorV1();

  this.elColorContainer = document.createElement("div");
  this.elColorContainer.classList.add("theme-buttons-container");
  this.elDropDown.appendChild(this.elColorContainer);

  for (var i = 0; i < this.colors.length; i++) {
    var el = document.createElement("span");
    el.classList.add("theme-buttons");
    el.setAttribute("data-color", this.colors[i]);
    el.style.background = this.colors[i];
    el.addEventListener("click", this.onColorClick.bind(this));
    this.elColorContainer.appendChild(el);
  }
};

mtmInputColorSwitcher.prototype._initColorV2 = function () {
  this.colors = ["#404258", "#3E3051", "#80CED4", "#7FB77E", "#AC9AEE", "#1C1C1B", "#317758"];

  this.v2c0 = [
    "32,33,44", // theme1
    "31,24,40", // thmem2
    "64,103,106", // theme3
    "63,91,63", // theme4
    "143, 114, 248", // theme5
    "14,14,13", // theme6
    "24,59,44", // theme7
  ];

  this.v2c1 = [
    "64,66,88", // theme1
    "62,48,81", // thmem2
    "128,206,212", // theme3
    "127,183,126", // theme4
    "172,154,238", // theme5
    "28,28,27", // theme6
    "49,119,88", // theme7
  ];

  this.v2c2 = ["107,114,142", "252,209,208", "178,230,236", "177,215,180", "214,200,236", "251,183,205", "245,204,118"];

  this.v2c2 = ["107,114,142", "252,209,208", "178,230,236", "177,215,180", "214,200,236", "251,183,205", "245,204,118"];

  this.v2c3 = ["48,180,189", "111,77,58", "219,173,59", "254,192,144", "117,210,175", "206,74,26", "54,99,22"];

  this.v2c4 = ["189,190,190", "189,190,190", "189,190,190", "189,190,190", "189,190,190", "189,190,190", "189,190,190"];

  // this.v2extra = [
  //     {'color':'0,0,0',}'white'}
  // ];

  this.themeColorIndex = localStorage.getItem("theme-color-index");
  if (!this.themeColorIndex) this.themeColorIndex = mtoCommon.defaultThemeIndex;
  else this.themeColorIndex = parseInt(this.themeColorIndex);

  this._setThemeColorV2();

  this.elColorContainer = document.createElement("div");
  this.elColorContainer.classList.add("theme-buttons-container");
  this.elDropDown.appendChild(this.elColorContainer);

  for (var i = 0; i < this.colors.length; i++) {
    var el = document.createElement("span");
    el.classList.add("theme-buttons");
    el.setAttribute("data-color", this.colors[i]);
    el.style.background = this.colors[i];
    el.addEventListener("click", this.onColorClick.bind(this));
    this.elColorContainer.appendChild(el);
  }
};

mtmInputColorSwitcher.prototype._init = function () {
  this._prepare();

  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-input-color-switcher");

  this.elGearBtn = document.createElement("div");
  this.elGearBtn.classList.add("mtm-input-color-btn");
  this.elGearBtn.innerHTML = '<i class="fa-solid fa-gear"></i>';
  this.elGearBtn.addEventListener("click", this.onGearBtnClick.bind(this));

  this.elThis.appendChild(this.elGearBtn);

  this.elDropDown = document.createElement("div");
  this.elDropDown.classList.add("dropdown");
  this.elThis.appendChild(this.elDropDown);

  this.elGearTitle = document.createElement("h3");
  this.elGearTitle.innerHTML = "테마색 선택";

  this.elVersion = document.createElement("div");
  this.elVersion.innerHTML = "20230914-01";
  this.elVersion.style.fontSize = "8px";
  this.elVersion.style.textAlign = "right";

  this.elDropDown.appendChild(this.elGearTitle);
  this.elDropDown.appendChild(this.elVersion);

  if (this.version == 1) this._initColorV1();
  else if (this.version == 2) this._initColorV2();

  // this._getThemeColorV1();
  // this._getThemeColorV2();
};

mtmInputColorSwitcher.prototype._setThemeColorV1 = function () {
  document.querySelector(":root").style.setProperty("--theme-color-main", this.colors[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-light", this.lights[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-deeplight", this.deeplights[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-dark", this.darks[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-deepdark", this.deepdarks[this.themeColorIndex]);
};

mtmInputColorSwitcher.prototype._setThemeColorV2 = function () {
  document.querySelector(":root").style.setProperty("--theme-color-v2-c0", this.v2c0[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-v2-c1", this.v2c1[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-v2-c2", this.v2c2[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-v2-c3", this.v2c3[this.themeColorIndex]);
  document.querySelector(":root").style.setProperty("--theme-color-v2-c4", this.v2c4[this.themeColorIndex]);

  document
    .querySelector(":root")
    .style.setProperty("--theme-color-v2-c0-rgb", "rgb(" + this.v2c0[this.themeColorIndex] + ")");
  document
    .querySelector(":root")
    .style.setProperty("--theme-color-v2-c1-rgb", "rgb(" + this.v2c1[this.themeColorIndex] + ")");
  document
    .querySelector(":root")
    .style.setProperty("--theme-color-v2-c2-rgb", "rgb(" + this.v2c2[this.themeColorIndex] + ")");
  document
    .querySelector(":root")
    .style.setProperty("--theme-color-v2-c3-rgb", "rgb(" + this.v2c3[this.themeColorIndex] + ")");
  document
    .querySelector(":root")
    .style.setProperty("--theme-color-v2-c4-rgb", "rgb(" + this.v2c4[this.themeColorIndex] + ")");

  document.querySelector(":root").style.setProperty("--theme-color-v2-black", "0,0,0");
  document.querySelector(":root").style.setProperty("--theme-color-v2-white", "255,255,255");
  document.querySelector(":root").style.setProperty("--theme-color-v2-gray", "189,190,190");

  document.querySelector(":root").style.setProperty("--theme-color-v2-black-rgb", "rgb(0,0,0)");
  document.querySelector(":root").style.setProperty("--theme-color-v2-white-rgb", "rgb(255,255,255)");
  document.querySelector(":root").style.setProperty("--theme-color-v2-gray-rgb", "rgb(189,190,190)");
};

mtmInputColorSwitcher.prototype._getThemeColorV1 = function () {
  var colorVariant = [
    "purple",
    "deepblue",
    // 'orange','green','red','pink','deepred','yellow','skyblue',
  ];
  var colorValues = ["main", "light", "deeplight", "dark", "deepdark"];

  var colors = [
    ["#8e44ad", "#ca61f7", "#db93fa", "#5d2b72", "#3b0453"],

    ["#8e44ad", "#ca61f7", "#db93fa", "#5d2b72", "#3b0453"],
  ];

  this.themeColorV1 = [];

  for (var i = 0; i < colorVariant.length; i++) {
    var values = [];
    for (var j = 0; j < colorValues.length; j++) {
      document
        .querySelector(":root")
        .style.setProperty("--theme-v1-" + colorVariant[i] + "-color-" + colorValues[j], colors[i][j]);
      var value = document
        .querySelector(":root")
        .style.getPropertyValue("--theme-v1-" + colorVariant[i] + "-color-" + colorValues[j]);
      values.push(value);
    }

    this.themeColorV1.push({ colorVar: colorVariant[i], values: values });
  }

  console.log("mtmInputColorSwitcher > _getThemeColorV1 : ", this.themeColorV1);
};

mtmInputColorSwitcher.prototype._getThemeColorV2 = function () {
  var colorVariant = ["v2theme1", "v2theme2", "v2theme3", "v2theme4", "v2theme5", "v2theme6", "v2theme7"];
  var colorValues = ["--theme-color-v2-c1", "--themem-color-v2-c2", "--theme-color-v2-c3", "--theme-color-v2-c4"];

  this.themeColorV2 = [];

  for (var i = 0; i < colorVariant.length; i++) {
    var values = [];
    for (var j = 0; j < colorValues.length; j++) {
      value = document.querySelector(":root" + "." + colorVariant[i]).style.getProperty(colorValues[j]);
      values.push(value);
    }

    this.themeColorV1.push({ colorVar: colorVariant[i], values: values });
  }

  console.log("mtmInputColorSwitcher > _getThemeColorV2 : ", this.themeColorV2);
};

////////////////////////////////////////////////////////////////////
///////////////////////////// Handler //////////////////////////////
mtmInputColorSwitcher.prototype.onGearBtnClick = function () {
  this.elThis.classList.toggle("active");
};

mtmInputColorSwitcher.prototype.onColorClick = function (e) {
  // this.elThis.classList.toggle('active');
  var dataColor = e.target.getAttribute("data-color");
  console.log("mtmInputColorSwitcher > onColorClick : ", dataColor);
  this.elThis.classList.remove("active");
  var idx = 0;
  for (var i = 0; i < this.colors.length; i++) {
    if (this.colors[i] == dataColor) {
      this.themeColorIndex = i;
      localStorage.setItem("theme-color-index", this.themeColorIndex);
      break;
    }
  }

  if (this.version == 1) this._setThemeColorV1();
  else if (this.version == 2) this._setThemeColorV2();
};

////////////////////////////////////////////////////////////////////
/////////////////////////////// API ////////////////////////////////
mtmInputColorSwitcher.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};
