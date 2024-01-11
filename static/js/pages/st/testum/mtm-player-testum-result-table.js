// 테스텀의 결과를 보여주는 요소 - Table (Tabulator)
// 1) 항시 본문제-오답-쌍둥이-오답-세쌍둥이-오답 해야하나?
// 2) 오답하기 시, 하나씩 해야 하나? 혹은 오답 하기의 상태를 기억해야 한다.
import { mtmInputButton } from "../../../core/ui/input/mtm-input-button.js";

require("./mtm-player-testum-result-table.css");
export class mtmPlayerTestumResultTable {
  constructor(options) {
    this.id = "id-mtm-player-testum-result-table-" + mtmPlayerTestumResultTable.id++;
    this.elThis = null;

    this.options = options;

    // this.elThis = null;
    this.elTable = null;
    this.elPagenation = null;
    // this.options = options;
    this.tabulator = null;
    this.elColumnAddHeaderTitle = null;
    this.elColumnAddHeader = null;

    this.tests = {};
    this.tests.typeIndex = 0;
    this.selectedRow = null;

    this.activeField = 0;

    this._prepareButtons();
    // this.fieldKey = ["main","main_w","sub","sub_w","last","last_w"];
    this._init();
  }

  onMainHandler(e) {
    // console.log('mtmPlayerTestumResultTable > onMainHandler');
    e.preventDefault();
    e.stopPropagation();
    if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(0);
  }

  onMainWrongHandler(e) {
    // console.log('mtmPlayerTestumResultTable > onMainWrongHandler');
    e.preventDefault();
    e.stopPropagation();
    if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(1);
  }

  onSubHandler(e) {
    // console.log('mtmPlayerTestumResultTable > onSubHandler');
    e.preventDefault();
    e.stopPropagation();
    if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(2);
  }

  onSubWrongHandler(e) {
    // console.log('mtmPlayerTestumResultTable > onSubWrongHandler');
    e.preventDefault();
    e.stopPropagation();
    if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(3);
  }

  onLastHandler(e) {
    // console.log('mtmPlayerTestumResultTable > onLastHandler');
    e.preventDefault();
    e.stopPropagation();
    if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(4);
  }

  onLastWrongHandler(e) {
    // console.log('mtmPlayerTestumResultTable > onLastWrongHandler');
    e.preventDefault();
    e.stopPropagation();
    if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(5);
  }

  typeFormatter(cell, formatterParams) {
    var el = cell.getElement();

    // console.log('data : ', cell.getData().code);
    var value = cell.getValue();
    var field = cell.getField();
    var column_num = -1;
    for (var i = 0; i < mtmPlayerTestumResultTable.firstData.length; i++) {
      if (value == mtmPlayerTestumResultTable.firstData[i]) {
        // var clActionButton = this.clActionButtons[i].elThis;
        return this.clActionButtons[i].elThis;
      }

      if (field == mtmPlayerTestumResultTable.columnField[i]) column_num = i;
    }

    if (cell.getValue() == "O") el.style.color = "blue";
    else if (cell.getValue() == "X") {
      if (column_num >= 0 && column_num % 2 == 0) el.style.color = "gray";
      else el.style.color = "red";
    } else if (cell.getValue() == "?") el.style.color = "red";

    // var column = cell.getColumn();
    if (cell.getField() == mtmPlayerTestumResultTable.columnField[this.activeField]) {
      el.style.backgroundColor = "rgba(200,200,200,0.6)";
      // el.style.border  = '1px solid #888';
    }

    return cell.getValue();
  }
  blankFormatter(cell, formatterParams, onRendered) {
    //plain text value
    // blankFormatter
    return "";
  }

  tableBuilt() {
    var tableHolder = $(this.elThis).find(".tabulator-tableholder");
    // console.log('tableHolder : ', tableHolder);
    $(tableHolder).css("overflow-x", "hidden");
    // this.elColumnAddHeader = this.elColumnAddHeaderTitle.parentElement.parentElement.parentElement;
    // this.elColumnAddHeader.classList.add('mtv-tabulator-button');
  }

  _prepare() {}

  _prepareButtons() {
    // Array 로 하면 좋지 않나?
    var optionsMain = {};
    this.clActionButtons = [];
    optionsMain.eventHandler = this.onMainHandler.bind(this);
    optionsMain.text = " 본";
    optionsMain.iClass = "fa-solid fa-wand-magic-sparkles";
    optionsMain.btnClass = "mtm-input-button mtm-input-button-theme mtm-btn-sm";
    optionsMain.RemoveMarginLeft = true;
    this.clMainButton = new mtmInputButton(optionsMain);
    this.clActionButtons.push(this.clMainButton);

    var optionsMainWrong = {};
    optionsMainWrong.eventHandler = this.onMainWrongHandler.bind(this);
    optionsMainWrong.text = " 오답";
    optionsMainWrong.iClass = "fa-regular fa-circle-question";
    optionsMainWrong.btnClass = "mtm-input-button mtm-input-button-theme mtm-btn-sm";
    optionsMainWrong.RemoveMarginLeft = true;
    this.clMainWrongButton = new mtmInputButton(optionsMainWrong);
    this.clActionButtons.push(this.clMainWrongButton);

    var optionsSub = {};
    optionsSub.eventHandler = this.onSubHandler.bind(this);
    optionsSub.text = " 쌍";
    optionsSub.btnClass = "mtm-input-button mtm-input-button-theme mtm-btn-sm";
    optionsSub.iClass = "fa-solid fa-wand-magic-sparkles";
    optionsSub.RemoveMarginLeft = true;
    this.clSubButton = new mtmInputButton(optionsSub);
    this.clActionButtons.push(this.clSubButton);

    var optionsSubWrong = {};
    optionsSubWrong.eventHandler = this.onSubWrongHandler.bind(this);
    optionsSubWrong.text = " 오답";
    optionsSubWrong.iClass = "fa-regular fa-circle-question";
    optionsSubWrong.btnClass = "mtm-input-button mtm-input-button-theme mtm-btn-sm";
    optionsSubWrong.RemoveMarginLeft = true;
    this.clSubWrongButton = new mtmInputButton(optionsSubWrong);
    this.clActionButtons.push(this.clSubWrongButton);

    var optionsLast = {};
    optionsLast.eventHandler = this.onLastHandler.bind(this);
    optionsLast.text = " 막";
    optionsLast.iClass = "fa-solid fa-wand-magic-sparkles";
    optionsLast.btnClass = "mtm-input-button mtm-input-button-theme mtm-btn-sm";
    optionsLast.RemoveMarginLeft = true;
    this.clLastButton = new mtmInputButton(optionsLast);
    this.clActionButtons.push(this.clLastButton);

    var optionsLastWrong = {};
    optionsLastWrong.eventHandler = this.onLastWrongHandler.bind(this);
    optionsLastWrong.text = " 오답";
    optionsLastWrong.iClass = "fa-regular fa-circle-question";
    optionsLastWrong.btnClass = "mtm-input-button mtm-input-button-theme mtm-btn-sm";
    optionsLastWrong.RemoveMarginLeft = true;
    this.clLastWrongButton = new mtmInputButton(optionsLastWrong);
    this.clActionButtons.push(this.clLastWrongButton);
  }

  _init() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);
    this.elThis.setAttribute("class", "mtm-tabulator-table");

    this.elFlex = document.createElement("div");
    this.elFlex.setAttribute("class", "mtm-player-testum-result-tables-flexbox");

    this.elWrapper = document.createElement("div");
    this.elWrapper.setAttribute("class", "mtm-player-testum-result-tables-wrapper");

    this.elTable = document.createElement("div");
    this.elTable.classList.add("mtm-tabulator");

    this.elWrapper.appendChild(this.elTable);
    this.elFlex.appendChild(this.elWrapper);
    this.elThis.appendChild(this.elFlex);
    // this.elThis.appendChild(this.elPagenationTop);
    this._create();
  }

  pageCount(pageSize, currentRow, currentPage, totalRows, totalPages) {
    // this.elPageCounter.innerHTML =  "Showing " + pageSize +  " rows of " + totalRows + " total";
    this.elPageCounter.innerHTML =
      "Showing " + currentRow + " - " + (parseInt(currentRow) + parseInt(pageSize) - 1) + " of " + totalRows;
    // if(totalRows)
    //     this.tabulator.setPage(parseInt(totalRows/10) + 1);
    return "Showing " + pageSize + " rows of " + totalRows + " total";
  }

  cellMouseEnter(e, cell) {
    var el = cell.getElement();
    var field = cell.getField();
    var column_num = -1;

    if (cell.getValue() == "?") {
      el.style.backgroundColor = "rgb(255,255,0)";
      el.style.cursor = "pointer";
    } else {
      for (var i = 0; i < mtmPlayerTestumResultTable.columnField.length; i++) {
        if (field == mtmPlayerTestumResultTable.columnField[i]) {
          column_num = i;
          break;
        }
      }

      if (column_num >= 0) {
        // if(column_num >= 0)
        // 본,쌍,막 에는 'O' 만 들어 갈 수 있음
        if (column_num % 2 == 0) {
          if (cell.getValue() == "O") {
            el.style.backgroundColor = "rgb(255,255,0)";
            el.style.cursor = "pointer";
          }
        }

        // 나머지는 '?' 'O' 'X' 모두 가능 , Blank 만 빼고,
        else if (cell.getValue() == "?" || cell.getValue() == "O" || cell.getValue() == "X") {
          el.style.backgroundColor = "rgb(255,255,0)";
          el.style.cursor = "pointer";
        }
      }
    }
  }

  cellMouseLeave(e, cell) {
    var el = cell.getElement();

    var no = cell.getData().no; //cell index (return integer)

    // FIX
    // el returns false
    // Tabulator은 VirtaulDom을 사용하는데, 그로 인해 문제가 생기는듯하다.
    if (!el) {
      return;
    }

    if (no) {
      if (cell.getField() == mtmPlayerTestumResultTable.columnField[this.activeField])
        el.style.backgroundColor = "rgba(200,200,200,0.6)";
      else el.style.backgroundColor = "";
      el.style.cursor = "default";
    }
  }

  cellClick(e, cell) {
    var el = cell.getElement();
    // if(el.style.cursor != 'pointer')
    //     return;
    var row = cell.getRow();
    var row_no = row.getData().no;
    var column = cell.getColumn();
    var column_field = column.getField();
    var column_no = -1;
    var value = cell.getValue();

    //
    console.log("mtmPlayerTestumResultTable > cellClick 0");
    if (row_no == "") return;

    for (var i = 0; i < mtmPlayerTestumResultTable.columnField.length; i++) {
      if (column_field == mtmPlayerTestumResultTable.columnField[i]) {
        column_no = i;
        break;
      }
    }
    console.log("mtmPlayerTestumResultTable > cellClick 1");

    if (column_no < 0) return;

    if (column_no % 2 == 0) {
      console.log("mtmPlayerTestumResultTable > cellClick 2 :", value);

      if (value != "O" && value != "?") return;
    } else if (value != "?" && value != "O" && value != "X") {
      console.log("mtmPlayerTestumResultTable > cellClick 3");
      return;
    }
    // setTimeout ???
    if (this.options && this.options.eventCellClick)
      this.options.eventCellClick(column_no, parseInt(row_no) - 1, value);

    // console.log('mtmPlayerTestumResultTable > cellClick :',row_no,column_no);
  }

  clickRow(e, row) {
    // console.log(row);
    if (this.selectedRow) {
      this.selectedRow.getElement().style.backgroundColor = "";
    }

    this.selectedRow = row;
    this.selectedRow.getElement().style.backgroundColor = "#00ff00";

    var data = {};
    data.type = this.selectedRow.getData().type;

    if (this.options && this.options.eventClickRow) this.options.eventClickRow(data);
  }
  clickActionAddHeader(e, column) {
    e.preventDefault();
    e.stopPropagation();
    // console.log('Add new data for:');
    var typeLetter = "T";
    var titleName = "테스트 ";

    if (this.tests.typeIndex % 2) {
      typeLetter = "L";
      titleName = "레슨 ";
    }
    this.tests.typeIndex++;
    titleName += this.tests.typeIndex;

    var data = {
      type: typeLetter,
      point: parseInt(Math.random() * 100) % 100,
      percent: parseInt(Math.random() * 100) % 100,
      title: titleName,
    };

    this.tabulator.addRow(data);

    // var lastPage = this.tabulator.getPageMax();
    // this.tabulator.setPage(lastPage);
    return false;
  }

  _create() {
    // https://jsfiddle.net/8hcjbatz/
    // Exclude Groups from Pagination
    // https://codepen.io/lukeorriss/pen/dyZwwez
    // this.tabulator = new Tabulator("#"+this.id, {
    this.tabulator = new Tabulator(this.elTable, {
      // tableBuilt: this.tableBuilt.bind(this),
      // tableBuiling: this.tableBuilding.bind(this),
      // height:"100%",
      // maxHeight:"100%",
      // maxHeight : 333,
      // maxHeight: (33+30*15),
      // minWidth : 24,
      // printAsHtml:true, //enable html table printing
      // printStyled:true, //copy Tabulator styling to HTML table
      selectable: false,
      // height : 333,
      layout: "fitColumns",
      // layout:"fitDataTable",
      reactiveData: true, //turn on data reactivity
      data: mtmPlayerTestumResultTable.testdata, //load data into table

      // minHeight:333, //do not let table get smaller than 300 px heigh
      // (title:(29+4)=33, items :(30x10) = 300) - total = 333
      // 2) Alignment
      // Column Header Alignment
      // Data Alignment
      columns: [
        { title: "문제 #", field: "no", headerSort: false, headerHozAlign: "center", hozAlign: "center" },
        {
          title: "본문제",
          formatter: this.typeFormatter.bind(this),
          field: "main",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        {
          title: "오답",
          formatter: this.typeFormatter.bind(this),
          field: "main_w",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        {
          title: "쌍둥이",
          formatter: this.typeFormatter.bind(this),
          field: "sub",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        {
          title: "오답",
          formatter: this.typeFormatter.bind(this),
          field: "sub_w",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        {
          title: "마지막",
          formatter: this.typeFormatter.bind(this),
          field: "last",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        {
          title: "오답",
          formatter: this.typeFormatter.bind(this),
          field: "last_w",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
      ],
      // version 5.2
      // rowClick: this.clickRow.bind(this),
      // function(e, row){
      //     //e - the click event object
      //     //row - row component
      //     console.log(row);
      // },
    });

    this.tabulator.on("tableBuilt", this.tableBuilt.bind(this));
    // version 5.1
    // this.tabulator.on("rowClick", this.clickRow.bind(this));
    this.tabulator.on("cellMouseEnter", this.cellMouseEnter.bind(this));
    this.tabulator.on("cellMouseLeave", this.cellMouseLeave.bind(this));
    this.tabulator.on("cellClick", this.cellClick.bind(this));
  }

  _prepareData(size) {
    this.resultList = [];
    for (var i = 0; i < size; i++) {
      this.resultList.push({
        no: i + 1,
        main: "",
        main_w: "",
        sub: "",
        sub_w: "",
        last: "",
        last_w: "",
      });
    }
  }

  _showActionButtons(bShowList) {
    // this.clMainButton.elThis
    // console.log('_showActionButton : ', this.showButtonList);
    for (var i = 0; i < this.showButtonList.length; i++) {
      var clButton = this.clActionButtons[i];
      clButton.setGrayDisable();
      // 아직 안한것 ('?')
      if (this.showButtonList[i].notyet > 0) {
        clButton.setEnable(true);
      }
    }

    // if(this.showButtonList[0])
    // {
    //     // this.clMainButton.elThis.style.visibility = 'hidden';
    //     this.clMainButton.setGrayDisable();
    //     if(this.showButtonList[0].notyet > 0)
    //     {
    //         // this.clMainButton.elThis.style.visibility = 'visible';
    //         this.clMainButton.setEnable(true);
    //     }
    // }
  }
  //////////////////////// API ///////////////////////
  showActionButtons(bShowList) {
    this._showActionButtons(bShowList);
  }

  show(bShow) {
    if (bShow) {
      this.elThis.style.display = "block";
      var self = this;
      setTimeout(function () {
        self.tabulator.redraw(true);
      }, 0);
    } else this.elThis.style.display = "none";
  }

  // mtmPlayerTestumResultTable.prototype.setResultTable = function(tryResult) {
  //     this.tabulator.clearData();
  //     this.resultList = tryResult;
  //     // console.log('mtmPlayerTestumResultTable > setResultTable : ',this.resultList);
  //     for(var i =0;i<this.resultList.length;i++)
  //     {
  //         this.tabulator.addRow(this.resultList[i],false);   // add to bottom
  //     }
  // }

  setResultTable(resultTableList) {
    this.tabulator.clearData();

    // this._create(resultTableList);
    // var key_list = ["main","main_w","sub","sub_w","last","last_w"];
    //
    // mtmPlayerTestumResultTable.columnField
    // 모든 컬럼을 안보이게 한다음.
    for (var i = 0; i < mtmPlayerTestumResultTable.columnField.length; i++) {
      this.tabulator.hideColumn(mtmPlayerTestumResultTable.columnField[i]);
    }

    // 버튼 Row 더하기
    var firstData = { no: "", main: "M", main_w: "MW", sub: "S", sub_w: "SW", last: "L", last_w: "LW" };
    this.tabulator.addRow(firstData, false); // add to bottom

    this.resultList = resultTableList;
    // console.log('mtmPlayerTestumResultTable > setResultTable : ', this.resultList);
    this.showButtonList = [];
    for (var i = 0; i < this.resultList.length; i++) {
      var list = this.resultList[i];
      var data = {};
      data["no"] = i + 1;
      for (var j = 0; j < list.length; j++) {
        var key = mtmPlayerTestumResultTable.columnField[j];
        if (!this.showButtonList[j]) {
          this.showButtonList[j] = { correct: 0, wrong: 0, notyet: 0 };
        }

        if (list[j] == "-") data[key] = "";
        else {
          data[key] = list[j];
          if (list[j] == "O") this.showButtonList[j].correct++;
          else if (list[j] == "X") this.showButtonList[j].wrong++;
          else if (list[j] == "?") this.showButtonList[j].notyet++;
        }
      }

      // console.log('mtmPlayerTestumResultTable > prepareTestumResultTable :',data);
      this.tabulator.addRow(data, false); // add to bottom
    }

    // 필요한 컬럼만 보이게 하기
    if (this.resultList.length > 0) {
      for (var i = 0; i < this.resultList[0].length; i++)
        this.tabulator.showColumn(mtmPlayerTestumResultTable.columnField[i]);
    }

    //
    this._showActionButtons([0, 0, 0, 0, 0, 0]);
  }

  setTestumResultList(listUnit, listResult) {
    var iIndexUnit = 0;
    var iIndexItem = 0;

    // 모든 data를 지운다.
    this.tabulator.clearData();
    // 모든 컬럼을 숨긴다.
    for (var i = 0; i < mtmPlayerTestumResultTable.columnField.length; i++) {
      this.tabulator.hideColumn(mtmPlayerTestumResultTable.columnField[i]);
    }

    this.listData = [];
    // 버튼 Row 더하기
    var firstData = { no: "", main: "M", main_w: "MW", sub: "S", sub_w: "SW", last: "L", last_w: "LW" };
    // Add Button Row
    this.listData.push(firstData); //

    this.resultList = listUnit;
    // console.log('mtmPlayerTestumResultTable > setResultTable : ', this.resultList);
    this.showButtonList = [];
    // unit 중세서 가장 많은 문제 개수 구하기
    var maxQNum = 0;

    for (var i = 0; i < listUnit.length; i++) {
      if (listUnit[i].types.length > maxQNum) maxQNum = listUnit[i].types.length;
      this.showButtonList.push({ notyet: 0 });
      this.showButtonList.push({ notyet: 0 });
    }

    // 결과 Table 변수 공간 확보
    for (var i = 0; i < maxQNum; i++) {
      var data = { no: i + 1, main: "", main_w: "", sub: "", sub_w: "", last: "", last_w: "" };
      this.listData.push(data);
    }

    console.log(listResult);
    console.log(typeof listResult);
    console.log(typeof listResult[0]);
    for (var i = 0; i < listResult.length; i++) {
      // 본 테스트
      var first_field = mtmPlayerTestumResultTable.columnField[i * 2];
      for (var j = 0; j < listResult[i].first.length; j++) {
        // 첫줄은 button 이므로 j+1
        this.listData[j + 1][first_field] = listResult[i].first[j];
        this.showButtonList[i * 2].notyet = 1;
      }
      // 오답 테스트
      var second_field = mtmPlayerTestumResultTable.columnField[i * 2 + 1];
      for (var j = 0; j < listResult[i].second.length; j++) {
        // 첫줄은 button 이므로 j+1
        this.listData[j + 1][second_field] = listResult[i].second[j];
        this.showButtonList[i * 2 + 1].notyet = 1;
      }
    }

    // 필요한 컬럼만 보이게 하기
    if (listUnit.length > 0) {
      for (var i = 0; i < listUnit.length; i++) {
        if (i >= parseInt(mtmPlayerTestumResultTable.columnField.length / 2))
          // 너무 많은
          break;
        // 본 테스트 결과
        this.tabulator.showColumn(mtmPlayerTestumResultTable.columnField[i * 2]);
        // 오답 테스트 결과
        this.tabulator.showColumn(mtmPlayerTestumResultTable.columnField[i * 2 + 1]);
      }
    }

    this.tabulator.setData(this.listData);
    //
    this._showActionButtons([0, 0, 0, 0, 0, 0]);

    this.infoResult = {};
    this.infoResult.iLastIndexUnit = iIndexUnit;
    this.infoResult.iLastIndexItem = iIndexItem;
    this.infoResult.progress = 0;
    this.infoResult.point = 0;

    var self = this;
    setTimeout(function () {
      self.tabulator.redraw(true);
    }, 0);

    return this.infoResult;
  }

  redraw() {
    // console.log('mtmPlayerTestumResultTable > redraw');
    this.tabulator.redraw(true);
  }
}

mtmPlayerTestumResultTable.id = 0;
mtmPlayerTestumResultTable.columnField = ["main", "main_w", "sub", "sub_w", "last", "last_w"];

mtmPlayerTestumResultTable.firstData = ["M", "MW", "S", "SW", "L", "LW"];

mtmPlayerTestumResultTable.staticBody = [];

mtmPlayerTestumResultTable.testdata = [
  { no: 1, main: "O", main_w: "X", sub: "O", sub_w: "X", last: "O", last_w: "X" },
  { no: 2, main: "O", main_w: "", sub: "", sub_w: "", last: "", last_w: "" },
  { no: 3, main: "X", main_w: "O", sub: "X", sub_w: "O", last: "X", last_w: "O" },
  { no: 4, main: "O", main_w: "", sub: "", sub_w: "", last: "", last_w: "" },
  { no: 5, main: "O", main_w: "", sub: "", sub_w: "", last: "", last_w: "" },
  // {'no':2,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':3,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':4,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':5,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':6,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':7,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':8,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':9,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
  // {'no':10,'main':'O','main_w':'','sub':'','sub_w':'','last':'','last_w':''},
];

mtmPlayerTestumResultTable.column = [];
