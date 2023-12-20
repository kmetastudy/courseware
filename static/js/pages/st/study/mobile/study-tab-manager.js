import { createElement } from "../../../../core/utils/dom-utils";
import isHTMLNode from "../../../../core/utils/type/isHTMLNode";

require("./study-tab-manager.css");
/**
 * @param panel: HTMLNode
 * @param label: String
 */
export class StudyTabManager {
  constructor(items = []) {
    this.items = items;

    this.prefixCls = "study-tab-manager";

    this.tabNodes = [];
    this.panelNodes = [];

    this.currentTabIndex = 0;

    this.init();
  }

  init() {
    this.setup();

    this.create();
  }

  setup() {
    this.panels = this.items.map((item) => item.panel);
    this.labels = this.items.map((item) => item.label);
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elTabList = this.createTabList(this.labels);

    this.panelNodes = this.createPanels(this.panels);

    this.elThis.append(this.elTabList);

    if (this.panelNodes) {
      this.elThis.append(...this.panelNodes);
      this.activate(0);
    }
  }

  createTabList(labels) {
    const prefixCls = `${this.prefixCls}-tabList`;

    this.elTabList = createElement("div", { className: prefixCls });

    this.tabNodes = labels.map((label, idx) => this.createTab(label, idx));

    this.elTabList.append(...this.tabNodes);

    return this.elTabList;
  }

  createTab(label, index) {
    const elTab = createElement("button", {
      className: `${this.prefixCls}-tab`,
      attributes: {
        role: "tab",
        "aria-selected": false,
        tabindex: -1,
      },
    });

    const elLabelText = createElement("span", {
      className: `${this.prefixCls}-tab-title`,
      text: label,
    });

    elTab.addEventListener("click", this.handleClick.bind(this, index));

    elTab.append(elLabelText);

    return elTab;
  }

  createPanels(panels) {
    this.panelNodes = panels.map((panel, idx) => {
      return this.createPanel(panel, idx);
    });

    return this.panelNodes;
  }

  createPanel(panel, idx) {
    const elPanel = createElement("div", {
      className: `${this.prefixCls}-panel`,
      attributes: {
        role: "tabpanel",
        "aria-orientation": "horizontal",
      },
    });

    isHTMLNode(elPanel) ? elPanel.append(panel) : null;
    return elPanel;
  }

  // ============ Handler ============
  handleClick(index, evt) {
    evt?.stopPropagation();

    if (this.currentTabIndex === index) {
      return;
    }

    this.deactivate();

    this.activate(index);

    // this.currentTabIndex = index;
  }

  // ============ API ============
  deactivate() {
    const tabNode = this.tabNodes[this.currentTabIndex];
    const panelNode = this.panelNodes[this.currentTabIndex];

    tabNode.setAttribute("tabindex", -1);
    tabNode.setAttribute("aria-selected", false);
    tabNode.removeAttribute("data-active");

    panelNode.classList.remove("active");

    this.currentTabIndex = null;
  }

  activate(index) {
    const tabNode = this.tabNodes[index];
    const panelNode = this.panelNodes[index];

    tabNode.setAttribute("tabindex", 0);
    tabNode.setAttribute("aria-selected", true);
    tabNode.setAttribute("data-active", true);

    panelNode.classList.add("active");

    this.currentTabIndex = index;
  }

  getElement() {
    return this.elThis;
  }
}
