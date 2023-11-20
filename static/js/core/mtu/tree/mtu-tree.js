// TODO
// Button : create child
// Button: delete child
// Or handle with context menu?
import { adjustConfig } from "../_util/adjust-config";
import { treeConfig } from "./config";
import { MtuTreeNode } from "./treeNode/mtu-tree-node";
export class MtuTree {
  constructor(config) {
    this.options = adjustConfig(treeConfig, config);
    this.registry = [];
    init();
  }

  init() {
    this.setConfig();
    this.setEvents();

    if (this.options.treeData) {
      this.render(this.options.treeData);
    }

    if (this.options.checkable) {
      this.createCheckItem();
    }

    if (this.options.className) {
      //
    }

    if (this.options.sortable) {
      //
    }
  }

  setConfig() {
    // if (this.options)
  }
  ////////////////// API //////////////////
  createTreeNode({ parent, data, parentKey, depth, index }) {
    data.forEach((node, idx) => {
      // const key = `${parentKey}-${idx}`;
      const treeNode = new MtuTreeNode(node);
      parent.appendChild(this.treeNode.elThis);

      if (node.children && Array.isArray(node.children)) {
        const childList = this.createChildList();
        treeNode.appendChild(childList);
        this.createTreeNode(childList, node.children);
      }
    });
  }

  createChildList(nodeData) {
    const childList = document.createElement("div");
    childList.classList.add("mtu-tree-child-list");
    // set sortable?
  }

  reset() {
    this.resetChildNodes(this.tree);
  }
  ////////////////// Handler //////////////////

  ////////////////// Utils //////////////////
  resetChildNodes(parentNode) {
    while (parentNode.lastElementChild) {
      parentNode.removeChild(parentNode.lastElementChild);
    }
  }
}

var treeNode = {
  title: "chapter0",
  className: "chapter",
  data: {},
  checkable: false,
  disableCheckBox: false,
  disabled: false,
  sortable: false,
  icon: null,
  key: "",
  children: [
    {
      className: "branch",
    },
  ],
};
