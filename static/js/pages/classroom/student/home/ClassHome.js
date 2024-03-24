import elem from "../../../../core/utils/elem/elem";

import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";

import { store } from "../Store";

import { TodoStudyCard } from "./todo/TodoStudyCard";
import { NotificationCard } from "./notification/NotificationCard";

export class ClassHome {
  constructor() {
    this.isActive = false;
    this.init();
  }

  init() {
    this.getStates();

    this.initComponents();

    this.create();

    this.updateTodoStudyCard(this.studyResultData);
  }

  getStates() {
    this.classId = store.getState("classId");
    this.router = store.getState("router");
    this.userId = store.getState("userId");

    this.studyResultData = store.getState("studyResultData");
    this.classContentAssignData = store.getState("classContentAssignData");
    this.userData = store.getState("userData");

    this.title = this.userData.full_name ? `어서오세요 ${this.userData.full_name}님!` : `어서오세요`;

    console.log(this.userData);
  }

  initComponents() {
    this.clTodoStudyCard = new TodoStudyCard();
    this.elTodoStudyCard = this.clTodoStudyCard.getElement();

    this.clNotificationCard = new NotificationCard();
    this.elNotificationCard = this.clNotificationCard.getElement();
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-8 p-4 lg:gap-x-12 lg:p-10 hidden",
    });

    // Header
    this.elHeader = elem("header", {
      class: "col-span-12 flex items-center gap-2 lg:gap-4",
    });
    this.elThis.append(this.elHeader);

    this.elLabel = elem(
      "label",
      {
        for: "drawer-classroom",
        class: "btn btn-square btn-ghost drawer-button lg:hidden",
      },
      MtuIcon("menu"),
    );

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, this.title);

    this.elTitleWrapper.append(this.elTitle);
    this.elHeader.append(this.elLabel, this.elTitleWrapper);

    // Body

    // CardTodo
    this.elThis.append(this.elTodoStudyCard);
    this.elThis.append(this.elNotificationCard);

    //
  }

  activate() {
    this.elThis.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate() {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  // Update
  updateTitle(title) {
    //
  }

  updateTodoStudyCard(studyResult) {
    const {
      properties: { property: propertyList },
    } = studyResult;

    const porpertyToday = propertyList.filter((property) => property.show && dayjs(property.date).isToday());

    this.clTodoStudyCard.updateData(porpertyToday);
  }

  utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
  }

  getElement() {
    return this.elThis;
  }
}
