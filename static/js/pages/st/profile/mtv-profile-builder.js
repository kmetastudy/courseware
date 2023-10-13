import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";
import { mtvFileUploader } from "../../core/mtv-file-uploader.js";

export var mtvProfileBuilder = function (id, options) {
  this.id = id;
  this.idSelector = "#" + id;
  this.elBuilderDiv = null;
  this.clFileUploader = null;

  this.init();
};

mtvProfileBuilder.staticPlayground = [
  {
    level: 0,
    tag: "div",
    class: "container-fluid py-4 px-2",
    id: "single-jumbo",
    attr: { style: "min-height: 600px" },
  },
  { level: 1, comp: "mtv-file-uploader" },
];

mtvProfileBuilder.prototype._initVariables = function () {};

mtvProfileBuilder.prototype.create = function (tagList) {
  var topElement = document.createElement("div");

  // topElement.setAttribute('class','mtv-top-element');

  var componentList = [];
  var level = 0;
  var element = null;

  componentList.push(topElement);

  if (tagList) {
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i]["comp"]) {
        if (tagList[i]["comp"] == "mtv-file-uploader") {
          this.clFileUploader = new mtvFileUploader();
          element = this.clFileUploader.elThis;
          this.clFileUploader.show(false);
        }
      } else {
        element = mtvElementBuilder.createElement(tagList[i]);
      }

      level = tagList[i]["level"];

      componentList[level].appendChild(element);
      componentList[level + 1] = element;
    }
  }

  return topElement;
};

mtvProfileBuilder.prototype.onNewClass = function () {
  // console.log('mtvClassBuilder : onNewClass');
  this.clFileUploader.show(true);
};

mtvProfileBuilder.prototype.onOldClass = function () {
  this.clFileUploader.show(false);
};

mtvProfileBuilder.prototype.init = function () {
  this.elBuilderDiv = document.getElementById(this.id);

  var element = this.create(mtvProfileBuilder.staticPlayground);
  this.elBuilderDiv.appendChild(element);
};
