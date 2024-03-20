import { apiClass } from "../../../core/api/class";
import { apiUser } from "../../../core/api/user";

import elem from "../../../core/utils/elem/elem";
import { extract } from "../../../core/utils/array/extract";

export class ClassRegistrationModal {
  constructor({ courseId, userId, userType }) {
    this.userId = userId;
    this.userType = userType;
    this.courseId = courseId;

    this.id = "class_registration_modal";
    this.init();
  }

  async init() {
    this.create();

    const classes = await this.urlFilterClass(this.courseId);

    if (!classes || classes.length === 0) {
      // this.
    }

    const owners = extract(classes, "id_owner");

    const users = await this.urlBulkFilterUser(owners);

    const registeredClassMembers = await this.urlFilterClassMember(this.userId);

    const registeredClassIds = extract(registeredClassMembers, "id_class");

    const unregisteredClasses = classes.filter((item) => registeredClassIds.includes(item.id) === false);

    this.tableData = this.composeTableData(unregisteredClasses, users);

    if (unregisteredClasses.length > 0) {
      this.elEmptyStateWrapper.classList.add("hidden");

      this.elTableWrapper.classList.remove("hidden");

      this.tableData.forEach((data, index) => {
        const elRow = this.createRow({ data, index });
        this.elTableBody.append(elRow);
      });
    } else {
      this.elEmptyStateWrapper.classList.remove("hidden");

      this.elTableWrapper.classList.add("hidden");
    }
  }

  create() {
    this.elThis = elem("dialog", { class: "modal", id: this.id });

    this.elBox = elem("div", { class: "modal-box" });
    this.elThis.append(this.elBox);

    this.elTitle = elem("h3", { class: "font-bold text-lg mb-8" }, "수강신청하기");
    this.elBox.append(this.elTitle);

    this.elEmptyStateWrapper = elem("div", { class: "overflow-x-auto flex justfiy-center items-center hidden" });
    this.elBox.append(this.elEmptyStateWrapper);

    this.elEmptyState = elem("p", "개설된 클래스가 없습니다.");
    this.elEmptyStateWrapper.append(this.elEmptyState);

    this.elTableWrapper = elem("div", { class: "overflow-x-auto h-96 hidden" });
    this.elBox.append(this.elTableWrapper);

    this.elTable = elem("table", { class: "table table-xs" });
    this.elTableWrapper.append(this.elTable);

    this.elTableHeader = elem("thead");
    this.elTableColumnWrapper = elem("tr");
    this.elTableHeader.append(this.elTableColumnWrapper);
    this.columns = ["", "클래스", "선생님", "수강하기"];
    this.columns.forEach((column) => {
      const header = elem("th", column);
      this.elTableColumnWrapper.append(header);
    });

    this.elTableBody = elem("tbody");
    this.elTable.append(this.elTableHeader, this.elTableBody);

    // Backdrop
    this.elBackDrop = elem("form", { method: "dialog", class: "modal-backdrop" });
    this.elCoseButton = elem("button", "close");
    this.elBackDrop.append(this.elCoseButton);
    this.elThis.append(this.elBackDrop);
  }

  async urlFilterClass(courseId) {
    try {
      const response = await apiClass.singleCourseClass.filter({ id_course: courseId });
      const classes = response.data ?? [];

      return classes;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async urlBulkFilterUser(owners) {
    try {
      console.log(owners.join(","));
      const response = await apiUser.user.filter({ id__in: owners.join(",") });
      const users = response.data ?? [];
      return users;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async urlFilterClassMember(userId) {
    try {
      const response = await apiClass.classMember.filter({ id_user: userId });
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async urlClassRegistration(formData) {
    try {
      const baseUrl = window.location.origin;
      const response = await axios.post(`${baseUrl}/class/single-course-class/registration/`, formData);
      const classMemberData = response.data;
      const classId = classMemberData.id_class;

      window.location.href = `${baseUrl}/class/classroom/student/${classId}/`;
    } catch (error) {
      console.log(error);
    }
  }

  composeTableData(classes, teachers) {
    const tableData = classes.map((data) => {
      const idOwner = data.id_owner;
      const user = teachers.find((data) => data.id === idOwner);
      console.log(user);

      data.name = user?.full_name ?? "익명";

      return data;
    });

    return tableData;
  }

  handleClickRegistration(classId, evt) {
    const formData = new FormData();
    formData.append("id_class", classId);
    formData.append("id_user", this.userId);
    formData.append("type", this.userType);
    this.urlClassRegistration(formData);
  }

  createRow({ data, index }) {
    const { id, title, name } = data;
    const row = elem("tr", { class: "hover" });
    const elIndex = elem("th", index);
    const elTitle = elem("td", title);
    const elName = elem("td", name);
    const elLink = elem(
      "td",
      elem(
        "a",
        { class: "link link-hover", href: "#", on: { click: this.handleClickRegistration.bind(this, id) } },
        "신청하기",
      ),
    );
    row.append(elIndex, elTitle, elName, elLink);
    return row;
  }

  getElement() {
    return this.elThis;
  }
}
