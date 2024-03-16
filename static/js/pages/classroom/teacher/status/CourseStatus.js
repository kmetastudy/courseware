import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";
import elem from "../../../../../core/utils/elem/elem";
import { isArray, isObject } from "../../../../../core/utils/type";

import { AbstractContent } from "../../AbstractContent";
import { DateRangePicker } from "../../../components/DateRangePicker";
import { DatePicker } from "../../../components/DatePicker";
import { Dropdown } from "../../../components/Dropdown";

import { CourseAssignTable } from "./CourseAssignTable";

import { apiClass } from "../../../../../core/api/class";
import { apiCp } from "../../../../../core/api/cp";
import store from "../../../common/Store";

export class CourseStatus extends AbstractContent {
  constructor() {
    super();
    this.title = "일정 할당하기";
    this.initStates();
    this.create();
  }

  initStates() {
    this.courseId = null;
    this.classId = null;
    this.data = null;

    this.dateChangedIds = []; // 개별 날짜가 수정된 데이터의 id들
    this.showChangedIds = []; // toggle (show)값이 수정된 데이터의 id들

    // this.data.json_data.scheduler_list
    this.unsavedSchedulerList = [];

    // this.data.json_data.condition.assign
    this.unsavedAssign = { index: 0, from: "", to: "", per: 0 }; // 아직 저장되지 않은, 실시간 assgin
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10 hidden",
    });

    this.elHeader = elem("header", {
      class: "col-span-12 flex items-center gap-2 lg:gap-4",
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
      // class: "col-span-12 flex justify-between items-center p-1 mb-4 rounded-lg bg-base-100 gap-2 lg:gap-4",
      class: "flex justify-between items-center p-1 mb-4 rounded-lg bg-base-100 gap-2 lg:gap-4",
    });
    this.elTableSection.append(this.elToolbar);

    this.clDropdown = new Dropdown({
      items: [
        { key: "range", label: "범위 지정하기", on: { click: this.handleDropdownItemClick.bind(this, "range") } },
        { key: "per", label: "하루 몇개", on: { click: this.handleDropdownItemClick.bind(this, "per") } },
      ],
      placeholder: "할당 방법 선택",
    });
    this.elDropdown = this.clDropdown.getElement();
    this.elToolbar.append(this.elDropdown);

    this.elDateRangePicker = elem("input", {
      type: "text",
      placeholder: "날짜를 선택해주세요",
      readonly: "",
      class: "input input-bordered input-sm min-w-52 max-w-xs hidden",
    });
    this.elToolbar.append(this.elDateRangePicker);
    this.clDateRangePicker = new DateRangePicker({
      parent: this.elDateRangePicker,
      hideCalendar: this.handleHideCalendar.bind(this),
    });

    this.elDatePicker = elem(
      elem("input", {
        type: "text",
        placeholder: "날짜를 선택해주세요",
        readonly: "",
        class: "input input-bordered input-sm min-w-32 max-w-xs hidden",
      }),
    );
    this.elToolbar.append(this.elDatePicker);
    this.clDatePicker = new DatePicker({
      parent: this.elDatePicker,
      changeToInput: this.handleChangeToInput.bind(this),
    });

    this.elSaveButton = elem(
      "button",
      { class: "btn btn-sm btn-primary ml-auto", on: { click: this.handleSaveButtonClick.bind(this) }, disabled: "" },
      "저장하기",
    );
    this.elToolbar.append(this.elSaveButton);

    this.elTableWrapper = elem("div", { class: "overflow-x-auto bg-white rounded-lg" });
    // this.elTableSection = elem("section", { class: "col-span-12 bg-base-200" });
    this.elTableSection.append(this.elTableWrapper);

    this.clTable = new CourseAssignTable({
      onToggleChange: this.handleToggleChange.bind(this),
      onSingleDateChange: this.handleTableSingleDateChange.bind(this),
    });
    this.elTable = this.clTable.getElement();
    this.elTableWrapper.append(this.elTable);
  }

  activate({ courseId } = {}) {
    super.activate();

    if (courseId && courseId !== this.courseId) {
      this.initialize(courseId);
    }
  }

  async initialize(courseId) {
    this.initStates();

    this.clDateRangePicker.deactivate();
    this.clDatePicker.deactivate();
    this.elSaveButton.disabled = true;

    try {
      this.courseId = courseId;
      this.classId = store.getState("classId");

      const responseAssign = await apiClass.classContentAssign.filter({
        course_id: courseId,
        class_id: this.classId,
      });
      const data = responseAssign.data;
      this.data = data;

      let schedulerList = this.getSchedulerList(data);
      if (schedulerList.length === 0) {
        const responseCourse = await apiCp.course.get(this.courseId);
        const lists = this.getJsonData(responseCourse.data).lists;
        schedulerList = lists.map((item) => {
          item.date = "";
          item.show = true;
          return item;
        });
      }

      this.unsavedSchedulerList = structuredClone(schedulerList);

      this.tableData = this.composeTableData(schedulerList);
      this.clTable.initTable({ data: this.tableData });

      const assignList = this.getConditionAssignList(data);
      const assign = isArray(assignList) && assignList[0];
      if (assign) {
        this.unsavedAssign = { ...assign, index: assign.index + 1 };

        const assignMethod = this.getAssignMethod(assign);
        const { from, to } = assign;

        if (assignMethod === "range") {
          this.elDateRangePicker.classList.remove("hidden");
          const initialSelectedDates = this.getAllDatesBetween(from, to);
          this.clDateRangePicker.updateSelectedDates(initialSelectedDates);
          this.elDateRangePicker.value = `${from} - ${to}`;
          this.clDropdown.select("range");
        } else if (assignMethod === "per") {
          this.elDatePicker.classList.remove("hidden");
          const selectedDates = [from];
          this.clDatePicker.updateSelectedDates(selectedDates);
          this.elDateRangePicker.value = `${from}`;
          this.clDropdown.select("per");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  composeTableData(schedulerList) {
    return schedulerList.filter((data) => data.type !== 0);
  }

  // Handler
  handleToggleChange(info) {
    const currentState = info.cell.element.checked;
    const targetId = info.row.original.id;

    const prevScheduler = this.getSchedulerList(this.data).find((scheduler) => scheduler.id === targetId);
    const unsavedScheduler = this.unsavedSchedulerList.find((scheduler) => scheduler.id === targetId);
    unsavedScheduler.show = currentState;

    console.log(prevScheduler.show, currentState);
    const isShowChanged = prevScheduler.show !== currentState;
    if (isShowChanged) {
      const changedId = this.showChangedIds.find((id) => id === targetId);
      if (!changedId) {
        this.showChangedIds.push(targetId);
      }
      this.elSaveButton.disabled = false;
      this.tableData = this.composeTableData(this.unsavedSchedulerList);
      this.clTable.initTable({ data: this.tableData });
    } else {
      const idx = this.showChangedIds.findIndex((id) => id === targetId);
      console.log(idx);
      if (typeof idx === "number" && idx !== -1) {
        this.showChangedIds.splice(idx, 1);
      }

      const isAnyThingChanged = this.dateChangedIds.length === 0 && this.showChangedIds.length === 0;
      if (isAnyThingChanged) {
        this.elSaveButton.disabled = true;
      }
    }
  }

  // Date Picker at table (single date)
  handleTableSingleDateChange(cellApi, calendar, datePicker) {
    const currentSelectedDates = datePicker.selectedDates;
    const targetId = cellApi.row.original.id;
    const prevSavedScheduler = this.getSchedulerList(this.data).find((scheduler) => scheduler.id === targetId);
    const unsavedScheduler = this.unsavedSchedulerList.find((scheduler) => scheduler.id === targetId);

    const isClickSameDate = unsavedScheduler.date === currentSelectedDates[0];
    if (isClickSameDate) {
      return;
    }

    unsavedScheduler.date = currentSelectedDates[0];

    const isDateChanged = prevSavedScheduler.date !== unsavedScheduler.date;

    if (isDateChanged) {
      const changedId = this.dateChangedIds.find((id) => id === targetId);
      if (!changedId) {
        this.dateChangedIds.push(targetId);
      }
      this.elSaveButton.disabled = false;
      this.tableData = this.composeTableData(this.unsavedSchedulerList);
      console.log(this.tableData);
      this.clTable.initTable({ data: this.tableData });
    } else {
      const indexChangedId = this.dateChangedIds.findIndex((id) => id === targetId);
      if (typeof indexChangedId === "number" && indexChangedId !== -1) {
        this.dateChangedIds.splice(indexChangedId, 1);
      }

      const isAnyThingChanged = this.dateChangedIds.length === 0 && this.showChangedIds.length === 0;
      if (isAnyThingChanged) {
        this.elSaveButton.disabled = true;
      }
    }
  }

  // Date Range
  handleHideCalendar(dateRangePicker) {
    const prevSelectedDates = dateRangePicker.settings.selected.dates;
    const selectedDates = dateRangePicker.selectedDates;
    if (
      selectedDates[0] === prevSelectedDates[0] &&
      selectedDates[selectedDates.length - 1] === prevSelectedDates[prevSelectedDates.length - 1]
    ) {
      return;
    }

    this.elSaveButton.disabled = false;

    this.unsavedAssign.per = 0;
    this.unsavedAssign.from = selectedDates[0] ?? "";
    this.unsavedAssign.to = selectedDates[selectedDates.length - 1] ?? "";

    this.updateSchedulerList("range");
  }

  // Date Picker
  handleChangeToInput(calendar, datePicker) {
    const prevSelectedDates = datePicker.settings.selected.dates;
    const selectedDates = datePicker.selectedDates;
    if (prevSelectedDates[0] === selectedDates[0]) {
      return;
    }

    this.elSaveButton.disabled = false;

    this.unsavedAssign.per = 2;
    this.unsavedAssign.from = selectedDates[0] ?? "";
    this.unsavedAssign.to = selectedDates[0] ?? "";

    this.updateSchedulerList("per");
  }

  // Click Save Button
  async handleSaveButtonClick() {
    this.data = await this.updateContentAssign();
    this.elSaveButton.disabled = true;

    this.dateChangedIds = [];
    this.showChangedIds = [];
    this.unsavedSchedulerList = structuredClone(this.getSchedulerList(this.data));

    let assignList = this.getConditionAssignList(this.data);
    this.unsavedAssign = structuredClone(assignList[assignList.length - 1]);
  }

  handleDropdownItemClick(key, evt) {
    this.handleAssignMethodChange(key);
  }

  handleAssignMethodChange(method) {
    const prevAssignMethod = this.getAssignMethod(this.unsavedAssign);
    if (!method || (!!prevAssignMethod && prevAssignMethod === method)) {
      return;
    }
    this.unsavedAssign.per = method === "range" ? 0 : 2; // FIXME: per을 임의로 2로 둔걸 수정하자..

    if (method === "range") {
      this.elDatePicker.classList.add("hidden");
      this.elDateRangePicker.classList.remove("hidden");
      this.resetTableDates(this.clDateRangePicker.getSelectedDates());
    } else if (method === "per") {
      this.elDatePicker.classList.remove("hidden");
      this.elDateRangePicker.classList.add("hidden");
      this.resetTableDates(this.clDatePicker.getSelectedDates());
    }
  }

  resetTableDates() {
    const tableWithoutDates = this.tableData.map((row) => {
      row.date = "";
      row.show = true;
      return row;
    });
    this.clTable.initTable({ data: tableWithoutDates });
  }

  setTitle(title) {
    if (title === this.title) {
      return;
    }

    this.title = title;
    this.elTitle.textContent = title;
  }

  updateSchedulerList(method) {
    switch (method) {
      case "range":
        this.updateSchedulerListWithRange();
        this.dateChangedIds = this.unsavedSchedulerList.map((data) => data.id);
        // this.elSaveButton.disabled = false;
        this.tableData = this.composeTableData(this.unsavedSchedulerList);
        this.clTable.initTable({ data: this.tableData });
        break;
      case "per":
        this.updateSchedulerListPerDay();
        break;
      case "single":
        this.updateSchedulerListSingle();
        break;
      default:
        break;
    }
  }

  updateSchedulerListWithRange() {
    const { from, to } = this.unsavedAssign;
    const betweenDates = this.getAllDatesBetween(from, to);
    const period = betweenDates.length;
    const contentsNum = this.tableData.length;

    const coursePerDay = Math.floor(contentsNum / period);

    let currentDate = from;
    let currentNum = 0;
    this.unsavedSchedulerList.forEach((data) => {
      if (data.type === 0) {
        return;
      }

      if (currentDate === to) {
        data.date = currentDate;
        return;
      }

      if (currentNum === coursePerDay) {
        betweenDates.shift();
        currentDate = betweenDates[0];
        currentNum = 0;
      }
      data.date = currentDate;
      currentNum++;
    });
  }

  updateSchedulerListPerDay() {}

  updateSchedulerListSingle() {}

  async updateContentAssign() {
    try {
      const jsonData = this.getJsonData(this.data);

      if (!jsonData.condition.scheduler.assign) {
        jsonData.condition.scheduler.assign = [];
      }

      jsonData.condition.scheduler.assign.push(this.unsavedAssign);
      jsonData.scheduler_list = this.unsavedSchedulerList;

      const response = await apiClass.classContentAssign.patch(this.data.id, { json_data: jsonData });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  parseIfJson(data) {
    try {
      JSON.parse(data);
    } catch (e) {
      return data;
    }
    return JSON.parse(data);
  }

  getJsonData(data) {
    return data.json_data;
  }

  getCondition(data) {
    return this.getJsonData(data)?.condition;
  }

  getConditionAssignList(data) {
    return this.getCondition(data)?.scheduler?.assign;
  }

  getSchedulerList(data) {
    return this.getJsonData(data)?.scheduler_list;
  }

  getAssignMethod(assign) {
    return assign.per === 0 ? "range" : "per";
  }

  getAllDatesBetween(startDateStr, endDateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endDateStr)) {
      throw new Error('날짜는 "yyyy-mm-dd" 형식이어야 합니다.');
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (startDate > endDate) {
      throw new Error("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
    }

    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  removeDuplicates(array) {
    return [...new Map(array.map((obj) => [JSON.stringify(obj), obj])).values()];
  }

  compareObjects(obj1, obj2) {
    let same = true;
    for (let [key, value] of Object.entries(obj1)) {
      if (typeof value === "object") {
        same = this.compareObjects(obj1[key], obj2[key]);
      } else {
        if (obj1[key] != obj2[key]) same = false;
      }
    }

    return same;
  }
}
