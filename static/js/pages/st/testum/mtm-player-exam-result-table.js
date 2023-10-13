// Exam 결과를 보여주는 요소 - Table (Tabulator)
// Testum 은 현재 세로 형태로 보여 지지만(나중에는 바뀔 수 도 있지만 ),
// Exam 은 가로 형태로 보여 져야 한다.
import { mtmInputButton } from "../../../core/ui/input/mtm-input-button.js";

export var mtmPlayerExamResultTable = function (options) {
  this.id = "id-mtm-player-exam-result-table-" + mtmPlayerExamResultTable.id++;
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

  // this._prepareButtons();
  // this.fieldKey = ["main","main_w","sub","sub_w","last","last_w"];
  this._init();
};

mtmPlayerExamResultTable.id = 0;
mtmPlayerExamResultTable.columns = [];
mtmPlayerExamResultTable.ContentNum = 10;
mtmPlayerExamResultTable.columnField = ["main", "main_w", "sub", "sub_w", "last", "last_w"];

mtmPlayerExamResultTable.firstData = ["M", "MW", "S", "SW", "L", "LW"];

mtmPlayerExamResultTable.staticBody = [];

mtmPlayerExamResultTable.testdata = [
  { no: 1, main: "O", main_w: "X", sub: "O", sub_w: "X", last: "O", last_w: "X" },
  { no: 2, main: "O", main_w: "", sub: "", sub_w: "", last: "", last_w: "" },
  { no: 3, main: "X", main_w: "O", sub: "X", sub_w: "O", last: "X", last_w: "O" },
  { no: 4, main: "O", main_w: "", sub: "", sub_w: "", last: "", last_w: "" },
  { no: 5, main: "O", main_w: "", sub: "", sub_w: "", last: "", last_w: "" },
];

mtmPlayerExamResultTable.prototype.onMainHandler = function (e) {
  // console.log('mtmPlayerExamResultTable > onMainHandler');
  e.preventDefault();
  e.stopPropagation();
  if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(0);
};

mtmPlayerExamResultTable.prototype.onMainWrongHandler = function (e) {
  // console.log('mtmPlayerExamResultTable > onMainWrongHandler');
  e.preventDefault();
  e.stopPropagation();
  if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(1);
};

mtmPlayerExamResultTable.prototype.onSubHandler = function (e) {
  // console.log('mtmPlayerExamResultTable > onSubHandler');
  e.preventDefault();
  e.stopPropagation();
  if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(2);
};

mtmPlayerExamResultTable.prototype.onSubWrongHandler = function (e) {
  // console.log('mtmPlayerExamResultTable > onSubWrongHandler');
  e.preventDefault();
  e.stopPropagation();
  if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(3);
};

mtmPlayerExamResultTable.prototype.onLastHandler = function (e) {
  // console.log('mtmPlayerExamResultTable > onLastHandler');
  e.preventDefault();
  e.stopPropagation();
  if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(4);
};

mtmPlayerExamResultTable.prototype.onLastWrongHandler = function (e) {
  // console.log('mtmPlayerExamResultTable > onLastWrongHandler');
  e.preventDefault();
  e.stopPropagation();
  if (this.options && this.options.eventTableButtonClick) this.options.eventTableButtonClick(5);
};

mtmPlayerExamResultTable.prototype.typeFormatter = function (cell, formatterParams) {
  var el = cell.getElement();

  // console.log('data : ', cell.getData().code);
  var value = cell.getValue();
  var field = cell.getField();
  var column_num = -1;
  for (var i = 0; i < mtmPlayerExamResultTable.firstData.length; i++) {
    if (value == mtmPlayerExamResultTable.firstData[i]) {
      // var clActionButton = this.clActionButtons[i].elThis;
      return this.clActionButtons[i].elThis;
    }

    if (field == mtmPlayerExamResultTable.columnField[i]) column_num = i;
  }

  if (cell.getValue() == "O") el.style.color = "blue";
  else if (cell.getValue() == "X") {
    if (column_num >= 0 && column_num % 2 == 0) el.style.color = "gray";
    else el.style.color = "red";
  } else if (cell.getValue() == "?") el.style.color = "red";

  // var column = cell.getColumn();
  if (cell.getField() == mtmPlayerExamResultTable.columnField[this.activeField]) {
    el.style.backgroundColor = "rgba(200,200,200,0.6)";
    // el.style.border  = '1px solid #888';
  }

  return cell.getValue();
};

mtmPlayerExamResultTable.prototype.truthFormatter = function (cell, formatterParams, onRendered) {
  //plain text value

  var el = cell.getElement();
  var field = "w" + cell.getField().substring(1);
  var repeat = "r" + cell.getField().substring(1);

  var data = cell.getRow().getData();

  if (cell.getValue() == "O") {
    el.style.color = "blue";
    return "O";
  } else if (cell.getValue() == "X") {
    el.style.color = "red";
    return "X";
  } else if (cell.getValue() == "?") {
    el.style.color = "red";
    return "?";
  }

  // return cell.getValue();
  el.style.color = "transparent";
  return "-";
};

mtmPlayerExamResultTable.prototype.truthPrintFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // d3Formatter

  var self = this;
  onRendered(function () {
    // Todo. Jstar : Print Implementation
    // self.printDoubleD3Donut.call(self,cell,0)
  });
  // return '';
};

mtmPlayerExamResultTable.prototype.blankFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // blankFormatter
  return "";
};

mtmPlayerExamResultTable.prototype.tableBuilt = function () {
  var tableHolder = $(this.elThis).find(".tabulator-tableholder");
  // console.log('tableHolder : ', tableHolder);

  $(tableHolder).css("overflow-x", "hidden");
  // this.elColumnAddHeader = this.elColumnAddHeaderTitle.parentElement.parentElement.parentElement;

  // this.elColumnAddHeader.classList.add('mtv-tabulator-button');
};

mtmPlayerExamResultTable.prototype._prepare = function () {};

// mtmPlayerExamResultTable.prototype._prepareButtons = function() {

//     // Array 로 하면 좋지 않나?
//     var optionsMain = {};
//     this.clActionButtons = [];
//     optionsMain.eventHandler = this.onMainHandler.bind(this);
//     optionsMain.text = ' 본';
//     optionsMain.iClass = 'fa-solid fa-wand-magic-sparkles';
//     optionsMain.btnClass = 'mtm-input-button mtm-input-button-theme mtm-btn-sm'
//     optionsMain.RemoveMarginLeft = true;
//     this.clMainButton = new mtmInputButton(optionsMain);
//     this.clActionButtons.push(this.clMainButton);

//     var optionsMainWrong = {};
//     optionsMainWrong.eventHandler = this.onMainWrongHandler.bind(this);
//     optionsMainWrong.text = ' 오답';
//     optionsMainWrong.iClass = 'fa-regular fa-circle-question';
//     optionsMainWrong.btnClass = 'mtm-input-button mtm-input-button-theme mtm-btn-sm'
//     optionsMainWrong.RemoveMarginLeft = true;
//     this.clMainWrongButton = new mtmInputButton(optionsMainWrong);
//     this.clActionButtons.push(this.clMainWrongButton);

//     var optionsSub = {};
//     optionsSub.eventHandler = this.onSubHandler.bind(this);
//     optionsSub.text = ' 쌍';
//     optionsSub.btnClass = 'mtm-input-button mtm-input-button-theme mtm-btn-sm'
//     optionsSub.iClass = 'fa-solid fa-wand-magic-sparkles';
//     optionsSub.RemoveMarginLeft = true;
//     this.clSubButton = new mtmInputButton(optionsSub);
//     this.clActionButtons.push(this.clSubButton);

//     var optionsSubWrong = {};
//     optionsSubWrong.eventHandler = this.onSubWrongHandler.bind(this);
//     optionsSubWrong.text = ' 오답';
//     optionsSubWrong.iClass = 'fa-regular fa-circle-question';
//     optionsSubWrong.btnClass = 'mtm-input-button mtm-input-button-theme mtm-btn-sm'
//     optionsSubWrong.RemoveMarginLeft = true;
//     this.clSubWrongButton = new mtmInputButton(optionsSubWrong);
//     this.clActionButtons.push(this.clSubWrongButton);

//     var optionsLast = {};
//     optionsLast.eventHandler = this.onLastHandler.bind(this);
//     optionsLast.text = ' 막';
//     optionsLast.iClass = 'fa-solid fa-wand-magic-sparkles';
//     optionsLast.btnClass = 'mtm-input-button mtm-input-button-theme mtm-btn-sm'
//     optionsLast.RemoveMarginLeft = true;
//     this.clLastButton = new mtmInputButton(optionsLast);
//     this.clActionButtons.push(this.clLastButton);

//     var optionsLastWrong = {};
//     optionsLastWrong.eventHandler = this.onLastWrongHandler.bind(this);
//     optionsLastWrong.text = ' 오답';
//     optionsLastWrong.iClass = 'fa-regular fa-circle-question';
//     optionsLastWrong.btnClass = 'mtm-input-button mtm-input-button-theme mtm-btn-sm'
//     optionsLastWrong.RemoveMarginLeft = true;
//     this.clLastWrongButton = new mtmInputButton(optionsLastWrong);
//     this.clActionButtons.push(this.clLastWrongButton);
// }

mtmPlayerExamResultTable.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);
  this.elThis.setAttribute("class", "mtm-tabulator-table");

  this.elFlex = document.createElement("div");
  this.elFlex.setAttribute("class", "row d-flex justify-content-center");

  this.elWrapper = document.createElement("div");
  this.elWrapper.setAttribute("class", "col-12 col-md-10 col-lg-9 col-xl-8");

  this.elTable = document.createElement("div");
  this.elTable.classList.add("mtm-tabulator");

  this.elWrapper.appendChild(this.elTable);
  this.elFlex.appendChild(this.elWrapper);
  this.elThis.appendChild(this.elFlex);
  // this.elThis.appendChild(this.elPagenationTop);

  this._create();
};

mtmPlayerExamResultTable.prototype.pageCount = function (pageSize, currentRow, currentPage, totalRows, totalPages) {
  // this.elPageCounter.innerHTML =  "Showing " + pageSize +  " rows of " + totalRows + " total";
  this.elPageCounter.innerHTML =
    "Showing " + currentRow + " - " + (parseInt(currentRow) + parseInt(pageSize) - 1) + " of " + totalRows;
  // if(totalRows)
  //     this.tabulator.setPage(parseInt(totalRows/10) + 1);
  return "Showing " + pageSize + " rows of " + totalRows + " total";
};

mtmPlayerExamResultTable.prototype.cellMouseEnter = function (e, cell) {
  var el = cell.getElement();
  var field = cell.getField();
  var column_num = -1;

  if (cell.getValue() == "O" || cell.getValue() == "X" || cell.getValue() == "?") {
    el.style.backgroundColor = "rgb(255,255,0)";
    el.style.cursor = "pointer";
  }
};

mtmPlayerExamResultTable.prototype.cellMouseLeave = function (e, cell) {
  var el = cell.getElement();

  el.style.backgroundColor = "";
  el.style.cursor = "default";
};

mtmPlayerExamResultTable.prototype.cellClick = function (e, cell) {
  var el = cell.getElement();
  // if(el.style.cursor != 'pointer')
  //     return;

  var row = cell.getRow();
  var row_no = row.getData().no;
  var column = cell.getColumn();
  var column_field = column.getField();
  // var column_no = row.getData().c_index;
  var value = cell.getValue();

  var column_no = parseInt(column_field[1]) * 10 + parseInt(column_field[2]);
  //
  // console.log('mtmPlayerExamResultTable > cellClick 0');
  // if(row_no == '')
  //     return;

  // for(var i=0;i<mtmPlayerExamResultTable.columnField.length;i++)
  // {
  //     if(column_field == mtmPlayerExamResultTable.columnField[i])
  //     {
  //         column_no = i;
  //         break;
  //     }
  // }
  // console.log('mtmPlayerExamResultTable > cellClick 1');

  // if(column_no < 0)
  //     return;

  // if( (column_no%2 == 0) )
  // {
  //     console.log('mtmPlayerExamResultTable > cellClick 2 :', value);

  //     if(value != 'O' && value != '?')
  //         return;
  // }
  // else if(value != '?' && value != 'O' && value != 'X' )
  // {
  //     console.log('mtmPlayerExamResultTable > cellClick 3');
  //     return;
  // }
  // setTimeout ???
  if (this.options && this.options.eventCellClick && value) this.options.eventCellClick(column_no, row_no, value);

  // console.log('mtmPlayerExamResultTable > cellClick :',row_no,column_no);
};

mtmPlayerExamResultTable.prototype.clickRow = function (e, row) {
  // console.log(row);
  if (this.selectedRow) {
    this.selectedRow.getElement().style.backgroundColor = "";
  }

  this.selectedRow = row;
  this.selectedRow.getElement().style.backgroundColor = "#00ff00";

  var data = {};
  data.type = this.selectedRow.getData().type;

  if (this.options && this.options.eventClickRow) this.options.eventClickRow(data);
};

mtmPlayerExamResultTable.prototype.clickActionAddHeader = function (e, column) {
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
};

mtmPlayerExamResultTable.prototype._create = function () {
  // https://jsfiddle.net/8hcjbatz/

  // Exclude Groups from Pagination
  // https://codepen.io/lukeorriss/pen/dyZwwez
  var contentNum = mtmPlayerExamResultTable.ContentNum;

  for (var j = 0; j < contentNum; j++) {
    var index = (j % contentNum) + 1;
    var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
    var title = parseInt(index).toString();

    mtmPlayerExamResultTable.columns.push({
      title: title,
      formatter: this.truthFormatter.bind(this),
      field: field,
      minWidth: 28,
      // maxWidth : 50,
      headerHozAlign: "center",
      hozAlign: "center",
      headerSort: false,
      formatterPrint: this.truthPrintFormatter.bind(this),
    });
  }

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
    // responsiveLayout:"hide",
    // autoColumns:true,
    layout: "fitColumns",

    // layout:"fitDataTable",
    reactiveData: true, //turn on data reactivity
    data: mtmPlayerExamResultTable.testdata, //load data into table

    // minHeight:333, //do not let table get smaller than 300 px heigh
    // (title:(29+4)=33, items :(30x10) = 300) - total = 333

    // 2) Alignment
    // Column Header Alignment
    // Data Alignment
    // columns:[
    //     {title:"문제 #",  field:"no",   headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    //     {title:"본문제", formatter:this.typeFormatter.bind(this), field:"main", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    //     {title:"오답", formatter:this.typeFormatter.bind(this), field:"main_w", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    //     {title:"쌍둥이", formatter:this.typeFormatter.bind(this), field:"sub", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    //     {title:"오답", formatter:this.typeFormatter.bind(this), field:"sub_w", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    //     {title:"마지막", formatter:this.typeFormatter.bind(this), field:"last", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    //     {title:"오답", formatter:this.typeFormatter.bind(this), field:"last_w", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
    // ],

    columns: mtmPlayerExamResultTable.columns,
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
  this.tabulator.on(
    "cellMouseEnter",
    this.cellMouseEnter.bind(this),
    // function(e, cell){
    //     //e - the event object
    //     //cell - cell component
    // }
  );
  this.tabulator.on("cellMouseLeave", this.cellMouseLeave.bind(this));
  this.tabulator.on("cellClick", this.cellClick.bind(this));
};

mtmPlayerExamResultTable.prototype._prepareData = function (size) {
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
};

mtmPlayerExamResultTable.column = [];

mtmPlayerExamResultTable.prototype._showActionButtons = function (bShowList) {
  // this.clMainButton.elThis
  // console.log('_showActionButton : ', this.showButtonList);

  for (var i = 0; i < this.showButtonList.length; i++) {
    var clButton = this.clActionButtons[i];
    clButton.setGrayDisable();
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
};
//////////////////////// API ///////////////////////
mtmPlayerExamResultTable.prototype.showActionButtons = function (bShowList) {
  this._showActionButtons(bShowList);
};

mtmPlayerExamResultTable.prototype.show = function (bShow) {
  if (bShow) {
    this.elThis.style.display = "block";
    this.tabulator.redraw(true);
  } else this.elThis.style.display = "none";
};

// mtmPlayerExamResultTable.prototype.setResultTable = function(tryResult) {

//     this.tabulator.clearData();
//     this.resultList = tryResult;

//     // console.log('mtmPlayerExamResultTable > setResultTable : ',this.resultList);
//     for(var i =0;i<this.resultList.length;i++)
//     {
//         this.tabulator.addRow(this.resultList[i],false);   // add to bottom
//     }
// }

mtmPlayerExamResultTable.prototype.setResultTable = function (resultTableList) {
  this.tabulator.clearData();

  this.realData = [];

  this.resultList = resultTableList;

  // console.log('mtmPlayerExamResultTable > setResultTable : ', this.resultList);

  var contentNum = mtmPlayerExamResultTable.ContentNum;
  var data = {};
  var index = 0;
  var row_num = 0;
  for (var i = 0; i < this.resultList.length; i++) {
    index = (i % contentNum) + 1;
    var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
    // var data = {};
    data[field] = this.resultList[i][0];
    // data["c_index"] = (index%10);
    if (index % 10 == 0) {
      data.no = row_num++;
      this.realData.push(data);
      data = {};
    }
  }
  data.no = row_num;
  if (index > 0) this.realData.push(data);

  // console.log('mtmPlayerExamResultTable > setResultTable : ', this.realData);

  this.tabulator.setData(this.realData);
};

mtmPlayerExamResultTable.prototype.redraw = function () {
  // console.log('mtmPlayerTestumResultTable > redraw');
  this.tabulator.redraw(true);
};
