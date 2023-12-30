import { createElement } from "../../../core/utils/dom-utils";
import { pick } from "../../../core/utils/_utils";
import isString from "../../../core/utils/type/isString";
import { CourseStatsServices } from "./detail/course-stats-services";

require("./course-table.css");
export class CourseTable {
  static #CHAPTER_TYPE = 0;
  constructor(config = {}) {
    this.onCellClick = config.onCellClick ?? undefined;
    this.onCellTap = config.onCellTap ?? undefined;

    this.prefixCls = "course-table";
    this.init();
  }

  init() {
    this.setup();

    this.create();

    this.renderTable();

    this.initTableEvents();
  }

  setup() {
    this.services = new CourseStatsServices();
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });
  }

  renderTable() {
    this.table = new Tabulator(this.elThis, {
      layout: "fitColumns",
      placeholder: "수강중인 강의가 없습니다!",
      columns: [
        { title: "이름", field: "courseTitle", sorter: "string", width: 200 },
        { title: "단원 수", field: "chapterNumber", sorter: "number", width: 200 },
        { title: "과목", field: "subject", sorter: "string", width: 200 },
        { title: "학년", field: "grade", sorter: "string", width: 200 },
        { title: "진도율", field: "progress", sorter: "number", formatter: "progress" },
        // TODO: 최근 학습 날짜
        // pagehide 이벤트를 통해 구현
        // https://developer.chrome.com/docs/web-platform/page-lifecycle-api?hl=ko#legacy_lifecycle_apis_to_avoid
        // { title: "학습 날짜", field: "studyDate", sorter: "date", hozAlign: "center" },
      ],
    });
  }

  initTableEvents() {
    this.table.on("cellClick", this.handleCellClick.bind(this));
    this.table.on("cellTap", this.handleCellTap.bind(this));
  }

  getElement() {
    return this.elThis;
  }

  // ============ Handler ============
  handleCellClick(evt, cell) {
    const data = cell.getData();
    if (this.onCellClick) {
      this.onCellClick(data);
    }
  }

  handleCellTap(evt, cell) {
    const data = cell.getData();
    if (this.onCellTap) {
      this.onCellTap(data);
    }
  }

  // ============ API ============

  async setData(details, results) {
    this.tableData = this.composeTableData(details, results);

    this.table.setData(this.tableData);
  }

  composeTableData(details, results) {
    const tableData = [];
    const { length } = details;
    for (let i = 0; i < length; i++) {
      const detail = details[i];
      const result = results.find((result) => result.id_course === detail.courseId);
      const item = pick(details[i], ["courseTitle", "grade"]);
      this.services.setData(result);

      item.id = detail?.courseId;
      item.subject = this.changeSubjectFormat(detail.subject);
      item.chapterNumber = this.getChapterNumber(results[i]?.properties?.property);
      item.progress = this.services.composeTotalProgress();
      // item.studyDate = this.getStudyDate(results[i]);
      tableData.push(item);
    }

    return tableData;
  }

  activate() {
    this.elThis.classList.add("activate");
  }

  deactivate() {
    this.elThis.classList.remove("activate");
  }

  // ============ Utils ============
  parseAll(array, key = "properties") {
    return array?.map((data) => {
      if (isString(data[key])) {
        data[key] = JSON.parse(data[key]);
        return data;
      }
    });
  }

  getChapterNumber(result = []) {
    return result.filter(({ type }) => type === CourseTable.#CHAPTER_TYPE).length ?? 0;
  }

  getProgress(result) {
    const progressSum = result
      .filter(({ type, progress }) => type !== CourseTable.#CHAPTER_TYPE && progress)
      .reduce((sum, data) => sum + data.progress, 0);
    console.log(progressSum);

    const branchCount = result.filter(({ type, progress }) => type !== CourseTable.#CHAPTER_TYPE && progress).length;
    const progressMax = branchCount * 100;

    return progressMax === 0 ? 0 : Math.floor((progressSum / progressMax) * 100);
  }

  getStudyDate(result) {
    //
  }

  // ============ Utils ============
  changeSubjectFormat(subject) {
    const subjectFormat = {
      kor: "국어",
      eng: "영어",
      math: "수학",
      sci: "과학",
      info: "정보",
    };

    return subjectFormat.hasOwnProperty(subject) ? subjectFormat[subject] : "";
  }

  sumArrayWithCondition(array, condition, target) {
    console.log(condition);
    return array.filter(condition).reduce((sum, data) => sum + data[target]);
  }
}
