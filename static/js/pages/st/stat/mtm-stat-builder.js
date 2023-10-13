import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

import { mtmStatStudyCourseTruthViewer } from "./mtm-stat-study-course-truth-viewer.js";

export var mtmStatBuilder = function (options) {
  // this.id = id;
  // this.idSelector = '#'+id;
  // this.elBuilderDiv = null;
  this.id = "id-mtm-stat-builder-" + mtmStatBuilder.id++;
  this.elThis = null;

  this.options = options;
  this._init();
};

mtmStatBuilder.id = 0;

mtmStatBuilder.staticPlayArea = [
  {
    level: 0,
    tag: "div",
    class: "container-fluid py-2 px-2",
    id: "id-stat-builder-play-area",
    attr: { style: "min-height: 600px" },
  },
  {
    level: 1,
    tag: "div",
    class: "container-fluid",
    id: "id-stat-builder-play-area-header",
    attr: { style: "display: block" },
  },
  { level: 2, tag: "div", class: "row" },
];

mtmStatBuilder.prototype._initVariables = function () {};

// 저장 버튼 enable
mtmStatBuilder.prototype._enableSave = function () {
  $("#" + this.saveBtnId).attr("disabled", false);
};

// 저장 버튼 disable
mtmStatBuilder.prototype._disableSave = function () {
  $("#" + this.saveBtnId).attr("disabled", true);
};

mtmStatBuilder.prototype._createTreeElement = function (el) {
  if (!el["tag"]) return el["text"] || "nothing";

  var element = document.createElement(el["tag"]);

  if (el["class"]) element.setAttribute("class", el["class"]);

  if (el["id"]) element.setAttribute("id", el["id"]);

  if (el["style"]) element.setAttribute("style", el["style"]);

  if (el["text"]) element.innerHTML = el["text"];

  return element;
};

mtmStatBuilder.prototype._init = function () {
  // if(this.options || (this.options && !this.options.el))
  // {
  //     var elTabs = document.createElement('div');
  //     elTabs.setAttribute('id',this.options.tabId);
  //     if(this.options.gap)
  //         elTabs.setAttribute('class',this.options.gap);

  //     var treeEle = [];
  //     var level = 0;
  //     var element = null;

  //     treeEle.push(elTabs);

  //     for(var i=0;i<this.options.els.length;i++)
  //     {
  //         element = this._createTreeElement(this.options.els[i]);
  //         level = this.options.els[i]["level"];

  //         treeEle[level].appendChild(element);

  //         treeEle[level+1] = element;

  //     }

  //     this.elThis = elTabs;
  //     this.elBuilderDiv = treeEle[1];
  //     this.elThis.appendChild(this.elBuilderDiv);
  //     console.log('mtmStatBuilder > _init : with Ouside and Inside ...');
  // }
  // else
  // {
  //     this.elBuilderDiv = document.getElementById(this.id);

  //     console.log('mtmStatBuilder > _init : with Only Inside ...');
  // }

  // var el = mtvElementBuilder.create(mtvTestumBuilder.staticPlayground);
  this.elThis = document.createElement("div");

  var el = mtvElementBuilder.create(mtmStatBuilder.staticPlayArea);
  this.elWorkArea = el.children[0].children[0];
  // this.elBuilderContainer = el;
  this.elThis.appendChild(el);

  // var scrollEl = document.getElementById('id-scheduler-build-area');

  this.clStatStudyCourseTruthViewer = new mtmStatStudyCourseTruthViewer();

  this.elWorkArea.appendChild(this.clStatStudyCourseTruthViewer.elThis);
};

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Ajax //////////////////////////////////////
mtmStatBuilder.prototype.requestCourseStat = function (index) {};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Handler ////////////////////////////////////
mtmStatBuilder.prototype.onCourseChangeHanlder = function () {
  // OnChangeStatCourse
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// API //////////////////////////////////////
