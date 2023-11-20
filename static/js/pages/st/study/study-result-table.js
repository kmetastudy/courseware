import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";

export class StudyResultTable {
  constructor(options) {
    this.options = options;
    this.id = "id-mtm-player-lesson-result-table-" + StudyResultTable.id++;

    this.elThis = null;

    this.elTable = null;
    this.elPagenation = null;
    this.tabulator = null;
    this.elColumnAddHeaderTitle = null;
    this.elColumnAddHeader = null;

    this.tests = {};
    this.tests.typeIndex = 0;
    this.selectedRow = null;

    this.activeField = 0;
    this.activeRow = 0;
    // this.fieldKey = ["video", "q1", "q2", "q3"];
    // this.columnField = ["video", "q1", "q2", "q3"];

    // this.f
    this.init();
  }

  init() {
    this.create();
    this.initTabulator();
  }

  create() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);

    this.elFlex = document.createElement("div");
    this.elFlex.setAttribute("class", "row d-flex justify-content-center");

    this.elWrapper = document.createElement("div");
    this.elWrapper.setAttribute("class", "mtv-tabulator-table col-12 col-md-10 col-lg-9 col-xl-8");

    this.elTable = document.createElement("div");
    this.elTable.classList.add("mtm-tabulator");

    this.elWrapper.appendChild(this.elTable);
    this.elFlex.appendChild(this.elWrapper);
    this.elThis.appendChild(this.elFlex);
  }

  initTabulator() {
    this.tabulator = new Tabulator(this.elTable, {
      selectable: false,
      layout: "fitColumns",
      reactiveData: true, //turn on data reactivity
      // data: mtmPlayerLessonResultTable.testdata,
      // columns: [
      //   { title: "순서 #", field: "no", headerSort: false, headerHozAlign: "center", hozAlign: "center" },
      //   {
      //     title: "영상",
      //     formatter: this.videoFormatter.bind(this),
      //     field: "video",
      //     headerSort: false,
      //     headerHozAlign: "center",
      //     hozAlign: "center",
      //     cellClick: this.clickActionVideoCell.bind(this),
      //   },
      //   {
      //     title: "예제1",
      //     formatter: this.typeFormatter.bind(this),
      //     field: "q1",
      //     headerSort: false,
      //     headerHozAlign: "center",
      //     hozAlign: "center",
      //   },
      //   {
      //     title: "예제2",
      //     formatter: this.typeFormatter.bind(this),
      //     field: "q2",
      //     headerSort: false,
      //     headerHozAlign: "center",
      //     hozAlign: "center",
      //   },
      //   {
      //     title: "예제3",
      //     formatter: this.typeFormatter.bind(this),
      //     field: "q3",
      //     headerSort: false,
      //     headerHozAlign: "center",
      //     hozAlign: "center",
      //   },
      // ],
    });

    this.setTabulatorEvents();
  }

  setTabulatorEvents() {
    this.tabulator.on("tableBuilt", this.handleTableBuilt.bind(this));
    this.tabulator.on("cellMouseEnter", this.handleCellMouseEnter.bind(this));
    this.tabulator.on("cellMouseLeave", this.handleCellMouseLeave.bind(this));
    this.tabulator.on("cellClick", this.handleCellClick.bind(this));
  }
  //////// Handler ////////
  handleTableBuilt() {
    const tableHolder = this.elThis.querySelector(".tabulator-tableholder");
    tableHolder.setAttribute("style", "overflow-x:hidden;");
    this.bInit = true;
  }

  handleCellMouseEnter(evt, cell) {
    const el = cell.getElement();
    if (cell.getValue() == "O" || (cell.getValue() == "X" && cell.getField() != "video") || cell.getValue() == "?") {
      el.style.backgroundColor = "rgb(255,255,0)";
      el.style.cursor = "pointer";
    }
  }

  handleCellMouseLeave(evt, cell) {
    const el = cell.getElement();
    el.style.backgroundColor = "";
    el.style.cursor = "default";
  }

  handleCellClick(evt, cell) {
    const row = cell.getRow();
    const row_no = row.getData().no;
    const column = cell.getColumn();
    const column_field = column.getField();
    const column_no = -1;
    const value = cell.getValue();
    if (row_no == "") return;

    for (let i = 0; i < this.columnField.length; i++) {
      if (column_field == this.columnField[i]) {
        column_no = i;
        break;
      }
    }

    if (column_no < 0) return;

    if (value != "O" && (value != "X" || cell.getField() == "video") && value != "?") {
      return;
    }

    if (this.options && this.options.eventCellClick)
      this.options.eventCellClick(column_no, parseInt(row_no) - 1, value);
  }

  //////// URL ////////
  //////// API ////////
  show(shouldShow) {
    if (shouldShow) {
      this.elThis.style.display = "block";

      const self = this;
      setTimeout(function () {
        self.tabulator.redraw(true);
      }, 0);
    } else {
      this.elThis.style.display = "none";
    }
  }
  createResults() {}
  setLessonResultList(elementsList, resultsList) {
    // elementsList : [{ids:[], types:[]}, ]
    // resultsList: [{result:[], repeat:[], first:[], seconds:[]}, ]
    this.listData = [];
    console.log(elementsList);
    console.log(resultsList);
    // 1. data 만든다 -> this.listData
    // 2.
    //
    // 이어하기
    let bContinue = false; // 이어하기 존재?
    let tContinue = ""; // 이어하기 타입?
    let iContiIndexUnit = -1;
    let iContiIndexItem = -1;
    // 마지막으로 한 Element Item (영상/문제)
    let bLast = false;
    let iIndexUnit = 0;
    let iIndexItem = 0;

    // 이게 왜이리 어렵냐?, Table 을 만드는 것은 쉬운데...
    for (let i = 0; i < elementsList.length; i++) {
      const elements = elementsList[i];
      const results = resultsList[i];
      const data = { no: i + 1, video: "X", q1: "", q2: "", q3: "" };
      if (resultsList.length > i && resultsList[i].result.length > 0) {
        iIndexUnit = i;
        iIndexItem = 0;
        for (const j = 0; j < elementsList[i].types.length; j++) {
          // if (j > 3) break;
          if (elementsList[i].types[j] == "v") {
            if (resultsList[i].result.length > j) {
              data.video = resultsList[i].result[j];
              iIndexItem = j + 1;
            } else {
              bLast = true;
              // break;
            }
          } else {
            if (resultsList[i].result.length > j) {
              data["q" + j] = resultsList[i].result[j];
              iIndexItem = j + 1;
            } else {
              bLast = true;
              // break;
            }
          }
        }
        // if(bLast)
        //     break;
      } else {
        // 마지막을 못 찾았고,
        if (!bLast) {
          // 현재의 마지막 이면,
          if (elementsList[iIndexUnit].types.length <= iIndexItem) iIndexUnit++;
          iIndexItem = 0;
          bLast = true;
        }
        // break;
      }
      this.listData.push(data);
    }

    // console.log('mtmPlayerLessonResultTable.>.setLessonResultList:',iIndexUnit, iIndexItem)
    // // 이어 하기 Element 가 존재 확인
    if (elementsList[iIndexUnit].types.length > iIndexItem) {
      // 마지막 Unit 에 존재하는가?
      bContinue = true;
      iContiIndexUnit = iIndexUnit;
      // iContiIndexItem = iIndexItem + 1;
      iContiIndexItem = iIndexItem;
      tContinue = elementsList[iContiIndexUnit].types[iContiIndexItem];
      const data = this.listData[iContiIndexUnit];
      if (tContinue == "v") data.video = "O";
      else data["q" + iContiIndexItem] = "?";
    }
    // 여기까지는 안 가는 것이 정상....
    else if (elementsList.length > iIndexUnit + 1) {
      // 다음 Unit 처음에 존재하는 가?
      iContiIndexUnit = iIndexUnit + 1;
      if (elementsList[iContiIndexUnit].types.length > 0) {
        bContinue = true;
        iContiIndexItem = 0;
        tContinue = elementsList[iContiIndexUnit].types[iContiIndexItem];
        const data = { no: i + 1, video: "X", q1: "", q2: "", q3: "" };

        if (tContinue == "v") data.video = "O";
        else data["q" + iContiIndexItem + 1] = "?";

        this.listData.push(data);
      }
    } else {
    }
    // break;
    this.tabulator.setData(this.listData);
    this.infoResult = {};

    this.infoResult.iLastIndexUnit = iIndexUnit;
    this.infoResult.iLastIndexItem = iIndexItem;
    this.infoResult.bContinue = bContinue;
    this.infoResult.tContinue = tContinue;
    this.infoResult.iContiIndexUnit = iContiIndexUnit;
    this.infoResult.iContiIndexItem = iContiIndexItem;
    this.infoResult.progress = 0;
    this.infoResult.point = 0;

    const self = this;
    setTimeout(function () {
      self.tabulator.redraw(true);
    }, 0);

    return this.infoResult;
  }
  //////// Utils ////////
}
