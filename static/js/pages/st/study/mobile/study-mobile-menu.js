import { createElement } from "../../../../core/utils/dom-utils";
import { classNames } from "../../../../core/utils/class-names";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../../core/mtu/progress/mtu-progress";
import { mtuMenu } from "../../../../core/ui/menu/mtu-menu";

require("./study-mobile-menu.css");
export class StudyMobileMenu {
  constructor() {
    this.clMenu = new mtuMenu();
    this.init();
  }

  init() {
    this.setup();
    this.create();
  }

  setup() {
    this.prefixCls = "st-mobile-menu";
    this.title = "학습하기";

    this.progressIcon = MtuIcon("book");
    this.progressLabel = "진도율";
    this.progressText = "강의";
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elInfo = this.createInfo();

    this.elThis.append(this.elInfo);
  }

  createInfo() {
    const infoNode = createElement("section", { className: `${this.prefixCls}-info` });

    // ==== header ====
    this.elInfoHeader = createElement("div", { className: `${this.prefixCls}-info-header` });
    infoNode.append(this.elInfoHeader);

    this.elInfoTextWrapper = createElement("div", { className: `${this.prefixCls}-info-text-wrapper` });
    this.elInfoHeader.append(this.elInfoTextWrapper);

    this.elTitle = createElement("p", {
      className: classNames(`${this.prefixCls}-info-text`, `${this.prefixCls}-title`),
      text: this.title,
    });

    this.elInfoHeader.append(this.elTitle);

    // TODO
    // 기한
    // ==== progress ====
    this.elInfoProgress = createElement("div", { className: `${this.prefixCls}-info-progress` });
    infoNode.append(this.elInfoProgress);

    const progressIcon = this.progressIcon;
    this.elInfoProgress.append(progressIcon);

    this.elProgressWrapper = createElement("div", { className: `${this.prefixCls}-info-progress-wrapper` });
    this.elInfoProgress.append(this.elProgressWrapper);

    this.elProgressContent = createElement("div", { className: `${this.prefixCls}-info-progress-conetent` });
    this.elProgressWrapper.append(this.elProgressContent);

    this.elProgressLabel = createElement("p", {
      className: `${this.prefixCls}-info-progress-label`,
      text: this.progressLabel,
    });
    this.elProgressContent.append(this.elProgressLabel);

    // this.clProgress = new MtuProgress({percent: this.progress})

    this.elProgressTextWrapper = createElement("div", { className: `${this.prefixCls}-info-progress-text-wrapper` });
    this.elProgressWrapper.append(this.elProgressTextWrapper);

    this.elProgressText = createElement("p", {
      className: `${this.prefixCls}-info-progress-text`,
    });
    this.elProgressText.textContent = this.progressText;
    this.elProgressTextWrapper.append(this.elProgressText);

    return infoNode;
  }

  // ============ Menu ============
  setData(data) {
    this.menuItems = this.composeMenuItems(data);

    if (this.menuItems) {
      this.clMenu.render(this.menuItems);
      this.renderMenu();
    }
  }

  renderMenu() {
    const elMenu = this.clMenu.getRootElement();

    if (this.elMenu) {
      this.elMenu.replaceWith(elMenu);
    } else {
      this.elThis.append(elMenu);
    }

    this.elMenu = elMenu;
    return;
  }

  composeMenuItems(data) {
    const items = [];
    const depth = 0;
    data.forEach((chapter) => {
      this.composeItem(chapter, items, "default", depth);
    });
    return items;
  }

  composeItem(data, parent, type, depth) {
    const item = {
      title: data.title,
      type: type ?? "default",
      data: data,
    };

    // branch
    if (depth === 1) {
      // item.onClick = this.handleContentClick.bind(this);
    }

    if (data.children) {
      const children = [];
      const size = data.children.length;
      const newDepth = depth + 1;
      for (var i = 0; i < size; i++) {
        this.composeItem(data.children[i], children, type, newDepth);
      }
      item.children = children;
    }

    parent.push(item);
  }
  // ============ API ============

  // ============ API ============

  setProgress(percent) {
    this.clProgress = new MtuProgress({ percent });
    this.elProgress = this.clProgress.getElement();

    this.elProgressContent.append(this.elProgress);

    return;
  }

  setProgressText(text) {
    this.elProgressText.textContent = text;
  }

  getElement() {
    return this.elThis;
  }
}
