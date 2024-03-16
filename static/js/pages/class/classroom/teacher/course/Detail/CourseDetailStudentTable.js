import elem from "../../../../../core/utils/elem/elem";
import { classNames } from "../../../../../core/utils/class-names";
import { drawTable } from "../../../utils/drawTable";
import { isFunction } from "../../../../../core/utils/type";
import { DatePicker } from "../../../components/DatePicker";
import { MtuProgress } from "../../../../../core/mtu/progress/mtu-progress";

export class CourseDetailStudentTable {
  constructor({ onToggleChange, onSingleDateChange } = {}) {
    this.tableData = null;
    this.rowSelection = null;
    this.onToggleChange = onToggleChange;
    this.onSingleDateChange = onSingleDateChange;

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("div", { class: "overflow-x-auto col-span-12 bg-white rounded-lg" });
    this.elTable = elem("table", { class: "table table-xs" });
    this.elThis.append(this.elTable);
  }

  initTable({ data }) {
    this.tableData = data;
    this.elDates = [];

    this.state = {
      columnPinning: {},
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
      rowSelection: {},
    };

    this.columns = this.setColumns();

    this.createTable({ data: this.tableData, columns: this.columns, state: this.state });

    this.elTable = drawTable({ rootElement: this.elTable, tableModel: this.table });
    this.elTable.classList.add("table-sm");
  }

  setColumns() {
    const columnHelper = TableCore.createColumnHelper();

    return [
      columnHelper.accessor("name", {
        id: "name",
        header: "이름",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("registrationDate", {
        id: "registrationDate",
        header: "참여일",
        cell: (info) => {
          return info.getValue();
        },
      }),
      columnHelper.accessor("progress", {
        id: "progress",
        header: "진행률",
        cell: (info) => {
          const progress = info.getValue();
          const clProgressBar = new MtuProgress({ type: "line", percent: progress });
          const elProgressBar = clProgressBar.getElement();

          return elProgressBar;
        },
      }),
      columnHelper.accessor("recentStudyDate", {
        id: "recentStudyDate",
        header: "최근 학습 날짜",
        cell: (info) => info.getValue(),
      }),
    ];
  }

  createTable({ data, columns, state }) {
    this.table = TableCore.createTable({
      data,
      columns,
      getCoreRowModel: TableCore.getCoreRowModel(),
      state,
      enableRowSelection: true,
      onStateChange: (updaterOrValue) => {
        const updatedState = isFunction(updaterOrValue) ? updaterOrValue(this.table.getState()) : updaterOrValue;
        this.table.setOptions((prev) => ({
          ...prev,
          state: updatedState,
        }));

        this.state = this.table.getState();
      },
      renderFallbackValue: undefined,
      debugAll: false,
    });

    // console.log(this.table.getRowModel().rows.map((row) => row.getVisibleCells()));
    // console.log(this.table.getRowModel());
  }

  hide(shouldHide) {
    shouldHide ? this.elThis.classList.add("hidden") : this.elThis.classList.remove("hidden");
  }

  getElement() {
    return this.elThis;
  }

  getTable() {
    return this.table;
  }
}
