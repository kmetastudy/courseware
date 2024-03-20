import elem from "../../utils/elem/elem";
import { omit } from "../../utils/objects";
import { computePosition, flip, shift, offset, arrow, autoUpdate } from "../FloatingUI";
import { MtuIcon } from "../../mtu/icon/mtu-icon";

export class UserProfileMenu {
  constructor({ triggerElemet, userId, userName, userType }) {
    this.elTrigger = triggerElemet;
    this.userId = userId;
    this.userName = userName;
    this.userType = userType;

    this.init();
  }

  init() {
    this.create();

    this.initEvents();

    this.updatePosition();
  }

  initEvents() {
    [
      ["mouseenter", this.show.bind(this)],
      ["mouseleave", this.hide.bind(this)],
      ["focus", this.show.bind(this)],
      ["blur", this.hide.bind(this)],
    ].forEach(([event, listener]) => {
      this.elTrigger.addEventListener(event, listener);
    });
  }

  create() {
    this.elThis = elem("div", { class: "flex w-52 flex-col gap-2 bg-base-100 px-4 py-2 hidden" });

    this.elArrow = elem("div", { class: "absolute" });
    // Header
    this.elHeader = elem("div");

    this.elName = elem("h1", { class: "text-lg font-bold mb-2" }, this.userName);
    this.elType = elem("h3", { class: "text-neutral-content" }, this.userType);
    this.elHeader.append(this.elName, this.elType);

    this.elDivider = elem("div", { class: "divider" });

    // Menu
    this.elMenu = elem("ul", { class: "menu" });
    this.elMenuItems = this.createMenuItems(this.data);
    this.elMenu.append(...this.elMenuItems);

    this.elThis.append(this.elArrow, this.elHeader, this.elDivider, this.elMenu);
  }

  createMenuItems() {
    const origin = window.location.origin;
    const items = [
      {
        title: "마이페이지",
        icon: MtuIcon("profile", { style: { fontSize: "20px" } }),
        on: { click: () => (window.location.href = `${origin}/dashboard/`) },
      },
      {
        title: "대시보드",
        icon: MtuIcon("dashboard", { style: { fontSize: "20px" } }),
        on: { click: () => (window.location.href = `${origin}/dashboard/`) },
      },
      {
        title: "통계",
        icon: MtuIcon("pieChart", { style: { fontSize: "20px" } }),
        on: { click: () => (window.location.href = `${origin}/stats/`) },
      },
      { title: "설정", icon: MtuIcon("setting", { style: { fontSize: "20px" } }) },
      {
        title: "로그아웃",
        icon: MtuIcon("logout", { style: { fontSize: "20px" } }),
        class: "text-error",
        on: { click: this.handleClickLogout.bind(this) },
      },
    ];

    return items.map((item) => {
      const attributes = omit(item, ["title", "icon"]);
      const li = elem("li", attributes);

      const a = elem("a", item.title);
      li.append(a);
      a.prepend(item.icon);

      return li;
    });
  }

  updatePosition() {
    const elTrigger = this.elTrigger;
    const elMenu = this.elThis;
    const elArrow = this.elArrow;

    computePosition(elTrigger, elMenu, {
      placement: "bottom",
      middleware: [offset(4), flip(), shift({ padding: 8 }), arrow({ element: elArrow })],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      // Accessing the data
      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[placement.split("-")[0]];

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        right: "",
        bottom: "",
        [staticSide]: "-4px",
      });
    });
  }

  show() {
    this.elThis.classList.remove("hidden");
    this.cleanup = autoUpdate(this.elTrigger, this.elThis, this.updatePosition.bind(this));
  }

  hide() {
    this.elThis.classList.add("hidden");
    this.cleanup();
  }
}
