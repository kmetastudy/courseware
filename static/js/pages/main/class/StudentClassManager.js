import { TYPE_MEMBER } from "../../class/constants";

import { transformCourseDetail } from "../utils/format-course-detail";
import { extract } from "../../../core/utils/array/extract";

import elem from "../../../core/utils/elem/elem";

import { apiClass } from "../../../core/api/class/";

import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";

import { ClassCard } from "./ClassCard";

export class StudentClassManager {
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
    this.elThis = elem("div", {
      class: "grid grid-cols-12 grid-rows-[min-content] gap-x-6 gap-y-12 p-4 lg:gap-x-12 lg:p-10 hidden",
    });

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

    this.elTitle = elem("h1", { class: "font-bold lg:text-2xl" }, "내 클래스");
    this.elTitleWrapper.append(this.elTitle);

    this.elEmptyClass = elem("div", { class: "col-span-8" });
  }

  async initData() {
    try {
      const members = await this.urlFilterClassMember(this.userId);

      const classIds = extract(members, "id_class");

      const classes = await this.urlBulkFilterClass(classIds.join(","));
      const courseIds = extract(classes, "id_course") ?? [];

      const classMembers = await this.urlBulkFilterClassMember(classIds.join(","));

      const formData = new FormData();
      formData.append("course_ids", JSON.stringify(courseIds));

      const detailList = await this.urlGetDetailList(formData);

      classes.map((data) => {
        const membersOfClass = classMembers.filter((item) => item.id_class === data.id);
        const courseDetail = detailList.find((item) => item.courseId === data.id_course);

        data.courseDetail = transformCourseDetail(courseDetail);
        data.member = membersOfClass;

        return data;
      });

      this.createClassCards(classes);
    } catch (error) {
      console.log(error);
    }
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

  async urlGetDetailList(formData) {
    try {
      const baseOrigin = window.location.origin;
      const courseDetailResponse = await axios.post(`${baseOrigin}/cm/get-detail-list/`, formData);
      const courseDetails = courseDetailResponse?.data?.data ?? [];
      return courseDetails;
    } catch (error) {
      return [];
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

    window.location.href = `${baseUrl}/class/classroom/student/${classId}/`;
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
