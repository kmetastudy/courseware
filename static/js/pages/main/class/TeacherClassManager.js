import { apiClass } from "../../../core/api/class/";
import elem from "../../../core/utils/elem/elem";
import { extract } from "../../../core/utils/array";
import { transformCourseDetail } from "../utils/format-course-detail";
import { pick } from "../../../core/utils/objects";
import { ClassCard } from "./ClassCard";
import { TYPE_MEMBER } from "../../class/constants";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
export class TeacherClassManager {
  constructor({ userId }) {
    this.userId = userId;
    this.init();
  }

  async init() {
    this.create();

    const data = await this.initData();

    if (!data) {
      this.elEmptyClass.classList.remove("hidden");
      return;
    }

    this.createClassCards(data);
  }

  // create() {
  //   this.elThis = elem("div", { class: "ml-8 w-full hidden" });

  //   this.elHeader = elem("div", { class: "mb-1 flex flex-row items-center gap-0 text-2xl font-semibold" });

  //   this.elTitle = elem("div", { class: "dashboard-title" }, "내 클래스");
  //   this.elHeader.append(this.elTitle);

  //   this.elBody = elem("div", { class: "grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 md:gap-x-12" });

  //   this.elEmptyClass = elem("div", { class: "col-span-8" });

  //   this.elThis.append(this.elHeader, this.elBody);
  // }

  create() {
    this.elThis = elem("div", { class: "grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10" });

    // Header
    this.elHeader = elem("div", {
      class: "col-span-12 flex items-center gap-2 lg:gap-4",
    });
    this.elThis.append(this.elHeader);

    this.elLabel = elem("label", {
      for: "dashboard-drawer",
      class: "btn btn-square btn-ghost drawer-button lg:hidden",
    });
    this.elHeader.append(this.elLabel);

    this.elIcon = MtuIcon("menu");
    this.elLabel.append(this.elIcon);

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elHeader.append(this.elTitleWrapper);

    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, "내 클래스");
    this.elTitleWrapper.append(this.elTitle);

    this.elEmptyClass = elem("div", { class: "col-span-8" });
  }

  async initData() {
    try {
      const classResponse = await apiClass.class.filter({ id_owner: this.userId });
      const singleCourseClassResponse = await apiClass.singleCourseClass.filter({ id_owner: this.userId });

      const classes = [...classResponse?.data, ...singleCourseClassResponse?.data];

      if (classes.length === 0) {
        return;
      }

      const classIds = extract(classes, "id");

      const classMemberResponse = await apiClass.classMember.filter({ id_class__in: classIds.join(",") });
      const members = classMemberResponse.data;

      // Detail API

      const courseIds = extract(classes, "id_course");

      const formData = new FormData();
      formData.append("course_ids", JSON.stringify(courseIds));

      const baseOrigin = window.location.origin;
      const courseDetailResponse = await axios.post(`${baseOrigin}/cm/get-detail-list/`, formData);
      const courseDetails = courseDetailResponse?.data?.data ?? [];

      classes.map((data) => {
        const classMember = members.filter((item) => item.id_class === data.id);
        const courseDetail = courseDetails.find((item) => item.courseId === data.id_course);

        data.member = classMember;
        data.courseDetail = transformCourseDetail(courseDetail);

        return data;
      });

      return classes;
    } catch (error) {
      console.log(error);
    }
  }

  createClassCards(classes) {
    classes.forEach((data) => {
      const cardData = this.composeCardData(data);
      const clClassCard = new ClassCard({ onClick: this.handleClick.bind(this), data: cardData });
      const elClassCard = clClassCard.getElement();

      this.elThis.append(elClassCard);
    });
  }

  handleClick(classId) {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/class/classroom/teacher/${classId}/`;
  }

  composeCardData(data) {
    const {
      id,
      title,
      member,
      courseDetail: { thumnail: thumbnail, school, grade, semester, subject },
    } = data;

    const cardData = { id, title, thumbnail, school, grade, subject };

    cardData.member = member.filter((member) => member.type === TYPE_MEMBER.STUDENT).length ?? 0;
    cardData.semester = semester ? `${semester}학기` : "공통";

    if (data.start_date && data.end_date) {
      const { start_date: startDate, end_date: endDate } = data;
      cardData.date = this.formatDate(startDate, endDate);
    }

    return cardData;
  }

  formatDate(startDate, endDate) {
    return `${dayjs(startDate).format("YYYY-MM-DD")} ~ ${dayjs(endDate).format("YYYY-MM-DD")}`;
  }

  getElement() {
    return this.elThis;
  }
}
