import { apiClass } from "../../../core/api/class/";
import elem from "../../../core/utils/elem/elem";
import { extract } from "../../../core/utils/array/extract";
import { ClassCard } from "./ClassCard";
import { TYPE_MEMBER } from "../../class/constants";
export class StudentClassManager {
  constructor({ userId }) {
    this.userId = userId;
    this.init();
  }

  async init() {
    this.create();

    try {
      const members = await this.urlFilterClassMember(this.userId);

      const classIds = extract(members, "id_class");

      const classes = await this.urlBulkFilterClass(classIds.join(","));

      const classMembers = await this.urlBulkFilterClassMember(classIds.join(","));
      console.log(classMembers);

      classes.map((data) => {
        const membersOfClass = classMembers.filter((item) => item.id_class === data.id);
        data.member = membersOfClass;
        return data;
      });

      console.log(classes);

      this.createClassCards(classes);
    } catch (error) {
      console.log(error);
    }
  }

  create() {
    this.elThis = elem("div", { class: "mtm-dashboard-manager hidden" });

    this.elWrapper = elem("div", { class: "mtm-dashboard-manager-wrapper" });
    this.elThis.append(this.elWrapper);

    this.elHeader = elem("div", { class: "mtm-dashboard-manager-header" });

    this.elTitle = elem("div", { class: "dashboard-title" }, "내 클래스");
    this.elHeader.append(this.elTitle);

    this.elBody = elem("div", { class: "grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10" });

    this.elEmptyClass = elem("div", { class: "col-span-8" });

    this.elWrapper.append(this.elHeader, this.elBody);
  }

  async urlFilterClassMember(userId) {
    try {
      const response = await apiClass.classMember.filter({ id_user: userId });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async urlBulkFilterClass(classIds) {
    try {
      const response = await apiClass.singleCourseClass.filter({ id__in: classIds });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async urlBulkFilterClassMember(classIds) {
    try {
      const response = await apiClass.classMember.filter({ id_class__in: classIds });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  createClassCards(classes) {
    classes.forEach((data) => {
      const { id, title, member } = data;
      const memberNum = member.filter((member) => member.type === TYPE_MEMBER.STUDENT).length;

      const clClassCard = new ClassCard({ id, title, memberNum, onClick: this.handleClick.bind(this) });
      const elClassCard = clClassCard.getElement();

      this.elBody.append(elClassCard);
    });
  }

  handleClick(classId) {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/class/classroom/student/?id=${classId}`;
  }

  getElement() {
    return this.elThis;
  }
}
