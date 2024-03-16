import elem from "../../../../../core/utils/elem/elem";
import { classNames } from "../../../../../core/utils/class-names";
import { isFunction } from "../../../../../core/utils/type";
import { createTable, renderTable } from "../../../../../core/component/TanStackTable";
import { setNextElement, setPreviousElement } from "../../../../../core/component/TanStackTable/pagination";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";

export class ClassCourseAssignTable {
  constructor({ onToggleChange, onSingleDateChange }) {
    this.data = null;
    this.table = null;
    this.onToggleChange = onToggleChange;
    this.onSingleDateChange = onSingleDateChange;

    this.init();
  }

  init() {
    this.initTableOption();

    this.create();
  }

  initTableOption() {
    const { getCoreRowModel, getPaginationRowModel } = TableCore;

    this.defaultTableOptions = {
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize: 12,
        },
      },
      onStateChange: () => {
        renderTable({
          tableElement: this.elTable,
          table: this.table,
          previousButton: this.prevButton,
          nextButton: this.nextButton,
        });
      },
    };
  }

  create() {
    this.elThis = elem("div", { class: "overflow-x-auto col-span-12 bg-white rounded-lg" });

    this.elTable = elem("table", { class: "table table-pin-rows table-pin-cols" });
    this.elThis.append(this.elTable);

    this.elPaginationControllers = elem("div", { class: "flex mt-2 p-2" });
    this.elThis.append(this.elPaginationControllers);

    this.elPageSizeContainer = elem("div", { class: "grow flex justify-content gap-2" });
    this.elPaginationControllers.append(this.elPageSizeContainer);

    this.elPageIndexContainer = elem("div", { class: "align-end flex justify-content gap-2" });
    this.elPaginationControllers.append(this.elPageIndexContainer);
  }

  initTable(data, users) {
    this.data = data;

    this.columns = this.setColumns(data, users);

    this.table = createTable({
      data: this.data,
      columns: this.columns,
      ...this.defaultTableOptions,
    });

    this.renderPageIndexElements();

    renderTable({
      tableElement: this.elTable,
      table: this.table,
      previousButton: this.prevButton,
      nextButton: this.nextButton,
    });
  }

  setColumns(data, users) {
    const columnHelper = TableCore.createColumnHelper();

    const columns = [
      columnHelper.accessor("scheduler", {
        id: "contentTitle",
        header: "수업명",
        cell: (info) => {
          const scheduler = info.getValue();
          return scheduler.title;
        },
      }),
      columnHelper.group({
        header: "학생",
        columns: users.map((user, index) => {
          return columnHelper.accessor("members", {
            id: user.id,
            header: user.full_name,
            cell: (info) => {
              const assignDate = info.getValue().find((members) => (members.id = user.id)).date;
              return this.utcToLocalString(assignDate);
            },
          });
        }),
      }),
    ];

    return columns;
  }

  renderPageIndexElements() {
    this.prevButton = elem("button", { class: "btn btn-ghost btn-square btn-xs" }, MtuIcon("left"));
    setPreviousElement(this.prevButton, this.table);

    const totalPageIndex = this.table.getPageCount();
    let pageIndexes = Array.from({ length: totalPageIndex }, (_, i) => i + 1);

    const pageIndexElements = pageIndexes.map((page) =>
      elem(
        "button",
        {
          class: "btn btn-ghost btn-square btn-xs",
          on: {
            click: this.handleIndexButtonClick.bind(this, page),
          },
        },
        page,
      ),
    );
    this.pageIndexElements = pageIndexElements;

    this.nextButton = elem("button", { class: "btn btn-ghost btn-square btn-xs" }, MtuIcon("right"));
    setNextElement(this.nextButton, this.table);

    this.elPageIndexContainer.append(this.prevButton, ...pageIndexElements, this.nextButton);
  }

  handleIndexButtonClick(page, evt) {
    this.table.setPageIndex(page - 1);

    const selectedButton = evt.currentTarget;
    this.changeIndexFocus(selectedButton);
  }

  changeIndexFocus(selectedButton) {
    this.pageIndexElements.forEach((elIndex) => elIndex.classList.remove("focus"));

    selectedButton.classList.add("focus");
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

  utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
  }
}
