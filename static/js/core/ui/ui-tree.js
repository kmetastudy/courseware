// ref
// https://ant.design/components/uiTree
// https://ant.design/components/tree
let uiTreeIndex = 0;
export const uiTree = function (options = {}) {
  this.options = options;
  this._init();
};

uiTree.prototype._init = function () {
  this._initVariable();
  this._create();
};

uiTree.prototype._initVariable = function () {
  const defaultConfig = {
    draggable: false,
    onCheck: "",
    onSelect: "",
  };
  this.id = uiTreeIndex++;
};

uiTree.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("ui-tree");
  this.elThis.setAttribute("id", `ui-tree-${this.id}`);
};

// Handler
uiTree.prototype.handleClick = function (e) {
  console.log("e.target > ", e.target);
  e.stopPropagation();
  const childrenUl = e.target.querySelector(".tree-node");
  if (childrenUl) {
    childrenUl.classList.toggle("hidden");
  }
};

// API
uiTree.prototype.activate = function (data) {
  this.data = data;
  this.buildTree(data, this.elThis, 0);
  console.log(data);
};

uiTree.prototype.buildTree = function (treeData, parentElement, depth) {
  const currentDepth = depth + 1;
  console.log(parentElement, depth);
  const ul = document.createElement("ul");
  ul.classList.add("tree-node");

  for (let node of treeData) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="icon">${node.icon || ""}</span>${node.title}`;
    li.setAttribute("data-depth", currentDepth);
    ul.appendChild(li);
    li.addEventListener("click", this.handleClick.bind(this));

    //
    if (node.children) {
      this.buildTree(node.children, li, currentDepth);
    }
  }

  parentElement.appendChild(ul);
};

uiTree.prototype.swapMethods = function (array, index1, index2) {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};

////////////////////////////////////////////////////////////////////////////////////////////////

// data structure
const uiTreeData = [
  {
    title: "parent 1",
    key: "0-0",
    icon: "some-icon",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        icon: "some-icon",
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
            icon: "some-icon",
          },
          {
            title: "left",
            key: "0-0-0-1",
            icon: "some-icon",
          },
          {
            title: "leaf",
            key: "0-0-0-2",
            icon: "some-icon",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        icon: "some-icon",
        children: [
          {
            title: "leaf",
            key: "0-0-1-0",
            icon: "some-icon",
          },
        ],
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        icon: "some-icon",
        children: [
          {
            title: "leaf",
            key: "0-0-2-0",
            icon: "some-icon",
          },
          {
            title: "leaf",
            key: "0-0-2-1",
            icon: "some-icon",
          },
        ],
      },
    ],
  },
  {
    title: "parent 2",
    key: "0-1",
    icon: "some-icon",
    children: [
      {
        title: "parent 2-0",
        key: "0-1-0",
        icon: "some-icon",
        children: [
          {
            title: "leaf",
            key: "0-1-0-0",
            icon: "some-icon",
          },
          {
            title: "leaf",
            key: "0-1-0-1",
            icon: "some-icon",
          },
        ],
      },
    ],
  },
];

const wrapper = document.createElement("div");
wrapper.classList.add("tree-wrapper");
document.body.appendChild(wrapper);

const clTree = new uiTree();
// clTree.buildTree(uiTreeData, wrapper, 0);
wrapper.appendChild(clTree.elThis);
clTree.activate(uiTreeData);
