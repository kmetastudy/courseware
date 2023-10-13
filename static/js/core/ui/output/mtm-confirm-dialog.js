require("../../../../css/core/ui/output/mtm-confirm-dialog.css");

// Custom Confirm Box -> 1차 버전
// https://codepen.io/Ana_Champion/pen/JRbeEL

// CodePen Home - Confirm Box -> 2차 (animation) 버전
// https://codepen.io/General-Dev/pen/ORbOQV

// Confirmation popup for submit - 나름 깔끔
// https://codepen.io/curnsey/pen/yMPyJB

// CodePen Home - Confirm confetti button
// https://codepen.io/aaroniker/pen/bGVGNrV

// sweetalert and sweetalter2
// https://sweetalert.js.org/
// https://sweetalert2.github.io/

export var mtmConfirmDialog = function (options) {
  this.id = "id-mtm-confirm-dialog-" + mtmConfirmDialog.id++;

  this.elThis = null;
  this.options = options;

  this.elCompList = null;
  this.elsArray = [
    "elThis",
    "elDialog",
    "elHeader",
    "elTitle",
    "elClose",
    "elMessage",
    "elMsg",
    "elFooter",
    "elControl",
    "elYes",
    "elNo",
  ];
  this.elsObject = {};

  this.elMessageArea = null;
  this.elMessageItself = null;

  this._init();
};

mtmConfirmDialog.id = 0;

mtmConfirmDialog.staticBody = [
  { level: 0, tag: "div", class: "mtm-confirm-dialog-overlay" },
  { level: 1, tag: "div", class: "dialog" },
  { level: 2, tag: "div", class: "header" },
  { level: 3, tag: "div", class: "h3" },
  { level: 4, tag: "i", class: "fa fa-close" },
  { level: 2, tag: "div", class: "dialog-msg" },
  { level: 3, tag: "p", text: "" },
  { level: 2, tag: "div", class: "footer" },
  { level: 3, tag: "div", class: "controls" },
  { level: 4, tag: "button", class: "mtm-confirm-button mtm-confirm-button-danger" },
  { level: 4, tag: "button", class: "mtm-confirm-button mtm-confirm-button-default" },
];

mtmConfirmDialog.prototype._init = function () {};

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// URL ///////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Handler /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API ///////////////////////////////////////////////
