import elem from "../../../../../core/utils/elem/elem";
import { classNames } from "../../../../../core/utils/class-names";
import { pick } from "../../../../../core/utils/_utils";
import { drawTable } from "../../../utils/drawTable";
import { isFunction } from "../../../../../core/utils/type";
import { DatePicker } from "../../../components/DatePicker";

export class CourseAssignTable {
  constructor({ onToggleChange, onSingleDateChange }) {
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
      columnHelper.accessor("title", {
        id: "title",
        header: "제목",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("show", {
        id: "show",
        header: "보기",
        cell: (info) => {
          const isShow = info.getValue();

          const elToggle = elem("input", {
            type: "checkbox",
            class: "toggle toggle-sm toggle-info",
            on: {
              change: this.handleToggle.bind(this, info),
            },
          });
          if (isShow) {
            elToggle.setAttribute("checked", "");
          }

          return elToggle;
        },
      }),
      columnHelper.accessor("date", {
        id: "date",
        header: "학습일",
        cell: (info) => {
          const date = info.getValue();
          let selectedDates = [];
          if (date !== "") {
            selectedDates.push(date);
          }
          if (info.row.index === 2) {
            console.log(selectedDates);
          }

          const elDatePicker = elem("input", {
            type: "text",
            class: classNames("input input-bordered input-xs", { hidden: date ? false : true }),
            readonly: "",
            placeholder: "날짜 수정하기",
            value: date,
          });
          new DatePicker({
            parent: elDatePicker,
            settings: {
              selected: { dates: selectedDates },
            },
            changeToInput: this.handleSingleDateChange.bind(this, info),
          });

          this.elDates.push(elDatePicker);

          return elDatePicker;
        },
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

  handleToggle(info, evt) {
    if (this.onToggleChange) {
      this.onToggleChange(info);
    }
  }

  handleSingleDateChange(cellApi, calendar, dayPicker) {
    if (this.onSingleDateChange) {
      this.onSingleDateChange(cellApi, calendar, dayPicker);
    }
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

  resetTableDates() {
    this.elDates.forEach((input) => input.value === "");
  }
}
