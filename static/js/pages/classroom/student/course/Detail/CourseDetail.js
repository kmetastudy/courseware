import elem from "../../../../../core/utils/elem/elem";

import { apiClass } from "../../../../../core/api/class";
import { apiCp } from "../../../../../core/api/cp";
import { apiStudent } from "../../../../../core/api/st";
import { apiUser } from "../../../../../core/api/user";

import { store } from "../../Store";

import { createTabs } from "../../../../../core/mtu/tab/create-tabs";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";
import { transformCourseDetail } from "../../../../main/utils/format-course-detail";
import { CourseDetailStudentTable } from "./CourseDetailStudentTable";
import { extract, extracts } from "../../../../../core/utils/array";
import { isNumber } from "../../../../../core/utils/type";
import { sum } from "../../../../../core/utils/array";

export class CourseDetail {
  constructor() {
    this.isActive = false;

    this.classId = store.getState("classId");
    this.router = store.getState("router");

    this.title = "코스";
    this.elTabMap = {};

    this.init();
  }

  init() {
    this.create();
  }

  initState() {
    this.courseId = null;
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
        for: "drawer-course-assign",
        class: "btn btn-square btn-ghost drawer-button lg:hidden",
      },
      MtuIcon("menu"),
    );

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, this.title);

    this.elTitleWrapper.append(this.elTitle);
    this.elHeader.append(this.elLabel, this.elTitleWrapper);

    // Cover
    this.elCoverSection = elem("div", { class: "col-span-12 h-44 rounded-lg overflow-hidden" });
    this.elThis.append(this.elCoverSection);

    this.elCoverSkeleton = elem("div", { class: "skeleton w-full hidden" });

    this.elCoverSection.append(this.elCoverSkeleton);

    // Course Title
    this.elCourseTitleSection = elem("div", { class: "col-span-12 flex items-center justify-content gap-2" });
    this.elThis.append(this.elCourseTitleSection);

    this.elCourseTitle = elem("h3", { class: "text-xl font-light grow" });
    this.elCourseTitleSection.append(this.elCourseTitle);

    this.elCourseButtonContainer = elem("div", { class: "flex justify-content gap-2" });
    this.elCourseTitleSection.append(this.elCourseButtonContainer);

    this.elStudyButton = elem(
      "button",
      {
        class: "btn btn-sm btn-outline",
        on: { click: this.handleClickStudyButton.bind(this) },
      },
      "학습하기",
    );
    this.elCourseButtonContainer.append(this.elStudyButton);

    //

    // TabsSection
    this.elTabSection = elem("section", { class: "col-span-12 overflow-hidden" });
    this.elThis.append(this.elTabSection);

    // 1. Overview
    this.elCourseOverview = elem("section", { class: "card overflow-hidden bg-base-100 mt-8 shadow-sm" });
    this.elCourseOverviewCardBody = elem("div", { class: "card-body grow-0" });
    this.elCourseOverviewTitleWrapper = elem("div", { class: "flex justify-between gap-2" });
    this.elCourseOverviewTitle = elem("h3", { class: "card-title grow" }, "강좌 소개");
    this.elCourseOverview.append(this.elCourseOverviewCardBody);
    this.elCourseOverviewCardBody.append(this.elCourseOverviewTitleWrapper);
    this.elCourseOverviewTitleWrapper.append(this.elCourseOverviewTitle);

    this.elOverviewWrapper = elem("div", { class: "overflow-x-auto" });
    this.elCourseOverview.append(this.elOverviewWrapper);

    this.elOverviewTable = elem("table", { class: "table" });
    this.elOverviewWrapper.append(this.elOverviewTable);
    this.elOverviewTableHead = elem("thead");
    this.elOverviewTableBody = elem("tbody");
    this.elOverviewTable.append(this.elOverviewTableHead, this.elOverviewTableBody);

    // 2. Curriculum
    this.elCourseCurriculum = elem("section", { class: "card overflow-hidden bg-base-100 mt-8 shadow-sm" });
    this.elCourseCurriculumBody = elem("div", { class: "card-body grow-0" });
    this.elCourseCurriculum.append(this.elCourseCurriculumBody);

    this.elCourseCurriculumTitleWrapper = elem("div", { class: "flex justify-between gap-2" });
    this.elCourseCurriculumBody.append(this.elCourseCurriculumTitleWrapper);
    this.elCourseCurriculumTitle = elem("h3", { class: "card-title grow" }, "코스 과정");
    this.elCourseCurriculumTitleWrapper.append(this.elCourseCurriculumTitle);

    this.elCurriculumWrapper = elem("div", { class: "overflow-x-auto" });
    this.elCourseCurriculum.append(this.elCurriculumWrapper);

    this.elCurriculumMenu = elem("ul", { class: "menu" });
    this.elCurriculumWrapper.append(this.elCurriculumMenu);

    // 3. Learner
    this.elClassLearner = elem("section", { class: "col-span-12 mt-8" });
    this.clClassLearnerTable = new CourseDetailStudentTable();
    this.elClassLearnerTable = this.clClassLearnerTable.getElement();
    this.elClassLearner.append(this.elClassLearnerTable);

    // Tabs
    this.tabs = createTabs();
    this.elTabRoot = this.tabs.Root({ defaultValue: "overview", onValueChange: this.handleTabValueChange.bind(this) });
    this.elTabList = this.tabs.List({ class: "tabs-bordered" });

    this.elTabOverview = this.tabs.Tab({ value: "overview", child: "Overview", class: "tab" });
    this.elTabCurriculum = this.tabs.Tab({ value: "curriculum", child: "Curriculum", class: "tab" });
    this.elTabMember = this.tabs.Tab({ value: "member", child: "Member", class: "tab" });

    this.elTabMap["overview"] = this.elTabOverview;
    this.elTabMap["curriculum"] = this.elTabCurriculum;
    this.elTabMap["member"] = this.elTabMember;

    this.elPanelContent = this.tabs.Panel({ value: "overview", child: this.elCourseOverview });
    this.elPanelCurriculum = this.tabs.Panel({ value: "curriculum", child: this.elCourseCurriculum });
    this.elPanelMember = this.tabs.Panel({ value: "member", child: this.elClassLearner });

    this.elTabList.append(this.elTabOverview, this.elTabCurriculum, this.elTabMember);
    this.elTabRoot.append(this.elTabList, this.elPanelContent, this.elPanelCurriculum, this.elPanelMember);

    this.tabs.init();

    this.elTabSection.append(this.elTabRoot);
  }

  handleTabValueChange(value) {
    for (let key in this.elTabMap) {
      if (value === key) {
        this.elTabMap[key].classList.add("tab-active");
      } else {
        this.elTabMap[key].classList.remove("tab-active");
      }
    }
  }

  handleClickStudyButton(evt) {
    evt.stopPropagation();

    console.log(this.courseId);
    store.setState("courseId", this.courseId);
    this.router.navigate(`/course/study`);
  }

  activate({ courseId: nextCourseId } = {}) {
    this.elThis.classList.remove("hidden");
    this.isActive = true;

    const courseId = nextCourseId ?? store.getState("courseId");

    if (courseId && this.courseId !== courseId) {
      this.courseId = courseId;
      this.initalize(this.courseId);
    }
  }

  deactivate() {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  async initalize(courseId) {
    this.initState();

    try {
      this.courseId = courseId;
      this.classId = store.getState("classId");

      const courseDetail = await this.urlGetCourseDetail(courseId);
      const course = await this.urlGetCourse(courseId);
      const studyResults = await this.urlFilterStudyResult(this.classId);

      const studentIds = extract(studyResults, ["id_student"]);

      const classMembers = await this.urlBulkFilterClassMember(studentIds.join(","));
      const users = await this.urlBulkFilterUser(studentIds.join(","));

      this.setCover(courseDetail);
      this.setTitle(courseDetail);
      this.setOverviewTable(courseDetail);
      this.setCurriculum(course);
      this.setLearnerTable({ users, studyResults, classMembers });
    } catch (err) {
      console.log(err);
    }
  }

  async urlGetCourseDetail(courseId) {
    try {
      const formData = new FormData();
      formData.append("courseId", courseId);
      const baseUrl = window.location.origin;
      const response = await axios.post(`${baseUrl}/cm/getDetail/`, formData);

      return response.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  async urlGetCourse(courseId) {
    try {
      const response = await apiCp.course.get(courseId);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async urlBulkFilterClassMember(joinedMemberIds) {
    try {
      const response = await apiClass.classMember.filter({ id_user__in: joinedMemberIds });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   *
   * @param {string} joinedMemberIds "id1,id2,id3"
   * @returns
   */
  async urlBulkFilterUser(joinedMemberIds) {
    try {
      const response = await apiUser.user.filter({ id__in: joinedMemberIds });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async urlFilterStudyResult(classId) {
    try {
      const response = await apiStudent.studyResult.filter({ id_class: classId });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  toggleSkeleton(show) {
    show ? this.elListSkeleton.classList.remove("hidden") : this.elListSkeleton.classList.add("hidden");
  }

  setCover(courseDetail) {
    const { thumnail: thumbnail } = courseDetail;

    if (!this.elCover) {
      this.elCover = elem("picture", { class: "w-full h-full" });
      this.elCoverImage = elem("img", {
        class: "h-full rounded-lg overflow-hidden",
        alt: "Course cover image",
      });
      this.elCover.append(this.elCoverImage);
      this.elCoverSection.prepend(this.elCover);
    }

    this.elCoverSkeleton.classList.add("hidden");
    this.elCoverImage.setAttribute("src", `/static/img/thumnail/${thumbnail}.png`);
  }

  setTitle(courseDetail) {
    const { courseTitle: title } = courseDetail;
    this.elCourseTitle.textContent = title;
  }

  setOverviewTable(courseDetail) {
    const detail = transformCourseDetail(courseDetail);
    if (detail.publisher === "null") {
      detail.publisher = "없음";
    }
    if (detail.semester === 0) {
      detail.semester = "공통";
    }

    const { courseTitle, year, grade, school, semester, subject, publisher, difficulty, producer } = detail;

    const items = [
      { title: "코스 제목", content: courseTitle, icon: MtuIcon("read") },
      { title: "년도", content: year, icon: MtuIcon("calendar") },
      { title: "학년", content: `${school} ${grade}`, icon: MtuIcon("team") },
      { title: "학기", content: semester, icon: MtuIcon("schedule") },
      { title: "과목", content: subject, icon: MtuIcon("barChart") },
      { title: "출판사", content: publisher, icon: MtuIcon("container") },
      { title: "난이도", content: difficulty, icon: MtuIcon("barChart") },
      { title: "제작자", content: producer, icon: MtuIcon("solution") },
    ];

    for (let item of items) {
      const row = elem("tr");

      const elTitle = elem("td", item.title);
      elTitle.prepend(item.icon);

      const elContent = elem("td", item.content);

      row.append(elTitle, elContent);
      this.elOverviewTableBody.append(row);
    }
  }

  setCurriculum(course) {
    const {
      json_data: { lists },
    } = course;

    const treeList = this.composeCurriculum(lists);

    treeList.forEach((chapter) => {
      const elChapter = elem("li");
      const branches = chapter.child;
      const { length: branchNum } = branches;
      if (branchNum === 0) {
        const elItem = elem("a", chapter.title);
        elChapter.append(elItem);
      } else {
        const elItemWrapper = elem("details");

        const elItem = elem("summary", chapter.title);
        elItemWrapper.append(elItem);

        const elBranchWrapper = elem("ul");
        elItemWrapper.append(elBranchWrapper);

        const elBranches = branches.map((branch) => elem("li", elem("a", branch.title)));
        elBranchWrapper.append(...elBranches);

        elChapter.append(elItemWrapper);
      }

      this.elCurriculumMenu.append(elChapter);
    });
  }

  setLearnerTable({ users, studyResults, classMembers }) {
    const { length } = users;

    let tableData = [];
    for (let i = 0; i < length; i++) {
      const { properties } = studyResults[i];
      const { property: results } = properties;
      const information = properties?.information;

      const row = {
        name: users[i].full_name,
        registrationDate: this.utcToLocalString(classMembers[i].created_date),
        progress: this.calculateCourseProgress(results),
        recentStudyDate: information?.recent_timestamp
          ? this.utcToLocalString(information?.recent_timestamp)
          : "시작 안함",
      };

      tableData.push(row);
    }
    this.clClassLearnerTable.initTable({ data: tableData });
  }

  // Utils
  composeCurriculum(lists) {
    const tree = [];
    const extractedLists = extracts(lists, ["type", "title"]);
    extractedLists.forEach((data, index) => {
      if (data.type === 0) {
        data.child = [];
        tree.push(data);
        return;
      }

      tree.at(-1).child.push(data);
    });

    return tree;
  }

  calculateCourseProgress(results, digits = 0) {
    const PROGRESS_MAX = 100;
    const resultsWithProgress = results.filter((result) => isNumber(result.progress));

    const { length: branchNum } = resultsWithProgress;

    const progressSumMax = branchNum * PROGRESS_MAX;

    const progressSum = sum(extract(resultsWithProgress, "progress"));

    return parseFloat(((progressSum / progressSumMax) * 100).toFixed(digits));
  }

  utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
  }

  getElement() {
    return this.elThis;
  }
}
