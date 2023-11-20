// mtmSortableTree 생성자 함수
require("../../../css/core/ui/mtm-sortable-tree.css");
export class mtmSortableTree {
  constructor(element, data, options) {
    this.element = element;
    this.data = data || null;
    this.options = options || null;
    this.init();
    if (this.data) {
      this.render();
    }
  }
  // 초기화 메서드
  init() {
    // SortableJS 라이브러리를 사용하여 드래그 기능을 제공합니다.
    new Sortable(this.element, {
      group: "shared",
      animation: 150,
      draggable: ".tree-item",
    });
  }
  // ===============================================================
  // ============================ Handler ==========================
  // ===============================================================
  handleItemClick(item) {
    // let childList = item.querySelector(".child-list");
    // if (childList) {
    //   childList.classList.toggle("active");
    // }
    if (this.options && this.options.onItemClick) {
      this.options.onItemClick(item);
    }
  }
  // ===============================================================
  // ============================= API =============================
  // ===============================================================
  render(data) {
    this.reset();
    this.data = data;
    this.data.forEach((node) => {
      this.element.appendChild(this.createTreeItem(node));

      if (node.children && node.children.length > 0) {
        //
      }
    });
  }
  reset() {
    this.resetChildNodes(this.element);
  }
  resetChildNodes(parentNode) {
    while (parentNode.lastElementChild) {
      parentNode.removeChild(parentNode.lastElementChild);
    }
  }
  createTreeItem(data) {
    let item = document.createElement("div");
    item.className = "tree-item";

    // item.appendChild(this.createCheckbox());
    item.appendChild(this.createDropdownIcon());
    item.appendChild(this.createLabel(data.title));

    if (data.children && data.children.length) {
      this.addChildItems(item, data.children);
    }

    // item.addEventListener("click", this.handleItemClick.bind(this, item));
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      if (event.target.type !== "checkbox") {
        this.toggleItem(item);
      }
      this.handleItemClick(data);
    });

    return item;
  }
  createCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", (event) => {
      event.stopPropagation();
      this.checkAllChildren(event.target.parentNode, event.target.checked);
    });
    return checkbox;
  }
  createDropdownIcon() {
    let dropdownIcon = document.createElement("span");
    dropdownIcon.className = "dropdown-icon";
    return dropdownIcon;
  }
  createLabel(text) {
    let label = document.createElement("span");
    label.className = "tree-label";
    label.textContent = text;
    return label;
  }
  addChildItems(parentItem, childrenData) {
    let childList = document.createElement("div");
    childList.className = "child-list";

    new Sortable(childList, {
      animation: 150,
      draggable: ".tree-item",
      onMove: function (evt) {
        return evt.from === evt.to;
      },
    });

    childrenData.forEach((childData) => {
      childList.appendChild(this.createTreeItem(childData));
    });

    parentItem.appendChild(childList);
  }
  toggleItem(item) {
    let childList = item.querySelector(".child-list");
    if (childList) {
      childList.classList.toggle("active");
    }
  }
  checkAllChildren(item, checked) {
    let checkboxes = item.querySelectorAll('.child-list input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  }
  setSortable(element) {
    new Sortable(element, {
      group: "shared",
      animation: 150,
      // draggable: ".tree-item",
      onMove: function (evt) {
        // 드래그 대상 아이템의 부모와 드롭 타겟 아이템의 부모가 같은지 확인
        console.log(evt);
        console.log("Old Index:", evt.oldIndex);
        console.log("New Index:", evt.newIndex);
        return evt.from === evt.to;
      },
    });
  }
}

///////////////////////////// demo
let data = [
  {
    label: "Node 1",
    children: [
      {
        label: "Child 1-1",
        children: [{ label: "Grand 1-1-1" }, { label: "Grand 1-1-2" }, { label: "Grand 1-1-3" }],
      },
    ],
  },
  { label: "Node 2" },
  { label: "Node 3", children: [{ label: "Child 3-1" }] },
];

// let treeContainer = document.createElement("div");
// treeContainer.setAttribute("id", "treeContainer");
// document.body.appendChild(treeContainer);

// let tree = new mtmSortableTree(treeContainer, data);
