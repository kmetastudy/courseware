import { createElement } from "../../../../core/utils/dom-utils";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import isObject from "../../../../core/utils/type/isObject";
import { classNames } from "../../../../core/utils/class-names";

import { dashboardHeader } from "../common/dashboard-header";

export class CourseResultsTable {
  constructor(prefixCls) {
    this.prefixCls = prefixCls;
    this.rootPrefixCls = "course-result-table";

    this.init();
  }

  init() {
    this.setup();
    this.create();
  }

  setup() {
    this.videoIcon = MtuIcon("youtube");
    this.title = "결과 보기";
    this.anchorTitle = "수업듣기";
    this.url = "#";
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.rootPrefixCls, this.prefixCls) });

    this.elHeader = dashboardHeader({
      className: `${this.rootPrefixCls}-header`,
      title: { title: this.title, className: `${this.rootPrefixCls}-title` },
      anchor: { className: `${this.rootPrefixCls}-anchor`, title: this.anchorTitle, url: this.url },
    });

    this.elBody = createElement("div", { className: `${this.rootPrefixCls}-body` });

    this.elTable = createElement("div");
    this.elBody.append(this.elTable);

    this.elThis.append(this.elHeader, this.elBody);
  }

  setData(data) {
    if (isObject(data) === false) {
      return;
    }

    this.data = data;

    this.columns = this.composeColumns(data);

    this.tableData = this.composeTableData(data);

    this.render(this.tableData, this.columns);
  }

  composeTableData(data) {
    const tableData = [];
    let lastChapterItem = null;

    data.forEach((item) => {
      if (item.type === 0) {
        const chapterItem = { title: item.title, _children: [] };

        lastChapterItem = chapterItem;

        tableData.push(chapterItem);
      } else if (lastChapterItem) {
        //
        const branchItem = { title: item.title };

        const combinedTypes = item.units.reduce((acc, value) => acc.concat(value.types), []);
        const combinedResults = item.results.reduce((acc, value) => acc.concat(value.result), []);
        const combinedRepeats = item.results.reduce((acc, value) => acc.concat(value.repeat), []);

        for (let i = 1; i < combinedRepeats.length + 1; i++) {
          const [type, result, repeat] = [combinedTypes[i - 1], combinedResults[i - 1], combinedRepeats[i - 1]];
          if (type === "v") {
            branchItem[`result-${i}`] = this.videoIcon;
          } else if (repeat === 0) {
            branchItem[`result-${i}`] = result; //"?"
          } else if (result === "O") {
            branchItem[`result-${i}`] = repeat === 1 ? result : this.getCircledNumberUnicode(repeat);
          }
        }

        lastChapterItem._children.push(branchItem);
      }
    });

    return tableData;
  }

  composeColumns(data) {
    const columns = [{ title: "제목", field: "title", headerSort: false }];
    const contentMax = this.findContentMax(data);

    for (var i = 1; i < contentMax; i++) {
      const column = { title: i, field: `result-${i}`, headerSort: false, formatter: "html" };
      columns.push(column);
    }

    return columns;
  }

  findContentMax(arr) {
    let maxLength = 0;

    arr.forEach((item) => {
      let sumOfTypesLength = 0;
      item?.units?.forEach((subItem) => {
        if (subItem.types) {
          sumOfTypesLength += subItem.types.length;
        }
      });

      if (sumOfTypesLength > maxLength) {
        maxLength = sumOfTypesLength;
      }
    });

    return maxLength;
  }

  render(data, columns) {
    this.table = new Tabulator(this.elTable, {
      data,
      dataTree: true,
      dataTreeSort: false,
      dataTreeStartExpanded: false,
      dataTreeElementColumn: "title",
      columns,
    });
  }

  getElement() {
    return this.elThis;
  }

  // ============ Utils ============
  /**
   *
   * @param {number} n 0 < n <=20
   * @returns
   */
  getCircledNumberUnicode(n) {
    if (n < 1 || n > 20) {
      // throw new Error("Number must be between 1 and 20.");
      return this.getCircledNumberUnicode(20);
    }
    // U+2460의 코드 포인트는 9312이며, 여기에 (n - 1)을 더함
    const codePoint = 9312 + (n - 1);
    return String.fromCharCode(codePoint);
  }
}
