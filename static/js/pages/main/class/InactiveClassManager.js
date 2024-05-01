import { apiClass } from "../../../core/api/class";
import elem from "../../../core/utils/elem/elem";
import { extract } from "../../../core/utils/array/extract";
import { ClassCard } from "./ClassCard";
import { TYPE_MEMBER } from "../../class/constants";
/**
 * 비활성화(종료)된 클래스 보기
 * mClass/mSingleCourseClass의 active가 false인 클래스를 보여줍니다.
 */
export class InactiveClassManager {
  constructor({ userId }) {
    this.userId = userId;
    this.init();
  }

  async init() {
    this.create();

    const classes = await this.urlFilterInactiveClasses();

    if (!classes) {
      this.elEmptyClass.classList.remove("hidden");
      return;
    }

    this.createClassCards(classes);
  }

  create() {
    this.elThis = elem("div", { class: "mtm-dashboard-manager col-start-2 row-start-1 bg-base-200 hidden" });

    this.elWrapper = elem("div", { class: "mtm-dashboard-manager-wrapper" });
    this.elThis.append(this.elWrapper);

    this.elHeader = elem("div", { class: "mtm-dashboard-manager-header" });

    this.elTitle = elem("div", { class: "dashboard-title" }, "종료된 클래스");
    this.elHeader.append(this.elTitle);

    this.elBody = elem("div", { class: "grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10" });

    // this.elEmptyClass = elem("div", { class: "col-span-12" });
    this.elEmptyClass = elem("div", { class: "col-span-12 hero hidden" });
    this.elBody.append(this.elEmptyClass);

    this.elEmptyClassContent = elem("div", { class: "hero-content text-center" });
    this.elEmptyClass.append(this.elEmptyClassContent);

    this.elEmptyClassTextContainer = elem("div", { class: "max-w-md" });
    this.elEmptyClassContent.append(this.elEmptyClassTextContainer);

    this.elEmptyTitle = elem("h1", { class: "text-2xl font-bold" }, "종료된 클래스가 없습니다.");
    this.elEmptyMain = elem(
      "p",
      { class: "py-6" },
      "선생님이 보유하신 클래스 중, 종료된 클래스가 없습니다. 클래스의 기간이 종료되거나, 설정을 통해 클래스를 종료할 수 있습니다.",
    );
    this.elEmptyClassTextContainer.append(this.elEmptyTitle, this.elEmptyMain);

    this.elWrapper.append(this.elHeader, this.elBody);
  }

  async urlFilterInactiveClasses() {
    try {
      const classResponse = await apiClass.class.filter({ id_owner: this.userId, active: false });
      const singleCourseClassResponse = await apiClass.singleCourseClass.filter({
        id_owner: this.userId,
        active: false,
      });

      const classes = [...classResponse?.data, ...singleCourseClassResponse?.data];

      if (classes.length === 0) {
        return;
      }

      const classIds = extract(classes, "id");

      const classMemberResponse = await apiClass.classMember.filter({
        id_class__in: classIds.join(","),
      });
      const members = classMemberResponse.data;

      classes.map((data) => {
        const classMembers = members.filter((item) => item.id_class === data.id);

        data.member = classMembers;
        return data;
      });

      return classes;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  createClassCards(classes) {
    classes.forEach((data) => {
      const { id, title, member } = data;
      const memberNum = member.filter((member) => member.type === TYPE_MEMBER.STUDENT).length;

      const clClassCard = new ClassCard({ id, title, memberNum, onClick: this.handleClassCardClick.bind(this) });
      const elClassCard = clClassCard.getElement();

      this.elBody.append(elClassCard);
    });
  }

  handleClassCardClick(classId) {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/class/classroom/teacher/${classId}/`;
  }

  getElement() {
    return this.elThis;
  }
}
