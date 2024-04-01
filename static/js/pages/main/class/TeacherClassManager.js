import { apiClass } from "../../../core/api/class/";
import elem from "../../../core/utils/elem/elem";
import { extract } from "../../../core/utils/array";
import { transformCourseDetail } from "../utils/format-course-detail";
import { pick } from "../../../core/utils/objects";
import { ClassCard } from "./ClassCard";
import { TYPE_MEMBER } from "../../class/constants";
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

  create() {
    this.elThis = elem("div", { class: "ml-8 w-full hidden" });

    this.elHeader = elem("div", { class: "mb-1 flex flex-row items-center gap-0 text-2xl font-semibold" });

    this.elTitle = elem("div", { class: "dashboard-title" }, "내 클래스");
    this.elHeader.append(this.elTitle);

    this.elBody = elem("div", { class: "grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 md:gap-x-12" });

    this.elEmptyClass = elem("div", { class: "col-span-8" });

    this.elThis.append(this.elHeader, this.elBody);
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
      console.log(cardData);
      const clClassCard = new ClassCard({ onClick: this.handleClick.bind(this), data: cardData });
      const elClassCard = clClassCard.getElement();

      this.elBody.append(elClassCard);
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
