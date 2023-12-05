import { MtuIcon } from "../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../core/mtu/progress/mtu-progress";
import { MtuInput } from "../../core/mtu/input/mtu-input";
import { pick, sum } from "../../core/utils/_utils";
import { mtoEvents } from "../../core/utils/mto-events";

require("../../../css/pages/st/st-course-tree.css");
export class StCourseTree {
  // 1. 전체 tree data ../cp/get-full-course/
  // 2. mStudyResult -> data, progress, point
  // 3. courseN
  constructor({ courseBookData = {}, courseData = [], resultData = [], onCloseClick, title, onBranchClick }) {
    // Data of mCourseBook
    this.courseBookData = courseBookData ?? {};

    // mCourseN's json data : {lists, contents, kls}
    this.courseData = courseData ?? [];

    // mStudyResult's properties['property'] data.
    // You can get data with user_id and course_id
    this.resultData = resultData ?? [];

    // Data of chapter/branch, and it's units.
    this.listsData = courseData?.lists ?? [];

    // Data of element's id and type, that are used in unit.
    // You can get element's full data, using id and type (mElementN)
    this.contentsData = courseData?.contents ?? [];

    this.treeData = courseData?.lists
      ? this.composeTreeData({ lists: this.listsData, contents: this.contentsData, results: this.resultData })
      : [];

    this.onCloseClick = onCloseClick ?? null;
    this.onBranchClick = onBranchClick ?? null;
    this.title = title ?? "학습하기";
    this.courseTitle = courseBookData?.title ?? null;

    // constants
    this.videoIcon = "playCircle";
    this.questionIcon = "form";
    this.progressTitle = "진도율";
    this.pointTitle = "점수";

    // TEST
    // const clProgress = new MtuProgress({ percent: 50, type: "circle" });
    // document.body.prepend(clProgress.getElement());
    this.init();
  }

  composeTreeData({ lists, contents, results }) {
    let treeData = [];
    let currentChapter = null;
    const { length } = lists;

    for (let i = 0; i < length; i++) {
      const data = structuredClone(lists)[i];
      const content = structuredClone(contents)[i];
      const result = results ? structuredClone(results)[i] : null;
      const progress = result?.progress ?? 0;
      const point = result?.point ?? 0;
      const type = data.type === 0 ? "chapter" : "branch";

      if (type === "chapter") {
        data.children = [];
        treeData.push(data);
        currentChapter = data;
      } else if (type === "branch") {
        data.units.forEach((unit, idx) => {
          unit.contentIds = content.units[idx].ids;
          unit.contentTimes = content.units[idx].times;
        });

        if (result) {
          data.results = result.results;
          data.progress = progress;
          data.point = point;
        }
        currentChapter.children.push(data);
      }
    }
    return treeData;
  }

  init() {
    this.initVariable();
    this.create();
  }

  initVariable() {
    this.totalLectures = this.listsData.length;
    this.completedLectures = this.resultData.filter((data) => data.progress === 100).length ?? 0;

    if (this.completedLectures > 0) {
      this.progress = parseFloat((this.totalLectures / this.completedLectures).toFixed(2)); //e.g. 20.22
    } else {
      this.progress = 0;
    }

    this.totalTime = 0;
    this.listsData.forEach((data) => {
      data.time ? (this.totalTime += data.time) : null;
    });

    this.completedTime = this.resultData.reduce((accumulator, currentValue, index) => {
      if (currentValue.progress === 100) {
        return accumulator + this.listsData[index].time;
      }
      return accumulator;
    });

    if (this.completedTime) {
      this.completedTime = 0;
    }

    // TODO
    // 수강 기간
  }

  create() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add("st-course-tree");

    this.elHeader = this.createHeader();
    this.elCourseInfo = this.createInfo();
    this.elMenu = this.createMenu(this.treeData);

    this.elThis.appendChild(this.elHeader);
    this.elThis.appendChild(this.elCourseInfo);
    this.elThis.appendChild(this.elMenu);
  }

  createHeader() {
    const header = document.createElement("div");
    header.classList.add("st-course-tree-header");

    const title = document.createElement("p");
    title.textContent = this.title;

    const closeIcon = MtuIcon("close");
    closeIcon.addEventListener("click", this.handleCloseClick.bind(this));

    header.appendChild(title);
    header.appendChild(closeIcon);
    return header;
  }

  createInfo() {
    const info = document.createElement("div");
    info.classList.add("st-course-tree-info");

    const textInfo = this.createTextInfo();

    const clProgress = new MtuProgress({ percent: this.progress, type: "line" });
    const progressBar = clProgress.getElement();

    info.appendChild(textInfo);
    info.appendChild(progressBar);
    return info;
  }

  createTextInfo() {
    const elTextInfo = document.createElement("div");
    elTextInfo.classList.add("st-course-tree-info-text");

    const wrapper = document.createElement("div");
    elTextInfo.appendChild(wrapper);

    const elCourseTitle = document.createElement("p");
    elCourseTitle.classList.add("st-course-tree-info-title");
    elCourseTitle.textContent = this.courseTitle;
    wrapper.appendChild(elCourseTitle);

    // TODO
    // 만료기간
    // const elCourseExpiration = document.createElement("p");
    // elCourseExpiration.textContent = this.expiration;
    // wrapper.appendChild(elCourseExpiration);

    const elCourseProgress = document.createElement("p");

    // const progressPercent = this.composeProgressPercentText(this.completedLectures, this.totalLectures);
    // const progressTime = this.composeProgressTimeText(this.completedTime, this.totalTime);
    elCourseProgress.classList.add("st-course-tree-info-progress");
    elCourseProgress.textContent = `진도율 : ${this.completedLectures}/${this.totalLectures} (${
      this.progress
    }%) | 시간: ${this.formatTime(this.completedTime)}/${this.formatTime(this.totalTime)}`;
    wrapper.appendChild(elCourseProgress);

    return elTextInfo;
  }

  composeProgressPercentText(denominator = 0, numerator) {
    if (typeof numerator !== "number" || numerator === 0) {
      return;
    }
    return `${denominator}/${numerator}`;
  }

  composeProgressTimeText(denominator = 0, numerator) {
    if (typeof numerator !== "number" || numerator === 0) {
      return;
    }
    return `${this.formatTime(denominator)}/${this.formatTime(numerator)}`;
  }

  createMenu(treeData) {
    const menu = document.createElement("ul");
    menu.classList.add("st-course-tree-menu");

    treeData.forEach((chapter, idx) => {
      const elChapter = this.createChapter(chapter, idx);
      menu.appendChild(elChapter);
    });

    return menu;
  }

  createChapter(data, index) {
    const title = data.title;
    const branchData = data.children ?? [];
    const branchSize = branchData.length;
    const chapterIndex = index;
    const indexInfo = `챕터 ${chapterIndex}`;
    const sizeInfo = `${branchSize}강 / ${1}분`;

    const elChapter = document.createElement("li");
    elChapter.classList.add("st-course-tree-chapter");

    const elChapterInfo = this.createChapterInfo({ title, indexInfo, sizeInfo });
    const elBranch = this.createBranch(branchData);

    elChapter.appendChild(elChapterInfo);
    elBranch ? elChapter.appendChild(elBranch) : null;
    return elChapter;
  }

  createChapterInfo({ indexInfo, title, sizeInfo }) {
    const elChapterInfo = document.createElement("div");
    elChapterInfo.classList.add("st-course-tree-chapter-info");

    const info = document.createElement("div");
    info.classList.add("st-course-tree-chapter-info-detail");

    const elIndexInfo = this.createTextElement(indexInfo, "st-course-tree-chapter-info-index");
    info.appendChild(elIndexInfo);

    const elSizeInfo = this.createTextElement(sizeInfo, "st-course-tree-chapter-info-size");
    info.appendChild(elSizeInfo);

    const elChapterTitle = this.createTextElement(title, "st-course-tree-chapter-title");

    elChapterInfo.appendChild(info);
    elChapterInfo.appendChild(elChapterTitle);
    return elChapterInfo;
  }

  createBranch(branchDataArray) {
    const { length } = branchDataArray;
    if (length === 0) {
      return;
    }
    const wrapper = document.createElement("ul");

    for (let i = 0; i < length; i++) {
      const branchData = branchDataArray[i];

      const elBranchItem = this.createBranchItem(branchData);
      elBranchItem.addEventListener("click", this.handleBranchClick.bind(this, branchData));
      wrapper.appendChild(elBranchItem);
    }

    return wrapper;
  }

  createBranchItem(branchData) {
    const { title, type, units } = branchData;
    const { progress, point, results } = branchData;

    const icon = type === 12 ? "youtube" : "form";

    let videoNum = 0;
    let questionNum = 0;
    let totalVideoTime = 0;
    units.forEach((unit) => {
      videoNum += unit.types.filter((value) => value === "v").length;
      questionNum += unit.types.filter((value) => value === "q").length;
      const videoTimes = unit.contentTimes.filter((value, idx) => unit.types[idx] === "v");
      totalVideoTime += sum(videoTimes);
    });

    const elBranch = document.createElement("li");
    elBranch.classList.add("st-course-tree-branch");
    elBranch.setAttribute("aria-current", "false");

    const elBranchIcon = this.createBranchIcon(icon);
    const elBranchInfo = this.createBranchInfo({ title, videoNum, questionNum, totalVideoTime });
    const elBranchResult = this.createBranchResult({ progress, point });

    elBranchIcon ? elBranch.appendChild(elBranchIcon) : null;
    elBranchInfo ? elBranch.appendChild(elBranchInfo) : null;
    elBranchResult ? elBranch.appendChild(elBranchResult) : null;

    return elBranch;
  }

  createBranchIcon(icon) {
    // const elIcon = MtuIcon(icon);
    const iconStyle = {
      fontSize: "1.5em",
    };
    const elIcon = MtuIcon(icon, { style: iconStyle });
    return elIcon;
  }

  createBranchInfo({ title, videoNum, questionNum, totalVideoTime }) {
    const elBranchInfo = document.createElement("div");
    elBranchInfo.classList.add("st-course-tree-branch-info");

    const elBranchTitle = this.createTextElement(title, "st-course-tree-branch-info-title");
    elBranchInfo.appendChild(elBranchTitle);
    if (videoNum > 0 || questionNum > 0) {
      const elBranchDetail = document.createElement("div");
      elBranchDetail.classList.add("st-course-tree-branch-info-detail");

      if (videoNum > 0 && totalVideoTime > 0) {
        const elVideo = document.createElement("div");
        const elVideoIcon = MtuIcon(this.videoIcon);
        const elVideoTimeText = this.createTextElement(`${this.formatTime(totalVideoTime)}`);
        elVideo.appendChild(elVideoIcon);
        elVideo.appendChild(elVideoTimeText);

        elBranchDetail.appendChild(elVideo);
      }
      if (questionNum > 0) {
        const elQuestion = document.createElement("div");
        const elQuestionIcon = MtuIcon(this.questionIcon);

        const elQuestionNumText = this.createTextElement(`${questionNum}문제`);
        elQuestion.appendChild(elQuestionIcon);
        elQuestion.appendChild(elQuestionNumText);
        elBranchDetail.appendChild(elQuestion);
      }

      elBranchInfo.appendChild(elBranchDetail);
    }

    return elBranchInfo;
  }

  createBranchResult({ progress = 0, point = 0 }) {
    const elBranchResult = document.createElement("div");
    elBranchResult.classList.add("st-course-tree-branch-result");

    const elProgress = this.createBranchProgress(progress);
    const elPoint = this.createBranchPoint(point);

    elProgress ? elBranchResult.appendChild(elProgress) : null;
    elPoint ? elBranchResult.appendChild(elPoint) : null;
    return elBranchResult;
  }

  createBranchProgress(percent) {
    const elBranchProgress = document.createElement("div");
    elBranchProgress.classList.add("st-course-tree-branch-progress");

    const elTitle = this.createTextElement("진도율");

    const clProgress = new MtuProgress({ percent, size: 32 });
    const elProgress = clProgress.getElement();

    elBranchProgress.append(elTitle, elProgress);
    return elBranchProgress;
  }

  createBranchPoint(percent) {
    const elBranchPoint = document.createElement("div");
    elBranchPoint.classList.add("st-course-tree-branch-point");

    const elTitle = this.createTextElement("점수");

    const clProgress = new MtuProgress({ percent, size: 32 });
    const elProgress = clProgress.getElement();

    elBranchPoint.append(elTitle, elProgress);
    return elBranchPoint;
  }

  //////////// Handler ////////////
  handleCloseClick(evt) {
    console.log(evt.target);
    const rootElement = this.getElement();
    mtoEvents.emit("onAsideClose", rootElement);
  }
  handleBranchClick(branchData, evt) {
    if (this.onBranchClick) {
      this.onBranchClick(branchData);
    }
  }
  //////////// API ////////////
  closeMenu() {}

  getElement() {
    return this.elThis;
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
    } else if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    } else {
      return `${remainingSeconds}초`;
    }
  }

  createTextElement(text, className) {
    const element = document.createElement("p");
    element.textContent = text;
    className ? element.classList.add(className) : null;
    return element;
  }
}

//////////// Tree Data Structure ////////////
// treeDataStructure = [
//   {
//     level: 1,
//     type: 0,
//     title: "title",
//     id: "branch_id",
//     units: [],
//     children: [
//       {
//         level: 2,
//         type: 12,
//         title: "title",
//         id: "branch_id",
//         time: 500, // sum of units[time]
//         units: [
//           {
//             id: "unit_id",
//             types: ["v", "q", "q", "q", "q"],
//             content_ids: [element_id, element_id, element_id, element_id, element_id],
//             time: 100, // sum of contentTimes
//             contentTimes: [100, 0, 0, 0, 0],
//           },
//         ],
//         results: [
//           {
//             repeat: [1, 1, 1, 1, 1],
//             result: ["O", "O", "O", "O", "O"],
//             first: ["O", "O", "O", "O", "O"],
//             second: ["", "", "", "", ""],
//           },
//         ],
//         progress: 100,
//         point: 100,
//       },
//     ],
//   },
// ];
