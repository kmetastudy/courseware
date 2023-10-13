import { mtvInputButton } from "../../core/input/mtv-input-button.js";
import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

export var mtvStudySubmitAction = function (options) {
  this.id = "id-mtv-study-submit-action-" + mtvStudySubmitAction.id++;
  this.options = options;
  this.elThis = null;

  if (!this.options) this.options = {};

  if (!this.options.items) this.options.items = [];

  this.init();
};

mtvStudySubmitAction.id = 0;

mtvStudySubmitAction.staticBody = [
  { level: 0, tag: "div" },
  { level: 1, tag: "hr", class: "mb-1" },
  {
    level: 1,
    tag: "div",
    class: "row d-flex justify-content-center px-1 py-1 my-0",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
];

mtvStudySubmitAction.staticAction = [{ level: 0, comp: "mtv-input-button", kind: "new" }];

mtvStudySubmitAction.prototype._createActionList = function () {
  this.clSubmitActionList = [];

  while (this.elActionArea.firstChild) this.elActionArea.removeChild(this.elActionArea.lastChild);

  for (var i = 0; i < this.options.items.length; i++) {
    var options = {};

    options.eventHandler = this.options.items[i].eventHandler;
    options.text = this.options.items[i].text;
    options.iClass = this.options.items[i].icon;
    var clSubmitAction = null;

    // 이거는 특별히 디지털 시계 또는 mtvInputButton 이 아닌거...
    if (this.options.items[i].customClass) {
      // console.log('mtvElapseTimer ....');
      clSubmitAction = this.options.items[i].customClass; // mtvComponentBuilder.build(this.options.items[i].custom,options);
    } else {
      clSubmitAction = new mtvInputButton(options);
      // 오른쪽 마진을 만든다.
      // if(i < this.options.items.length - 2)
      //     clSubmitAction.elThis.classList.add('mr-2');
      // console.log('new mtvInputButton');
      // if(i==0)    // 처음 button 이면,
      //     clSubmitAction.setMarginLeft(false,'ml-4');
    }

    if (this.options.items[i].enable) clSubmitAction.setEnable(true);
    else clSubmitAction.setEnable(false);

    this.clSubmitActionList.push(clSubmitAction);

    this.elActionArea.appendChild(clSubmitAction.elThis);
  }
};

mtvStudySubmitAction.prototype.init = function () {
  this.elThis = mtvElementBuilder.createComponent(mtvStudySubmitAction.staticBody);
  this.elThis.setAttribute("id", this.id);
  this.elActionArea = this.elThis.children[1];

  this._createActionList();
};

/////////////////////////// API ///////////////////////////////////
mtvStudySubmitAction.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtvStudySubmitAction.prototype.setEnable = function (index, bEnable) {
  if (this.clSubmitActionList.length < index + 1) return;

  var clSubmitAction = this.clSubmitActionList[index];
  clSubmitAction.setEnable(bEnable);
};

mtvStudySubmitAction.prototype.setShow = function (index, bShow, bMargin) {
  if (this.clSubmitActionList.length < index + 1) return;

  var clSubmitAction = this.clSubmitActionList[index];
  clSubmitAction.show(bShow);
  if (bMargin) clSubmitAction.elThis.classList.add("mr-2");
  else clSubmitAction.elThis.classList.remove("mr-2");
};

mtvStudySubmitAction.prototype.setShowList = function (bShowList) {
  var iShowNum = 0;
  // 일단 자체를 안보이게 한다.
  this.show(false);
  for (var i = 0; i < this.clSubmitActionList.length; i++) {
    var clSubmitAction = this.clSubmitActionList[i];

    clSubmitAction.elThis.classList.remove("ml-2");
    clSubmitAction.show(false);
    if (bShowList[i]) {
      clSubmitAction.show(true);
      // 하나라도 보이면 보이게 한다.
      this.show(true);
      if (iShowNum > 0) clSubmitAction.elThis.classList.add("ml-2");
      iShowNum++;
    }
  }
};

mtvStudySubmitAction.prototype.setSubmitItemList = function (items) {
  this.options.items = items;
  this._createActionList();
};
