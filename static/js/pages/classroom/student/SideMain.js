import { store } from "./Store";

import elem from "../../../core/utils/elem/elem";
import { mtoEvents } from "../../../core/utils/mto-events";

import { HomeButton } from "../components/HomeButton";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { Dropdown } from "../components/Dropdown";

export class SideMain {
  constructor() {
    this.elSides = [];
    this.isActive = false;

    this.itemMap = new Map();

    this.init();
  }

  init() {
    this.getState();

    this.dropdownItems = this.composeDropdownItems(this.classesData);

    this.create();

    this.createItems();

    this.initEvents();
  }

  getState() {
    this.classData = store.getState("classData");
    this.classesData = store.getState("classesData");

    this.router = store.getState("router");
    this.title = this.classData?.title ?? "클래스";
  }

  composeDropdownItems(classesData = []) {
    const items = classesData.map((item) => {
      return {
        key: item.id,
        label: item.title,
        on: { click: this.handleDropdownItemClick.bind(this, item.id) },
      };
    });
    return items;
  }

  create() {
    this.elThis = elem("nav", {
      class: "min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 pb-10 pt-4 hidden",
    });

    // home
    this.clHomeButton = new HomeButton({ onClick: () => (window.location.href = "/dashboard/") });
    this.elHomeButton = this.clHomeButton.getElement();
    this.elThis.append(this.elHomeButton);

    this.elHeader = elem("div", { class: "p-2 flex items-center gap-2 font-black" });
    this.elThis.append(this.elHeader);

    this.clDropdown = new Dropdown({
      items: this.dropdownItems,
      defaultKey: this.classData.id,
    });
    this.elDropdown = this.clDropdown.getElement();
    this.elHeader.append(this.elDropdown);

    this.elMenu = elem("div", { class: "menu" });
    this.elThis.append(this.elMenu);
  }

  createItems() {
    this.elDashboard = this.createItem({
      title: "대시보드",
      icon: MtuIcon("dashboard", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "/") },
      key: "home",
    });

    // this.elNotification = this.createItem({
    //   title: "공지사항",
    //   icon: MtuIcon("notification", { style: { fontSize: "20px" } }),
    //   on: { click: this.handleClickSide.bind(this, "notification") },
    // });

    // this.elCommunityGroup = this.createItem({
    //   title: "커뮤니티",
    //   icon: MtuIcon("chatCircleDots"),
    //   on: { click: this.handleClickSide.bind(this, "community") },
    // });

    this.elCourseGroup = this.createItem({
      title: "코스",
      icon: MtuIcon("chalkboard"),
      on: { click: this.handleClickSide.bind(this, "course") },
      key: "course",
    });

    // this.elScheduler = this.createItem({
    //   title: "일정",
    //   icon: MtuIcon("calendar", { style: { fontSize: "20px" } }),
    //   on: { click: this.handleClickSide.bind(this, "scheduler") },
    // });

    // this.elStats = this.createItem({
    //   title: "통계",
    //   icon: MtuIcon("pieChart", { style: { fontSize: "20px" } }),
    //   on: { click: this.handleClickSide.bind(this, "stats") },
    // });

    this.elMember = this.createItem({
      title: "멤버",
      icon: MtuIcon("user", { style: { fontSize: "20px" } }),
      on: { click: this.handleClickSide.bind(this, "member") },
      key: "member",
    });

    // this.elSetting = this.createItem({
    //   title: "설정",
    //   icon: MtuIcon("setting", { style: { fontSize: "20px" } }),
    //   on: { click: this.handleClickSide.bind(this, "setting") },
    //   key: "setting",
    // });

    this.elMenu.append(
      this.elDashboard,
      // this.elNotification,
      // this.elCommunityGroup,
      this.elCourseGroup,
      // this.elScheduler,
      // this.elStats,
      this.elMember,
      // this.elSetting,
    );

    this.elSides.push(
      this.elDashboard,
      // this.elNotification,
      // this.elCommunityGroup,
      this.elCourseGroup,
      // this.elScheduler,
      // this.elStats,
      this.elMember,
      // this.elSetting,
    );
  }

  createItem({ title, icon, key = undefined, ...attribute }) {
    const li = elem("li", { ...attribute }, elem("a", title));
    if (icon) {
      li.firstChild.prepend(icon);
    }

    if (key) {
      this.itemMap.set(key, li);
    }

    return li;
  }

  initEvents() {
    mtoEvents.on("focusSide", this.handleFocusSide.bind(this));
  }

  getElement() {
    return this.elThis;
  }

  handleFocusSide({ key }) {
    if (this.itemMap.has(key)) {
      this.toggleActive(this.itemMap.get(key).firstChild);
    }
  }

  handleClickSide(key, evt) {
    evt.stopPropagation();

    const clickedElement = evt.currentTarget.firstChild;
    this.toggleActive(clickedElement);

    this.router.navigate(`/${key}`);
  }

  handleDropdownItemClick(key, evt) {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/class/classroom/teacher/${key}/`;
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
