import elem from "../../../../../core/utils/elem/elem";
import { createTable, renderTable } from "../../../../../core/component/TanStackTable";
export class TodoStudyCard {
  constructor() {
    this.table = null;
    this.init();
  }

  init() {
    this.tableOption = this.initTableOption();

    this.create();
  }

  initTableOption() {
    const { getCoreRowModel } = TableCore;

    const tableOption = {
      getCoreRowModel: getCoreRowModel(),
      initialState: {
        // pagination: {},
      },
      onStateChange: () => {
        renderTable({
          tableElement: this.elTable,
          table: this.table,
        });
      },
    };

    return tableOption;
  }

  create() {
    this.elThis = elem("section", { class: "card col-span-12 overflow-hidden bg-base-100 shadow-sm xl:col-span-8" });

    // Title
    this.elCardBody = elem("div", { class: "card-body grow-0" });
    this.elThis.append(this.elCardBody);

    this.elCardTitleWrapper = elem("h2", { class: "card-title" });
    this.elCardBody.append(this.elCardTitleWrapper);

    this.elCardTitle = elem("a", { class: "link-hover link" }, "오늘 진행할 수업");
    this.elCardTitleWrapper.append(this.elCardTitle);

    // 할일
    this.elTableWrapper = elem("div", { class: "overflow-x-auto px-2" });
    this.elThis.append(this.elTableWrapper);

    this.elTable = elem("table", { class: "table hidden" });
    this.elTableWrapper.append(this.elTable);

    // Empty todo
    this.elEmptyTodo = elem("span", "예정된 할 일이 없습니다");
    this.elTableWrapper.append(this.elEmptyTodo);
  }

  updateData(data) {
    if (!data) {
      this.showTable(false);
      return;
    }

    this.data = data;
    const columns = this.setColumns();

    this.setTable(data, columns);

    this.showTable();
  }

  setColumns() {
    const columnHelper = TableCore.createColumnHelper();

    const columns = [
      columnHelper.accessor("period", {
        id: "period",
        header: "차시",
        cell: (info) => {
          const period = info.getValue();
          return period ? `${period} 차시` : "";
        },
      }),
      columnHelper.accessor("title", {
        id: "title",
        header: "제목",
        cell: (info) => info.getValue() ?? "",
      }),
      columnHelper.accessor("type", {
        id: "type",
        header: "유형",
        cell: (info) => this.formatType(info.getValue()),
      }),
      columnHelper.accessor("progress", {
        id: "progress",
        header: "진행률",
        cell: (info) => {
          const progress = info.getValue();
          return progress ? `${progress} %` : `시작하지 않음`;
        },
      }),
      columnHelper.accessor("point", {
        id: "point",
        header: "점수",
        cell: (info) => {
          const point = info.getValue();
          return point ? `${point} 점` : `시작하지 않음`;
        },
      }),
      columnHelper.accessor("id", {
        id: "button",
        header: "바로가기",
        cell: (info) => {
          const branchId = info.getValue();
          if (!branchId) {
            return "";
          }

          const elButton = elem(
            "button",
            { class: "btn btn-sm btn-ghost", on: { click: this.handleButtonClick.bind(this, branchId) } },
            "바로가기",
          );

          console.log(elButton);
          return elButton;
        },
      }),
    ];

    return columns;
  }

  setTable(data, columns) {
    this.table = createTable({
      data,
      columns,
      ...this.tableOption,
    });

    renderTable({
      tableElement: this.elTable,
      table: this.table,
    });
  }

  showTable(showShow = true) {
    switch (showShow) {
      case true:
        this.elEmptyTodo.classList.add("hidden");
        this.elTable.classList.remove("hidden");
        break;
      case false:
        this.elTable.classList.add("hidden");
        this.elEmptyTodo.classList.remove("hidden");
        break;
    }
  }

  getElement() {
    return this.elThis;
  }
  // handler
  handleButtonClick(branchId, evt) {
    console.log(branchId);
    if (this.onButtonClick) {
      this.onButtonClick(branchId);
    }
  }

  // Utils

  formatType(type) {
    switch (type) {
      case 0:
        return "단원";
      case 11:
        return "테스트";
      case 12:
        return "레슨";
      case 13:
        return "시험";
      default:
        return "없음";
    }
  }
}
