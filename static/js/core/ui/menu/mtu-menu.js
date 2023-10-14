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
  this.render();
};

mtuMenu.prototype.render = function () {
  if (!this.options.items) {
    console.error("No items");
  }

  this.elThis = document.createElement("ul");
  this.elThis.classList.add("mtu-menu-root");

  const items = this.option.items;
  const itemSize = items.length;
  const depth = 0;

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
  const subMenu = document.createElement("li");
  subMenu.classList.add("mtu-submenu");
  subMenu.setAttribute("role", "none");

  if (item.key) {
    subMenu.setAttribute("id", item.key);
  }

  if (!item.icon && !item.children) {
    subMenu.appendChild(this.createTitle(item.title));
    return subMenu;
  }

  const container = this.createContainer("menuitem");

  if (item.icon) {
    container.appendChild(this.createIcon(item.icon));
  }

  const childrenSize = item?.children.length;
  if (item.children && childrenSize > 0) {
    container.appendChild(this.createChildren());
  }

  return subMenu;
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
