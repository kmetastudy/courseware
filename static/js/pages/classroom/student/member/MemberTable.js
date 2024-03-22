import elem from "../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { isFunction } from "../../../../core/utils/type";
import { drawTable } from "../../utils/drawTable";
export class MemberTable {
  constructor({ ...rest } = {}) {
    this.tableData = null;
    this.rowSelection = null;
    this.TYPE_NAMES = {
      0: "익명",
      1: "관리자",
      2: "오퍼레이터",
      4: "제작자",
      8: "선생님",
      16: "학생",
      32: "학부모",
      64: "사용자",
      128: "매니저",
    };

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("section", { class: "col-span-12 bg-base-200 lg:col-span-8" });

    // Table Toolbar
    this.elToolbar = elem("header", {
      class: "flex justify-between mb-4 p-1 items-center rounded-lg bg-base-100 gap-2 lg:gap-4",
    });
    this.elThis.append(this.elToolbar);

    this.elSearch = elem("div");
    this.elSearchInput = elem("input", {
      class: "input input-bordered input-sm rounded-lg max-sm:w-24",
      type: "text",
      placeholder: this.placeholder,
    });
    this.elSearch.append(this.elSearchInput);

    this.elButtonContainer = elem("div", { class: "p-2", on: { click: this.handleAddClick.bind(this) } });
    this.elPlusButton = MtuIcon("plus", { style: { fontSize: "20px" } });
    this.elPlusButton.classList.add("cursor-pointer");
    this.elButtonContainer.append(this.elPlusButton);

    this.elToolbar.append(this.elSearch, this.elButtonContainer);

    // Modal for Invitation
    this.elDialog = elem("dialog", { class: "modal" });
    //

    // Table
    this.elTableWrapper = elem("div", { class: "overflow-x-auto bg-white rounded-lg" });
    this.elThis.append(this.elTableWrapper);

    this.elTable = elem("table", { class: "table table-xs" });
    this.elTableWrapper.append(this.elTable);
  }

  initTable({ data }) {
    this.tableData = data;

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
      columnHelper.accessor("full_name", {
        id: "full_name",
        header: "이름",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        id: "email",
        header: "이메일",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("type", {
        id: "type",
        header: "유형",
        cell: (info) => {
          const type = info.getValue();
          return this.TYPE_NAMES[type] ?? this.TYPE_NAMES[0];
        },
      }),
      columnHelper.accessor("created_date", {
        id: "created_date",
        header: "참여 날짜",
        cell: (info) => {
          const date = info.getValue();
          return dayjs(date).format("YYYY-MM-DD");
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
  }

  // Handler
  handleAddClick(evt) {
    //
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
