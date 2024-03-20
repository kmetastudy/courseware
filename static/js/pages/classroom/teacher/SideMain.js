import { store } from "./Store";

import { createItem } from "../components/menu";

import elem from "../../../core/utils/elem/elem";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";

export class SideMain {
  constructor() {
    this.elSides = [];
    this.isActive = false;
    this.init();
  }

  init() {
    this.getState();

    this.create();

    this.createItems();
  }

  getState() {
    this.classData = store.getState("classData");
    this.joinedClasses = store.getState("joinedClasses");
    this.router = store.getState("router");
    this.title = this.classData?.title;
  }

  create() {
    this.elThis = elem("nav", { class: "min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10" });
    this.elHeader = elem("div", { class: "mx-4 flex items-center gap-2 font-black", value: this.title }, this.title);
    this.elThis.append(this.elHeader);

    this.elMenu = elem("div", { class: "menu" });
    this.elThis.append(this.elMenu);
  }

  createItems() {
    this.elNotification = createItem({
      title: "공지사항",
      icon: MtuIcon("notification", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "notification") },
    });

    this.elCommunityGroup = createItem({
      title: "커뮤니티",
      icon: MtuIcon("chatCircleDots"),
      on: { click: this.handleClickSide.bind(this, "community") },
    });

    this.elCourseGroup = createItem({
      title: "코스",
      icon: MtuIcon("chalkboard"),
      on: { click: this.handleClickSide.bind(this, "course") },
    });

    this.elScheduler = createItem({
      title: "일정",
      icon: MtuIcon("calendar", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "scheduler") },
    });

    this.elStats = createItem({
      title: "통계",
      icon: MtuIcon("pieChart", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "stats") },
    });

    this.elMember = createItem({
      title: "멤버",
      icon: MtuIcon("user", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "member") },
    });

    this.elSetting = createItem({
      title: "설정",
      icon: MtuIcon("setting", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "setting") },
    });

    this.elMenu.append(
      this.elNotification,
      this.elCommunityGroup,
      this.elCourseGroup,
      this.elScheduler,
      this.elStats,
      this.elMember,
      this.elSetting,
    );

    this.elSides.push(
      this.elNotification,
      this.elCommunityGroup,
      this.elCourseGroup,
      this.elScheduler,
      this.elStats,
      this.elMember,
      this.elSetting,
    );
  }

  getElement() {
    return this.elThis;
  }

  handleClickSide(key, evt) {
    evt.stopPropagation();

    const clickedElement = evt.currentTarget.firstChild;
    this.toggleActive(clickedElement);

    this.router.navigate(`/${key}`);
  }

  toggleActive(clickedElement) {
    this.elSides.forEach((element) => element.firstChild.classList.remove("focus"));
    clickedElement.classList.add("focus");
  }

  activate(context = {}) {
    this.elThis.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate(context = {}) {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }
}
