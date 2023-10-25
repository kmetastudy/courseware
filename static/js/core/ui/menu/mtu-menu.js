// ref
// https://ant.design/components/menu
// datastructure
// const items = [
//   getItem('Navigation One', 'sub1', `<MailOutlined />`, [
//     getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
//     getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
//   ]),
//   getItem('Navigation Two', 'sub2', `<AppstoreOutlined />`, [
//     getItem('Option 5', '5'),
//     getItem('Option 6', '6'),
//     getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
//   ]),
//   {
//     type: 'divider',
//   },
//   getItem('Navigation Three', 'sub4', `<SettingOutlined />`, [
//     getItem('Option 9', '9'),
//     getItem('Option 10', '10'),
//     getItem('Option 11', '11'),
//     getItem('Option 12', '12'),
//   ]),
//   getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
// ];
require("../../../../css/core/ui/menu/mtu-menu.css");
export const mtuMenu = function (option = {}) {
  this.options = option;
  this._init();
};

mtuMenu.prototype._init = function () {
  if (this.options.items) {
    this.render(this.options.items);
  }
};

mtuMenu.prototype.getRootElement = function () {
  return this.elThis;
};
///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// HANDLER ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
mtuMenu.prototype.handleSubMenuClick = function (menuSub, event) {
  // show child
  event.stopPropagation();
  console.log(menuSub, event.target);
  if (menuSub) {
    menuSub.classList.toggle("mtu-menu-hidden");
  }
};
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// API //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
mtuMenu.prototype.render = function (items) {
  this.elThis = document.createElement("ul");
  this.elThis.classList.add("mtu-menu");
  this.elThis.classList.add("mtu-menu-root");
  this.elThis.setAttribute("role", "menu");

  const itemSize = items.length;
  const depth = 0;

  this.items = items;
  for (let index = 0; index < itemSize; index++) {
    this.elThis.appendChild(this.createItem(items[index], index, depth));
  }
};

mtuMenu.prototype.setDefaultItem = function (item) {
  const defaultItem = {
    key: null,
    icon: null,
    children: [],
    title: "menu",
    type: null,
  };

  const validateMap = {
    key: this.validateKey.bind(this),
    icon: this.validateKey.bind(this),
    kchildreney: this.validateKey.bind(this),
    title: this.validateKey.bind(this),
    type: this.validateKey.bind(this),
  };

  for (const [key, defaultValue] of Object.entries(defaultItem)) {
    if (item[key] === null || item[key] === undefined) {
      item[key] = defaultValue;
    } else {
      if (validateMap[key] === false) {
        throw new Error(`Invalid Item: 
        item: ${item},
        key: ${key},
        value: ${item[key]}`);
      }
    }
  }
  return item;
};

mtuMenu.prototype.createItem = function (item, index, depth) {
  // type에 따라 로직이 나뉨
  this.typeMapper = {
    default: this.createDefault.bind(this),
    group: this.createGroup.bind(this),
    divider: this.createDivider.bind(this),
  };

  return this.typeMapper[item.type](item, index, depth);
};

mtuMenu.prototype.createDefault = function (item, index, depth) {
  this.elThis.classList.add("mtu-menu-inline");

  const subMenu = document.createElement("li");

  subMenu.classList.add("mtu-menu-inline");
  subMenu.setAttribute("role", "none");

  // 0 0
  // 1 48 24*2
  // 2 72 24*3
  // 3 96 24*4

  item.element = subMenu;

  if (item.key) {
    subMenu.setAttribute("id", item.key);
  }

  if (typeof item.onClick === "function") {
    subMenu.addEventListener("click", function (event) {
      event.stopPropagation();
      item.onClick(item);
    });
  }

  if (item.children && item.children.length > 0) {
    subMenu.classList.add("mtu-submenu");

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("mtu-menu-submenu-title");
    titleContainer.setAttribute("aria-haspopup", "true");
    titleContainer.setAttribute("style", `padding-left: ${this.setIndent(depth)}px`);
    titleContainer.setAttribute("role", "menuitem");
    subMenu.appendChild(titleContainer);

    if (item.icon) {
      titleContainer.appendChild(this.createIcon(item.icon));
    }

    titleContainer.appendChild(this.createTitle(item.title));

    const menuSub = document.createElement("ul");
    menuSub.classList.add("mtu-menu");
    menuSub.classList.add("mtu-menu-sub");
    menuSub.classList.add("mtu-menu-hidden");
    menuSub.setAttribute("role", "menu");

    subMenu.appendChild(menuSub);
    subMenu.addEventListener("click", this.handleSubMenuClick.bind(this, menuSub));

    const childrenSisze = item.children.length;
    const nextDepth = depth + 1;
    for (var i = 0; i < childrenSisze; i++) {
      menuSub.appendChild(this.createItem(item.children[i], i, nextDepth));
    }
    return subMenu;
  }
  // if no children -> menu-item
  subMenu.classList.add("mtu-menu-item");
  subMenu.setAttribute("style", `padding-left: ${this.setIndent(depth)}px`);
  if (item.icon) {
    subMenu.appendChild(this.createIcon(item.icon));
  }

  subMenu.appendChild(this.createTitle(item.title));

  return subMenu;
};

mtuMenu.prototype.setIndent = function (depth) {
  return 24 * (depth + 1);
};

mtuMenu.prototype.createContainer = function (role) {
  const container = document.createElement("div");
  container.classList.add("mtu-menu-submenu-title");
  container.setAttribute("role", role);
  return container;
};

mtuMenu.prototype.createTitle = function (titleContent) {
  const title = document.createElement("span");
  title.classList.add("mtu-menu-title-content");
  title.textContent = titleContent;
  return title;
};

mtuMenu.prototype.createIcon = function (icon) {
  //
  return;
};
////////////////////
////////////////////
// TODO;
// 아래는 다양한 기능 추가
mtuMenu.prototype.createGroup = function (item, index) {
  const subMenu = document.createElement("li");
  subMenu.classList.add("mtu-submenu");

  const group = document.createElement("div");
  group.setAttribute("role", "presentation");
};
/**
 * separator
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/separator_role
 * @param {*} parent
 */
mtuMenu.prototype.createDivider = function () {
  const divider = document.createElement("li");
  divider.setAttribute("role", "separator");
  divider.classList.add("mtu-menu-divider");

  return divider;
};

// {key,icon,children,label,type}

// ul(menu menu-root) -> root
//  li(menu-submenu)->  submenu& seperator -> 그룹이라 생각하면 편함
//    div (role: menuitems) -> 각 아이템(1개)
//      span img
//      span menu-title-content
//      i icon
//    ul(menu menu-sub)
//      li

// 기본적인 틀
// ul, li, div
// item(Li) 안에 제목만 있는 경우 li > span
// 그게 아닌 경우, li > (div>span)&(ul)(다음 그룹)

// type: group
// type이 group인 경우, 쉽게 말해 항상 펼쳐져있다 생각해도 된다.
//
