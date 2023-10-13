import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";
import { mtvInputTitleText } from "../../core/input/mtv-input-title-text.js";
import { mtvInputButton } from "../../core/input/mtv-input-button.js";

export var mtvProfileContainer = function (id, options) {
  this.id = id;
  this.idSelector = "#" + id;
  this.elContainerDiv = null;

  this.init();
};

mtvProfileContainer.staticPlayground = [
  // {'level':0, 'tag':'div',},
  { level: 0, tag: "div", class: "row col-12" },
  { level: 1, comp: "mtv-id-input-field", class: "col-12 mb-2" },
  { level: 1, comp: "mtv-name-input-field", class: "col-12 mb-2" },
  { level: 1, comp: "mtv-password-input-field", class: "col-10" },
  { level: 1, comp: "mtv-password-input-button", class: "col-2" },
];

mtvProfileContainer.prototype.create = function (tagList) {
  var topElement = document.createElement("div");

  // topElement.setAttribute('class','mtv-top-element');

  var componentList = [];
  var level = 0;
  var element = null;

  componentList.push(topElement);

  if (tagList) {
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i]["comp"]) {
        if (tagList[i]["comp"] == "mtv-id-input-field") {
          var options = {};
          options.placeholder = "";
          options.title = "아이디";
          options.titleWidth = "90px";
          options.icon = "fa fa-id-card mr-2";
          options.value = "";
          options.latex = false;
          options.bReadOnly = true;

          this.clIDInput = new mtvInputTitleText(options);

          element = this.clIDInput.elThis;

          this.clIDInput.elThis.style.width = "100%";
          this.clIDInput.elThis.classList.add("mb-2");
          // this.clIDInput.readOnly(true);
        } else if (tagList[i]["comp"] == "mtv-name-input-field") {
          var options = {};
          options.placeholder = "";
          options.title = "이름";
          options.titleWidth = "90px";

          options.icon = "fa fa-user-circle mr-2";
          options.value = "";
          options.latex = false;
          options.bReadOnly = true;

          this.clNameInput = new mtvInputTitleText(options);

          element = this.clNameInput.elThis;
          this.clNameInput.elThis.style.width = "100%";
          this.clNameInput.elThis.classList.add("mb-2");
          this.clNameInput.readOnly(true);
        } else if (tagList[i]["comp"] == "mtv-password-input-field") {
          var options = {};
          options.placeholder = "새 암호를 입력 하세요";
          options.title = "새암호";
          options.titleWidth = "90px";

          options.icon = "fa fa-lock mr-2";
          options.value = "";
          options.latex = false;
          // options.list = [];

          // this.clNewPassword = mtvComponentBuilder.build(tagList[i]["comp"],options);
          this.clNewPasswordInput = new mtvInputTitleText(options);

          // console.log(this.clCourseSelector);
          element = this.clNewPasswordInput.elThis;
          // this.selectCourseId = this.clCourseSelector.id;
          this.clNewPasswordInput.elThis.style.width = "65%";
          this.clNewPasswordInput.elThis.classList.add("mb-2");
        } else if (tagList[i]["comp"] == "mtv-password-input-button") {
          var options = {};
          // options.eventHandler = this.onSimulationHandler.bind(this);

          options.text = " 바꾸기";
          options.iClass = "fa fa-check";
          this.clNewPasswordButton = new mtvInputButton(options);

          element = this.clNewPasswordButton.elThis;
          this.clNewPasswordButton.elThis.classList.add("ml-2");

          this.clNewPasswordButton.elThis.style.width = "30%";
          this.clNewPasswordButton.elThis.classList.add("mb-2");
          // console.log('element : ', element);
        }
        // else if(tagList[i]["comp"] == 'mtv-stat-testum')
        // {
        //     var options = {};
        //     console.log('mtv-stat-testum');
        //     this.clStatTestum = new mtvStatTestum(options);
        //     element = this.clStatTestum.elThis;
        // }
        // else if(tagList[i]["comp"] == 'mtv-stat-lesson')
        // {
        //     var options = {};

        // }
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

mtvProfileContainer.prototype.init = function () {
  this.elContainerDiv = document.getElementById(this.id);

  var container = this.create(mtvProfileContainer.staticPlayground);

  this.elContainerDiv.appendChild(container);
};
