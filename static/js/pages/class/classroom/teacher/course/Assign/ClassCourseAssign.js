import { isNumber } from "../../../../../core/utils/type";

import elem from "../../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";

import { ClassCourseAssignTable } from "./ClassCourseAssignTable";

export class ClassCourseAssign {
  constructor() {
    this.title = "일정 할당하기";

    this.initStates();

    this.create();
  }

  initStates() {
    this.isActive = false;

    this.studyResults = null;
    this.users = null;
    this.classContentAssign = null;
    this.course = null;
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10 hidden",
    });

    // FIXME:
    // toolbar
    this.elHeader = elem("header", {
      class: "col-span-12 flex items-center gap-2 lg:gap-4 hidden",
    });
    this.elThis.append(this.elHeader);

    this.elLabel = elem(
      "label",
      {
        for: "drawer-course-assign",
        class: "btn btn-square btn-ghost drawer-button lg:hidden",
      },
      MtuIcon("menu"),
    );

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, this.title);
    this.elTitleWrapper.append(this.elTitle);
    this.elHeader.append(this.elLabel, this.elTitleWrapper);

    this.elTableSection = elem("section", { class: "col-span-12 bg-base-200" });
    this.elThis.append(this.elTableSection);

    this.elToolbar = elem("header", {
      class: "flex justify-between items-center p-1 mb-4 rounded-lg bg-base-100 gap-2 lg:gap-4",
    });
    this.elTableSection.append(this.elToolbar);

    this.elTableWrapper = elem("div", { class: "overflow-x-auto bg-white rounded-lg" });
    this.elTableSection.append(this.elTableWrapper);

    this.clTable = new ClassCourseAssignTable({
      // onToggleChange: this.handleToggleChange.bind(this),
      // onSingleDateChange: this.handleTableSingleDateChange.bind(this),
    });
    this.elTable = this.clTable.getElement();
    this.elTableWrapper.append(this.elTable);
  }

  activate() {
    this.elThis.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate() {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  updateData({ studyResults, users, classContentAssign, course } = {}) {
    this.studyResults = studyResults;
    this.users = users;
    this.classContentAssign = classContentAssign;
    this.course = course;
    this.propertyWithUser = this.mergePropertyWithUser(studyResults, users);
    this.schedulerList = this.composeSchedulerList(classContentAssign);
  }

  mergePropertyWithUser(studyResults, users) {
    return users.map((user) => {
      const { id: userId } = user;

      const studyResult = studyResults.find((res) => res.id_student === userId);
      const property = studyResult.properties.property;

      return {
        user: user,
        property: property,
      };
    });
  }

  initialize({ period, date }) {
    this.tableData = this.composeTableData(period, this.propertyWithUser, this.schedulerList);

    this.clTable.initTable(this.tableData, this.users);
  }

  composeTableData(period, propertyWithUser, schedulerList) {
    // {property, user1property?, name2}
    // 1. row가 lesson/testum, column이 member
    // 2. row가 member, column이 lesson/testum
    // 일단 지금은, 1번
    //

    const filteredSchedulerList = this.filterByPeriod(schedulerList, period).filter((data) => isNumber(data.period));

    const tableData = filteredSchedulerList.map((scheduler) => {
      //
      const { id } = scheduler;

      // column => {scheduler, members: [{userId, show, date}, {...user2, show, date}]}
      const userProperties = propertyWithUser.map(({ user, property }) => {
        const matchedProperty = property.find((item) => item.id === id);
        const { id: schedulerId, show, date } = matchedProperty;
        return { id: user.id, name: user.full_name, schedulerId, show, date };
      });

      const column = {
        scheduler: scheduler,
        members: userProperties,
      };

      return column;
    });

    return tableData;

    // const filteredProperty = propertyWithUser.map(({ user, property }) => {
    //   return {
    //     user: user,
    //     property: this.filterByPeriod(property, period),
    //   };
    // });
    // const filteredSchedulerList = this.filterByPeriod(schedulerList);
    // const { length } = filteredSchedulerList;
    // for (let i = 0; i < length; i++) {
    //   const row = {};
    // }
  }

  composeSchedulerList(classContentAssign) {
    return classContentAssign.json_data.scheduler_list;
  }

  setTitle(title) {
    if (title === this.title) {
      return;
    }

    this.title = title;
    this.elTitle.textContent = title;
  }

  filterByPeriod(array, period) {
    if (period === 0) {
      return array;
    }

    return array.filter((item) => item.period === period);
  }

  getElement() {
    return this.elThis;
  }
}
