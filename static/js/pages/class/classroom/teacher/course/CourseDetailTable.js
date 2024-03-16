import elem from "../../../../core/utils/elem/elem";
import { pick } from "../../../../core/utils/_utils";
import { drawTable } from "../../utils/drawTable";
import { formatSubject } from "../../utils/formatSubject";
import { isFunction } from "../../../../core/utils/type";
import { mtoEvents } from "../../../../core/utils/mto-events";
import store from "../../common/Store";

export class CourseDetailTable {
  constructor() {
    this.tableData = null;
    this.rowSelection = null;
    this.elCheckAll = null; // check all checkbox element

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("div", { class: "overflow-x-auto col-span-12 bg-white rounded-lg" });
    this.elTable = elem("table", { class: "table" });
    this.elThis.append(this.elTable);
  }

  initTable(courses, details) {
    this.courses = courses;
    this.details = details;

    this.tableData = this.composeTableData(details);

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

    drawTable({ rootElement: this.elTable, tableModel: this.table });
    // this.elTable = drawTable({ rootElement: this.elTable, table: this.table });
  }

  composeTableData(details) {
    return details.map((detail) => {
      const row = pick(detail, ["courseId", "courseTitle", "desc", "grade", "subject"]);
      for (let key in row) {
        if (row[key] === "null") {
          row[key] = null;
        }
        if (key === "subject") {
          row[key] = formatSubject(row[key]);
        }
      }
      return row;
    });
  }

  setColumns() {
    const columnHelper = TableCore.createColumnHelper();

    return [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          this.elCheckAll = elem("input", {
            class: "checkbox",
            type: "checkbox",
            on: {
              change: table.getToggleAllRowsSelectedHandler(),
              change: this.handleCheckAll.bind(this),
            },
          });

          return this.elCheckAll;
        },
        cell: ({ row }) => {
          const cell = elem("input", {
            class: "checkbox",
            type: "checkbox",
            on: {
              change: row.getToggleSelectedHandler(),
            },
          });
          row.element = cell;
          return cell;
        },
      }),
      columnHelper.accessor("courseTitle", {
        id: "courseTitle",
        header: "제목",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("subject", {
        id: "subject",
        header: "과목",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("desc", {
        id: "desc",
        header: "설명",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("grade", {
        id: "grade",
        header: "학년",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("courseId", {
        id: "assign",
        header: "일정 부여하기",
        cell: (info) =>
          elem(
            "button",
            {
              class: "btn btn-sm btn-outline",
              on: {
                click: this.handleClickAssignButton.bind(this, info.getValue()),
              },
            },
            "Assign",
          ),
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
  }

  /**
   * Triggered when Check All Checkbox is changed
   * @param {*} evt
   */
  handleCheckAll(evt) {
    const updatedRowSelection = {};

    const shouldCheckAll = this.elCheckAll.checked;
    const elCheckboxes = this.table.getRowModel().flatRows.map((row) => row.element);

    elCheckboxes.forEach((elCheckbox, index) => {
      if (shouldCheckAll) {
        updatedRowSelection[index] = shouldCheckAll;
      }
      return (elCheckbox.checked = shouldCheckAll);
    });

    this.state.rowSelection = updatedRowSelection;
    this.table.setState(this.state);
  }

  handleClickAssignButton(courseId) {
    const router = store.getState("router");
    console.log(router);
    router.navigate(`#/course/assign/${courseId}`);
  }

  getElement() {
    return this.elThis;
  }
}
