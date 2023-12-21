import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../../core/mtu/progress/mtu-progress";
import { pick, sum } from "../../../../core/utils/_utils";
import { mtoEvents } from "../../../../core/utils/mto-events";
import isObject from "../../../../core/utils/type/isObject";
import { createElement } from "../../../../core/utils/dom-utils";
import { classNames } from "../../../../core/utils/class-names";

require("./study-mobile-course-tree.css");
export class StMobileCourseTree {
  constructor({ data, title = "학습 상황", onBranchClick }) {
    this.onBranchClick = onBranchClick;
    this.title = title;

    this.elThis = null;
    this.elSelectedBranch = null; // current clicked(selected) branch

    this.initialize(data);
  }

  initialize(data, courseTitle) {
    this.data = data;
    // this.resultData = data.map((chapter) => chapter.children).flat();
    this.courseTitle = courseTitle;
    if (this.data) {
      this.initVariable();
      this.create();
      this.initEvents();
    }
  }

  initVariable() {
    this.prefixCls = "study-mobile-tree";
    this.videoIcon = "playCircle";
    this.questionIcon = "form";
    this.progressTitle = "진도율";
    this.pointTitle = "점수";
    this.progressIcon = MtuIcon("book");
    this.progressLabel = "진도율";
    this.progressText = "강의";

    this.totalLectures = this.data.length + sum(this.data.map((chapter) => chapter.children.length));
    this.completedLectures =
      this.data
        .map((data) => data.children)
        .flat()
        .filter((branch) => branch?.progress === 100).length ?? 0;

    this.progress = this.getPercentage(this.completedLectures, this.totalLectures);

    // TODO
    // 수강 기간
  }

  initEvents() {
    mtoEvents.on("OnChangeProgressPoint", this.handleProgressPointChange.bind(this));
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elCourseInfo = this.createInfo();
    this.elMenu = this.createMenu(this.data);

    this.elThis.append(this.elCourseInfo, this.elMenu);
  }

  // ============ create Info ============
  createInfo() {
    const infoNode = createElement("section", { className: `${this.prefixCls}-info` });

    // ==== header ====
    this.elInfoHeader = createElement("div", { className: `${this.prefixCls}-info-header` });
    infoNode.append(this.elInfoHeader);

    this.elInfoTextWrapper = createElement("div", { className: `${this.prefixCls}-info-text-wrapper` });
    this.elInfoHeader.append(this.elInfoTextWrapper);

    this.elTitle = createElement("p", {
      className: classNames(`${this.prefixCls}-info-text`, `${this.prefixCls}-info-title`),
      text: this.title,
    });

    this.elInfoTextWrapper.append(this.elTitle);

    // TODO
    // 기한
    // ==== progress (icon, progress bar) ====
    this.elInfoProgress = createElement("div", { className: `${this.prefixCls}-info-progress` });
    infoNode.append(this.elInfoProgress);

    const progressIcon = this.progressIcon;
    this.elInfoProgress.append(progressIcon);

    // Progress
    this.elProgressWrapper = createElement("div", { className: `${this.prefixCls}-info-progress-wrapper` });
    this.elInfoProgress.append(this.elProgressWrapper);

    // Progress > ProgressBar
    this.elProgressContent = createElement("div", { className: `${this.prefixCls}-info-progress-content` });
    this.elProgressWrapper.append(this.elProgressContent);

    this.elProgressLabel = createElement("p", {
      className: `${this.prefixCls}-info-progress-label`,
      text: this.progressLabel,
    });
    this.elProgressContent.append(this.elProgressLabel);

    this.clProgress = new MtuProgress({ percent: this.progress, type: "line" });
    this.elProgress = this.clProgress.getElement();
    this.elProgress.classList.add(`${this.prefixCls}-course-progress`);
    this.elProgressContent.append(this.elProgress);

    // Progress > Progress Info(강의 수 등)
    this.elProgressTextWrapper = createElement("div", { className: `${this.prefixCls}-info-progress-text-wrapper` });
    this.elProgressWrapper.append(this.elProgressTextWrapper);

    this.elProgressText = createElement("p", {
      className: `${this.prefixCls}-info-progress-text`,
      text: this.composeProgressText(),
    });
    this.elProgressText.textContent = this.progressText;
    this.elProgressTextWrapper.append(this.elProgressText);

    return infoNode;
  }

  createInfoV1() {
    this.elInfo = createElement("div", { className: `${this.prefixCls}-info` });

    this.elTextInfo = this.createTextInfo();

    this.clProgress = new MtuProgress({ percent: this.progress, type: "line" });
    this.elCourseProgressBar = this.clProgress.getElement();
    this.elCourseProgressBar.classList.add("course-progress-bar");

    this.elInfo.append(this.elTextInfo);
    return this.elInfo;
  }

  createTextInfo() {
    const elTextInfo = createElement("div", { className: `${this.prefixCls}-info-text` });

    const wrapper = document.createElement("div");
    elTextInfo.append(wrapper);

    this.elCourseTitle = createElement("p", { className: `${this.prefixCls}-info-title`, text: this.courseTitle });
    wrapper.append(this.elCourseTitle);

    // TODO
    // 만료기간
    // const elCourseExpiration = document.createElement("p");
    // elCourseExpiration.textContent = this.expiration;
    // wrapper.appendChild(elCourseExpiration);

    const progressText = this.composeProgressText();

    this.elCourseProgressText = createElement("p", {
      className: `${this.prefixCls}-info-progress`,
      text: progressText,
    });
    wrapper.append(this.elCourseProgressText);

    return elTextInfo;
  }

  // ============ Menu ============
  createMenu(treeData) {
    const menu = createElement("ul", { className: `${this.prefixCls}-menu` });

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
    // const sizeInfo = `${branchSize}강 / ${data.time ? this.formatTime(data.time) : 0}분`;
    const sizeInfo = `${branchSize}강`;

    const elChapter = createElement("li", { className: `${this.prefixCls}-chapter` });

    const elChapterInfo = this.createChapterInfo({ title, indexInfo, sizeInfo });

    const elBranch = this.createBranch(branchData);

    elChapter.append(elChapterInfo);
    elBranch ? elChapter.appendChild(elBranch) : null;

    elChapter.addEventListener("click", this.handleChapterClick.bind(this, elChapter, data));

    data.element = elChapter;

    return elChapter;
  }

  createChapterInfo({ indexInfo, title, sizeInfo }) {
    const prefixCls = `${this.prefixCls}-chapter`;

    const elChapterWrapper = createElement("div", { className: `${prefixCls}-info-wrapper` });

    const elChapterInfo = createElement("div", { className: `${prefixCls}-info` });

    const elInfo = createElement("div", { className: `${prefixCls}-info-detail` });

    const elIndexInfo = createElement("p", { className: `${prefixCls}-info-index`, text: indexInfo });
    const elSizeInfo = createElement("p", { className: `${prefixCls}-info-size`, text: sizeInfo });

    elInfo.append(elIndexInfo, elSizeInfo);

    const elChapterTitle = createElement("p", { className: `${prefixCls}-title`, text: title });

    elChapterInfo.append(elInfo, elChapterTitle);

    elChapterWrapper.append(elChapterInfo);

    // Icon (accordion)
    const elAccordionIcon = MtuIcon("down");
    elChapterWrapper.append(elAccordionIcon);

    return elChapterWrapper;
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
    units.forEach((unit) => {
      videoNum += unit.types.filter((value) => value === "v").length;
      questionNum += unit.types.filter((value) => value === "q").length;
    });

    const elBranch = createElement("li", {
      className: `${this.prefixCls}-branch`,
      attributes: { "aria-current": false },
    });

    const elBranchIcon = this.createBranchIcon(icon);
    const elBranchInfo = this.createBranchInfo({ title, videoNum, questionNum });
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

  createBranchInfo({ title, videoNum, questionNum }) {
    const elBranchInfo = document.createElement("div");
    elBranchInfo.classList.add("study-mobile-tree-branch-info");

    const elBranchTitle = this.createTextElement(title, "study-mobile-tree-branch-info-title");
    elBranchInfo.appendChild(elBranchTitle);
    if (videoNum > 0 || questionNum > 0) {
      const elBranchDetail = document.createElement("div");
      elBranchDetail.classList.add("study-mobile-tree-branch-info-detail");

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
    elBranchResult.classList.add("study-mobile-tree-branch-result");

    const elProgress = this.createBranchProgress(progress);
    const elPoint = this.createBranchPoint(point);

    elProgress ? elBranchResult.appendChild(elProgress) : null;
    elPoint ? elBranchResult.appendChild(elPoint) : null;
    return elBranchResult;
  }

  createBranchProgress(percent) {
    const elBranchProgress = document.createElement("div");
    elBranchProgress.classList.add("study-mobile-tree-branch-progress");

    const elTitle = this.createTextElement("진도율");

    const clProgress = new MtuProgress({ percent, size: 32 });
    const elProgress = clProgress.getElement();
    elProgress.classList.add("branch-progress");

    elBranchProgress.append(elTitle, elProgress);
    return elBranchProgress;
  }

  createBranchPoint(percent) {
    const elBranchPoint = document.createElement("div");
    elBranchPoint.classList.add("study-mobile-tree-branch-point");

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

  handleChapterClick(chapterNode, iconNode, evt) {
    chapterNode?.classList.toggle("activate");

    // rotate
    // iconNode.
    // if (this.onBranchClick) {
    //   this.onBranchClick(branchData);
    // }
  }

  handleBranchClick(element, branchData, evt) {
    evt.stopPropagation();
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
    const targetData = this.data
      .map((chapter) => chapter.children)
      .flat()
      .find((data) => data.id === content_id);

    const [prevProgress, prevPoint] = [targetData.progress, targetData.point];

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
     * Find data from this.data, with id(chapter||branch)
     * return [chapter data, branchdata]
     */
    // chapter
    const chapterData = this.data.find((chapter) => chapter.id === content_id);

    if (chapterData) {
      return [chapterData, null];
    }

    // branch
    const parentData = this.data.find((chapter) => {
      return chapter.children?.find((branch) => branch.id === content_id);
    });

    const branchData = parentData?.children?.find((branch) => branch.id === content_id);
    return [parentData, branchData];
  }

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

    branchData.hasOwnProperty("progress") ? (branchData.progress = progress) : null;
    chapterData.progress = this.getPercentage(
      sum(chapterData.children.map((data) => data.progress)),
      chapterData.children.length * 100,
      0,
    );

    // resultData.hasOwnProperty("progress") ? (resultData.progress = progress) : null;
    const elBranch = branchData?.element;

    const elProgress = elBranch.querySelector(".branch-progress");

    const clUpdatedProgress = new MtuProgress({ percent: progress, size: 32 });
    const elUpdatedProgress = clUpdatedProgress.getElement();
    elUpdatedProgress.classList.add("branch-progress");

    elProgress.replaceWith(elUpdatedProgress);

    this.initVariable();

    // 전체 진도율
    this.elProgressText.textContent = this.composeProgressText();

    const newClProgressBar = new MtuProgress({ percent: this.progress, type: "line" });

    const newProgressBar = newClProgressBar.getElement();
    newProgressBar.classList.add(`${this.prefixCls}-course-progress`);

    this.elProgress.replaceWith(newProgressBar);

    this.clProgress = newClProgressBar;
    this.elProgress = newProgressBar;
  }

  updatePoint(content_id, point) {
    const [chapterData, branchData] = this.getContentData(content_id);

    branchData.hasOwnProperty("point") ? (branchData.point = point) : null;

    chapterData.point = this.getPercentage(
      sum(chapterData.children.map((data) => data.point)),
      chapterData.children.length * 100,
      0,
    );

    const elBranch = branchData?.element;

    const elPoint = elBranch.querySelector(".branch-point");

    const clUpdatedPoint = new MtuProgress({ percent: point, size: 32 });
    const elUpdatedPoint = clUpdatedPoint.getElement();

    elPoint.replaceWith(elUpdatedPoint);
  }

  getPercentage(numerator, denominator, digits = 2) {
    if (!denominator) {
      return 0;
    }

    return parseFloat(((numerator / denominator) * 100).toFixed(digits)); //e.g. 20.22
  }

  composeProgressText() {
    const progressText = `진도율 : ${this.completedLectures}/${this.totalLectures} (${this.progress}%)`;
    return progressText;
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
