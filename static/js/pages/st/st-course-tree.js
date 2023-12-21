import { MtuIcon } from "../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../core/mtu/progress/mtu-progress";
import { pick, sum } from "../../core/utils/_utils";
import { mtoEvents } from "../../core/utils/mto-events";
import { isObject } from "../../core/utils/type-check";

require("../../../css/pages/st/st-course-tree.css");
export class StCourseTree {
  // 1. 전체 tree data ../cp/get-full-course/
  // 2. mStudyResult -> data, progress, point
  // 3. courseN
  constructor({
    courseBookData = {},
    courseData = [],
    resultData = [],
    onCloseClick,
    title,
    onBranchClick,
    initialContentId,
  }) {
    // Data of mCourseBook
    // this.courseBookData = courseBookData ?? {};

    // mCourseN
    this.courseData = courseData ?? null;

    // mCourseN's json data : {lists, contents, kls}

    console.log(typeof courseData.json_data);
    // const jsonData = courseData ? JSON.parse(courseData.json_data) : {};
    const jsonData = courseData.json_data;

    // mStudyResult's properties['property'] data.
    // You can get data with user_id and course_id
    this.resultData = resultData ?? [];

    // Data of chapter/branch, and it's units.
    // this.listsData = courseData?.lists ?? [];
    this.listsData = jsonData?.lists ?? [];

    // Data of element's id and type, that are used in unit.
    // You can get element's full data, using id and type (mElementN)
    // this.contentsData = courseData?.contents ?? [];
    this.contentsData = jsonData?.contents ?? [];

    this.treeData =
      this.listsData.length > 0
        ? this.composeTreeData({ lists: this.listsData, contents: this.contentsData, results: this.resultData })
        : [];

    this.onCloseClick = onCloseClick ?? null;
    this.onBranchClick = onBranchClick ?? null;
    this.title = title ?? "학습하기";
    this.courseTitle = courseData?.title ?? null;

    this.initialContentId = initialContentId ?? null;
    // constants
    this.videoIcon = "playCircle";
    this.questionIcon = "form";
    this.progressTitle = "진도율";
    this.pointTitle = "점수";

    this.elSelectedBranch = null; // current clicked(selected) branch

    this.init();
  }

  composeTreeData({ lists, contents, results }) {
    let treeData = [];
    let currentChapter = null;
    let chapterProgress = [];
    let chapterPoint = [];
    const { length } = lists;

    const clonedLists = structuredClone(lists);
    const clonedContents = structuredClone(contents);
    const clonedResults = structuredClone(results);

    for (let i = 0; i < length; i++) {
      // const data = structuredClone(lists)[i];
      // const content = structuredClone(contents)[i];
      // const result = results ? structuredClone(results)[i] : null;
      const data = clonedLists[i];
      const content = clonedContents[i];
      const result = clonedResults ? clonedResults[i] : null;

      const progress = result?.progress ?? 0;
      const point = result?.point ?? 0;
      const type = data.type === 0 ? "chapter" : "branch";

      if (type === "chapter") {
        if (currentChapter) {
          currentChapter.progress = this.getPercentage(sum(chapterProgress), chapterProgress.length * 100, 0);
          currentChapter.point = this.getPercentage(sum(chapterPoint), chapterPoint.length * 100, 0);
        }
        chapterProgress = [];
        chapterPoint = [];

        data.children = [];
        treeData.push(data);
        currentChapter = data;
      } else if (type === "branch") {
        data.units.forEach((unit, idx) => {
          unit.contentIds = content.units[idx].ids;
          unit.contentTimes = content.units[idx].times;
        });

        data.results = result.results;
        data.progress = progress;
        data.point = point;

        chapterProgress.push(progress);
        chapterPoint.push(point);

        currentChapter.children.push(data);
      }
    }
    return treeData;
  }

  init() {
    this.initVariable();
    this.create();
    this.initEvents();

    // if (this.initialContentId) {
    //   const data = this.getContentData(this.initialContentId);
    //   this.activateContent(data.element, data);
    // } else {
    //   const data = this.treeData[0].children[0];
    //   this.activateContent(data.element, data);
    // }
    console.log(this.treeData);
  }

  initVariable() {
    this.totalLectures = this.listsData.length;
    this.completedLectures = this.resultData.filter((data) => data.type !== 0 && data?.progress === 100).length ?? 0;

    this.progress = this.getPercentage(this.completedLectures, this.totalLectures);

    this.totalTime = 0;
    this.listsData.forEach((data) => {
      return data.type !== 0 && data.time ? (this.totalTime += data.time) : null;
    });

    this.completedTime = this.setCompletedTime(this.listsData, this.resultData);

    // TODO
    // 수강 기간
  }

  initEvents() {
    mtoEvents.on("OnChangeProgressPoint", this.handleProgressPointChange.bind(this));
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
    progressBar.classList.add("course-progress-bar");

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
    const sizeInfo = `${branchSize}강 / ${data.time ? this.formatTime(data.time) : 0}분`;

    const elChapter = document.createElement("li");
    elChapter.classList.add("st-course-tree-chapter");

    const elChapterInfo = this.createChapterInfo({ title, indexInfo, sizeInfo });
    const elBranch = this.createBranch(branchData);

    elChapter.appendChild(elChapterInfo);
    elBranch ? elChapter.appendChild(elBranch) : null;

    data.element = elChapter;

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
      elBranchItem.addEventListener("click", this.handleBranchClick.bind(this, elBranchItem, branchData));
      wrapper.appendChild(elBranchItem);

      branchData.element = elBranchItem;
    }

    return wrapper;
  }

  createBranchItem(branchData) {
    const { title, type, units } = branchData;
    const { progress, point, results } = branchData;

    // const icon = type === 12 ? "youtube" : "form";
    // const icon = type === 12 ? "playCircleFilled" : "form";
    const icon = type === 12 ? "stVideo" : "stTest";

    let videoNum = 0;
    let questionNum = 0;
    let totalVideoTime = 0;
    units.forEach((unit) => {
      videoNum += unit.types.filter((value) => value === "v").length;
      questionNum += unit.types.filter((value) => value === "q").length;
      const videoTimes = unit?.contentTimes?.filter((value, idx) => unit.types[idx] === "v");
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
    const iconStyle = {
      fontSize: "2em",
      color: "rgba(152, 109, 80)",
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

      // if (videoNum > 0 && totalVideoTime > 0) {
      if (videoNum > 0) {
        const elVideo = document.createElement("div");
        const elVideoIcon = MtuIcon(this.videoIcon);
        // const elVideoTimeText = this.createTextElement(`${this.formatTime(totalVideoTime)}`);
        const elVideoTimeText = this.createTextElement(`${videoNum} 개`);
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
    elProgress.classList.add("branch-progress");

    elBranchProgress.append(elTitle, elProgress);
    return elBranchProgress;
  }

  createBranchPoint(percent) {
    const elBranchPoint = document.createElement("div");
    elBranchPoint.classList.add("st-course-tree-branch-point");

    const elTitle = this.createTextElement("점수");

    const clPoint = new MtuProgress({ percent, size: 32 });
    const elPoint = clPoint.getElement();
    elPoint.classList.add("branch-point");

    elBranchPoint.append(elTitle, elPoint);
    return elBranchPoint;
  }

  //////////// Handler ////////////
  handleCloseClick(evt) {
    const rootElement = this.getElement();
    mtoEvents.emit("onAsideClose", rootElement);
  }

  handleBranchClick(element, branchData, evt) {
    console.log(element, branchData);
    if (this.elSelectedBranch) {
      this.elSelectedBranch.classList.remove("activate");
    }

    element?.classList.add("activate");
    this.elSelectedBranch = element;
    if (this.onBranchClick) {
      this.onBranchClick(branchData);
    }
  }

  handleProgressPointChange({ content_id, progress, point } = {}) {
    const resultData = this.resultData.filter((data) => data.id === content_id)[0];

    const [prevProgress, prevPoint] = [resultData.progress, resultData.point];

    prevProgress !== progress ? this.updateProgress(content_id, progress) : null;
    prevPoint !== point ? this.updatePoint(content_id, point) : null;
  }

  //////////// API ////////////
  activateContent(contentId) {
    // const contentWrapper = this.elSimplebarBody.querySelector(".simplebar-content-wrapper");
    const [chapterData, branchData] = this.getContentData(contentId);

    if (branchData) {
      this.handleBranchClick(branchData?.element, branchData);
    }

    // TODO
    // scroll
    // this.elMenu
  }

  getContentData(content_id) {
    /**
     * Find data from this.treeData, with id(chapter||branch)
     * return [chapter data, branchdata]
     */
    // chapter
    const chapterData = this.treeData.find((chapter) => chapter.id === content_id);

    if (chapterData) {
      return [chapterData, null];
    }

    // branch
    const parentData = this.treeData.find((chapter) => {
      return chapter.children?.find((branch) => branch.id === content_id);
    });

    const branchData = parentData?.children?.find((branch) => branch.id === content_id);
    return [parentData, branchData];
  }

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

  updateProgress(content_id, progress) {
    const [chapterData, branchData] = this.getContentData(content_id);
    const resultData = this.resultData.find((data) => data.id === content_id);

    branchData.hasOwnProperty("progress") ? (branchData.progress = progress) : null;
    chapterData.progress = this.getPercentage(
      sum(chapterData.children.map((data) => data.progress)),
      chapterData.children.length * 100,
      0,
    );

    resultData.hasOwnProperty("progress") ? (resultData.progress = progress) : null;
    const elBranch = branchData?.element;

    const elProgress = elBranch.querySelector(".branch-progress");

    const clUpdatedProgress = new MtuProgress({ percent: progress, size: 32 });
    const elUpdatedProgress = clUpdatedProgress.getElement();
    elUpdatedProgress.classList.add("branch-progress");

    elProgress.replaceWith(elUpdatedProgress);

    this.initVariable();

    const elCourseProgress = this.elThis.querySelector(".st-course-tree-info-progress");
    elCourseProgress.textContent = `진도율 : ${this.completedLectures}/${this.totalLectures} (${
      this.progress
    }%) | 시간: ${this.formatTime(this.completedTime)}/${this.formatTime(this.totalTime)}`;

    const elProgressBar = this.elThis.querySelector(".course-progress-bar");
    const newClProgressBar = new MtuProgress({ percent: this.progress, type: "line" });
    const newProgressBar = newClProgressBar.getElement();
    newProgressBar.classList.add("course-progress-bar");

    elProgressBar.replaceWith(newProgressBar);
  }

  updatePoint(content_id, point) {
    const [chapterData, branchData] = this.getContentData(content_id);
    const resultData = this.resultData.find((data) => data.id === content_id);

    branchData.hasOwnProperty("point") ? (branchData.point = point) : null;
    resultData.hasOwnProperty("point") ? (resultData.point = point) : null;

    chapterData.point = this.getPercentage(
      sum(chapterData.children.map((data) => data.point)),
      chapterData.children.length * 100,
      0,
    );

    const elBranch = branchData?.element;

    const elPoint = elBranch.querySelector(".branch-point");

    const clUpdatedPoint = new MtuProgress({ percent: point, size: 32 });
    const elUpdatedPoint = clUpdatedPoint.getElement();
    elUpdatedPoint.classList.add(".branch-point");

    elPoint.replaceWith(elUpdatedPoint);
  }

  getPercentage(numerator, denominator, digits = 2) {
    if (!denominator) {
      return 0;
    }

    return parseFloat(((numerator / denominator) * 100).toFixed(digits)); //e.g. 20.22
  }

  setCompletedTime(listsData, resultsData) {
    const time = listsData.filter((data, idx) => resultsData[idx].progress === 100).map((data) => data.time).length;
    this.completedTime = time;
    return time;
  }

  // ============ Set Data ============
  //
  setTitle(text) {
    //
  }

  setCourseTitle(text) {}

  setCourseProgress(percent) {}

  setBranchProgress(percent) {}

  setBranchPoint(percent) {}
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
