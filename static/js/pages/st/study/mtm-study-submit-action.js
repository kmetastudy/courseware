import { mtmInputButton } from "../../../core/ui/input/mtm-input-button.js";
import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";

// 1) Lesson - 이어 하기, 확인

// 제출, 오답 하기, 다음 하기 , 확인
require("../../../../css/pages/st/study/mtm-study-submit-action.css");
export var mtmStudySubmitAction = function (options) {
  this.id = "id-mtm-study-submit-action-" + mtmStudySubmitAction.id++;
  this.options = options;
  this.elThis = null;

  if (!this.options) this.options = {};

  if (!this.options.items) this.options.items = [];

  this._init();
};

mtmStudySubmitAction.id = 0;

mtmStudySubmitAction.staticBody = [
  { level: 0, tag: "div" },
  { level: 1, tag: "hr", class: "mtm-study-submit-action-hr" },
  {
    level: 1,
    tag: "div",
    class: "mtm-study-submit-action-button-container",
  },
];

mtmStudySubmitAction.staticAction = [{ level: 0, comp: "mtv-input-button", kind: "new" }];

mtmStudySubmitAction.prototype._createActionList = function () {
  this.clSubmitActionList = [];

  while (this.elActionArea.firstChild) this.elActionArea.removeChild(this.elActionArea.lastChild);

  for (var i = 0; i < this.options.items.length; i++) {
    var options = {};

    options.eventHandler = this.options.items[i].eventHandler;
    options.text = this.options.items[i].text;
    options.iClass = this.options.items[i].icon;
    options.btnClass = this.options.items[i].btnClass;
    var clSubmitAction = null;

    // 이거는 특별히 디지털 시계 또는 mtvInputButton 이 아닌거...
    if (this.options.items[i].customClass) {
      // console.log('mtvElapseTimer ....');
      clSubmitAction = this.options.items[i].customClass; // mtvComponentBuilder.build(this.options.items[i].custom,options);
    } else {
      clSubmitAction = new mtmInputButton(options);
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

mtmStudySubmitAction.prototype._init = function () {
  this.elThis = mtoElementBuilder.createComponent(mtmStudySubmitAction.staticBody);
  this.elThis.setAttribute("id", this.id);
  this.elActionArea = this.elThis.children[1];

  this._createActionList();
};

/////////////////////////// API ///////////////////////////////////
mtmStudySubmitAction.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmStudySubmitAction.prototype.setEnable = function (index, bEnable) {
  if (this.clSubmitActionList.length < index + 1) return;

  var clSubmitAction = this.clSubmitActionList[index];
  clSubmitAction.setEnable(bEnable);
};

mtmStudySubmitAction.prototype.setShow = function (index, bShow, bMargin) {
  if (this.clSubmitActionList.length < index + 1) return;

  var clSubmitAction = this.clSubmitActionList[index];
  clSubmitAction.show(bShow);
  if (bMargin) clSubmitAction.elThis.classList.add("mr-2");
  else clSubmitAction.elThis.classList.remove("mr-2");
};

mtmStudySubmitAction.prototype.setShowList = function (bShowList) {
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

mtmStudySubmitAction.prototype.setSubmitItemList = function (items) {
  this.options.items = items;
  this._createActionList();
};
