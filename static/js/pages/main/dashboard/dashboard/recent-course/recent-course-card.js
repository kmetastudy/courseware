import elem from "../../../../../core/utils/elem/elem";

import { MtuProgress } from "../../../../../core/mtu/progress/mtu-progress";
// import { removeChildNodes } from "../../../../core/utils/remove-child-nodes";

export class RecentCourseCard {
  // id, title, member, thumbnail, school, grade, semester, subject, date
  constructor() {
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("section", {
      class: "card card-bordered bg-base-100 shadow-lg col-span-12 sm:col-span-6 2xl:col-span-4",
    });

    this.elCardBody = elem("div", { class: "card-body" });
    this.elThis.append(this.elCardBody);

    this.elHeader = elem("h2", { class: "card-title" }, "최근 학습 강의");
    this.elCardBody.append(this.elHeader);

    this.elItemContainer = elem("div");
    this.elCardBody.append(this.elItemContainer);
  }

  /**
   *
   * @param {{ id:string, title:string, progress:number, lectureCount:number, completedLectureCount:number, information?:object, link:string }} data
   */
  setData(data = []) {
    const formattedData = data.map((item) => this.formatData(item));

    this.createItems(formattedData);
  }

  createItems(formattedData = []) {
    this.elItems = formattedData.map((item) => this.createItem(item)) ?? [];

    // removeChildNodes(this.elItemContainer);

    this.elItems.length > 0 && this.elItemContainer.append(...this.elItems);
  }

  createItem({ title, progress, progressText, relativeStudyDate, link, ...rest }) {
    const elItem = elem("div");

    // 코스 이름
    const elCourseTitle = elem("a", { class: "overflow-hidden whitespace-nowrap text-ellipsis", href: link }, title);
    elItem.append(elCourseTitle);

    // 진도율, 최근 학습 날짜(상대적)
    const elInfoContainer = elem("div", { class: "flex justify-between" });

    elItem.append(elInfoContainer);

    const elProgressText = elem("p", { class: "text-sm text-neutral-content" }, progressText);

    const elRelativeStudyDate = elem("time", { class: "text-sm text-neutral-content" }, relativeStudyDate);

    elInfoContainer.append(elProgressText, elRelativeStudyDate);

    const clProgressBar = new MtuProgress({ type: "line", percent: progress });
    const elProgressBar = clProgressBar.getElement();

    elItem.append(elProgressBar);

    return elItem;
  }

  getElement() {
    return this.elThis;
  }

  // ============ Utils ============
  formatData({ completedLectureCount, lectureCount, progress, information, ...rest } = {}) {
    const progressText = this.formatProgressText(completedLectureCount, lectureCount, progress);

    const { recent_timestamp: recentStudyTimestamp } = information;

    const today = new Date();
    const relativeStudyDate = this.compareDates(recentStudyTimestamp, today);

    return { progressText, relativeStudyDate, progress, ...rest };
  }

  formatProgressText(completedLectureCount, lectureCount, progress) {
    return `진도율: ${completedLectureCount}강/${lectureCount}강 (${progress}%)`;
  }

  compareDates(date1, date2, withoutSuffix = false) {
    // return date2 ? dayjs(date1).from(dayjs(date2), withoutSuffix) : dayjs(date1).fromNow(withoutSuffix);
    return dayjs(date1).from(dayjs(date2), withoutSuffix);
  }
}
