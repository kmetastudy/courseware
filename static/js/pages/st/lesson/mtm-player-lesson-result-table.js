require("./mtm-player-lesson-result-table.css");
export class mtmPlayerLessonResultTable {
  constructor(options) {
    this.id = "id-mtm-player-lesson-result-table-" + mtmPlayerLessonResultTable.id++;
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
    this.activeRow = 0;
    this.fieldKey = ["video", "q1", "q2", "q3"];
    this.init();
  }

  videoFormatter(cell, formatterParams) {
    var el = cell.getElement();
    if (cell.getValue() == "O") {
      el.style.color = "red";
      return "<i class='fa-brands fa-youtube' style='font-size:20px;padding-top:0px;padding-bottom:0px;'></i>";
    } else if (cell.getValue() == "X") {
      el.style.color = "grey";
      return "<i class='fa-brands fa-youtube' style='font-size:20px;'></i>";
    }

    // console.log('no videoFormat');
    return "";
  }
  typeFormatter(cell, formatterParams) {
    var el = cell.getElement();

    // console.log('data : ', cell.getData().code);
    if (cell.getValue() == "O") el.style.color = "blue";

    if (cell.getValue() == "X") el.style.color = "red";

    if (cell.getValue() == "?") el.style.color = "red";
    // var column = cell.getColumn();
    if (cell.getField() == this.fieldKey[this.activeField]) {
      el.style.backgroundColor = "rgba(200,200,200,0.6)";
      // el.style.border  = '1px solid #888';
    }

    return cell.getValue();
  }
  addIconTitleFormatter(column, param2, param3) {
    //plain text value
    // 아직 column 이 parent 에 붙지 않았다.
    // tableBuilt 핸들러에서 처리한다.
    this.elColumnAddHeaderTitle = column.getElement();
    return "<i class='fa fa-plus'></i>";
  }
  addIconFormatter(cell, formatterParams) {
    //plain text value
    // cell.get
    // return "<i class='fa fa-plus'></i>";
    return;
  }
  renderD3Donut(cell, type) {
    var el = $(cell.getElement())[0];
    var value = 0;
    if (type == 0) value = cell.getRow().getData().point;
    else value = cell.getRow().getData().percent;
    // var id = '#'+'mtv-d3-progress-circle-'+$(el).attr('id');
    // console.log('$(el) : ', $(el));
    el.classList.add("d3-chart");
    mtvD3ProgressCircle.draw(el, value, 22, 22, ".35em", type);
    // mtvD3ProgressCircle.draw('#mtv-right-tabs1-tabs-1',20,22,22,".35rem",0);
    // $(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"bar"});
    // $(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"bar", barWidth:14, disableTooltips:true});
  }
  printD3Donut(cell, type) {
    var el = $(cell.getElement())[0];
    var value = 0;
    if (type == 0) value = cell.getRow().getData().point;
    else value = cell.getRow().getData().percent;
    // var id = '#'+'mtv-d3-progress-circle-'+$(el).attr('id');
    // console.log('$(el) : ', $(el));
    el.classList.add("d3-chart");
    mtvD3ProgressCircle.print(el, value, 22, 22, ".35em", type);
    // mtvD3ProgressCircle.draw('#mtv-right-tabs1-tabs-1',20,22,22,".35rem",0);
    // $(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"bar"});
    // $(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"bar", barWidth:14, disableTooltips:true});
  }
  d3PointFormatter(cell, formatterParams, onRendered) {
    //plain text value
    // d3Formatter
    var self = this;
    onRendered(function () {
      self.renderD3Donut.call(self, cell, 0);
    });
  }
  d3PrintPointFormatter(cell, formatterParams, onRendered) {
    //plain text value
    // d3Formatter
    var self = this;
    onRendered(function () {
      self.printD3Donut.call(self, cell, 0);
    });
    return "";
  }
  d3PercentFormatter(cell, formatterParams, onRendered) {
    //plain text value
    // d3Formatter
    var self = this;
    onRendered(function () {
      self.renderD3Donut.call(self, cell, 1);
    });
  }
  d3PrintPercentFormatter(cell, formatterParams, onRendered) {
    //plain text value
    // d3Formatter
    var self = this;
    onRendered(function () {
      self.printD3Donut.call(self, cell, 1);
    });
    return "";
  }
  blankFormatter(cell, formatterParams, onRendered) {
    //plain text value
    // blankFormatter
    return "";
  }
  sparkLineFormatter(cell, formatterParams, onRendered) {
    onRendered(function () {
      //instantiate sparkline after the cell element has been aded to the DOM
      $(cell.getElement()).sparkline(cell.getValue(), { width: "100%", type: "line", disableTooltips: true });
    });
  }
  sparkBarFormatter(cell, formatterParams, onRendered) {
    onRendered(function () {
      //instantiate sparkline after the cell element has been aded to the DOM
      // $(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"line", disableTooltips:true});
      $(cell.getElement()).sparkline(cell.getValue(), {
        width: "100%",
        type: "bar",
        barWidth: 14,
        disableTooltips: true,
      });
    });
  }
  tableBuilt() {
    var tableHolder = $(this.elThis).find(".tabulator-tableholder");
    // console.log('tableHolder : ', tableHolder);
    $(tableHolder).css("overflow-x", "hidden");
    // this.elColumnAddHeader = this.elColumnAddHeaderTitle.parentElement.parentElement.parentElement;
    // this.elColumnAddHeader.classList.add('mtv-tabulator-button');
    this.bInit = true;
  }
  tableBuilding() {
    var tableHolder = $(this.elThis).find(".tabulator"); //[0].find('.tabulator-tableholder'); //> .tabulator-tableholder');

    // $(tabl)
    console.log("tableHolder : ", tableHolder);
  }

  create() {
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
      data: mtmPlayerLessonResultTable.testdata, //load data into table

      // minHeight:333, //do not let table get smaller than 300 px heigh
      // (title:(29+4)=33, items :(30x10) = 300) - total = 333

      // 2) Alignment
      // Column Header Alignment
      // Data Alignment
      columns: [
        { title: "순서 #", field: "no", headerSort: false, headerHozAlign: "center", hozAlign: "center" },
        {
          title: "영상",
          formatter: this.videoFormatter.bind(this),
          field: "video",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
          cellClick: this.clickActionVideoCell.bind(this),
        },

        // {title:"본문제", formatter:this.typeFormatter.bind(this), field:"q1", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
        {
          title: "예제1",
          formatter: this.typeFormatter.bind(this),
          field: "q1",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        // {title:"쌍둥이", formatter:this.typeFormatter.bind(this), field:"q2", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
        {
          title: "예제2",
          formatter: this.typeFormatter.bind(this),
          field: "q2",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },
        // {title:"마지막", formatter:this.typeFormatter.bind(this), field:"q3", headerSort:false, headerHozAlign:"center", hozAlign:"center"},
        {
          title: "예제3",
          formatter: this.typeFormatter.bind(this),
          field: "q3",
          headerSort: false,
          headerHozAlign: "center",
          hozAlign: "center",
        },

        // {formatter: this.addIconFormatter.bind(this), width:30, hozAlign:"center",
        //     headerSort:false,
        //     headerHozAlign:"center",
        //     headerClick: this.clickActionAddHeader.bind(this),
        //     titleFormatter:this.addIconTitleFormatter.bind(this),
        //     // cellClick:this.clickActionAddCell.bind(this),
        //     print:false},
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
  }

  init() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);

    this.elFlex = document.createElement("div");
    this.elFlex.setAttribute("class", "mtm-player-lesson-result-tables-flexbox");

    this.elWrapper = document.createElement("div");
    this.elWrapper.setAttribute("class", "mtv-tabulator-table mtm-player-lesson-result-tables-wrapper");

    this.elTable = document.createElement("div");
    this.elTable.classList.add("mtm-tabulator");

    this.elWrapper.appendChild(this.elTable);
    this.elFlex.appendChild(this.elWrapper);
    this.elThis.appendChild(this.elFlex);
    // this.elThis.appendChild(this.elPagenationTop);
    this.create();
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
    if (
      cell.getValue() == "O" || // && (cell.getField() == 'video')) ||
      (cell.getValue() == "X" && cell.getField() != "video") ||
      cell.getValue() == "?"
    ) {
      el.style.backgroundColor = "rgb(255,255,0)";
      el.style.cursor = "pointer";
    }
  }

  cellMouseLeave(e, cell) {
    var el = cell.getElement();
    el.style.backgroundColor = "";
    el.style.cursor = "default";
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
    if (row_no == "") return;

    for (var i = 0; i < mtmPlayerLessonResultTable.columnField.length; i++) {
      if (column_field == mtmPlayerLessonResultTable.columnField[i]) {
        column_no = i;
        break;
      }
    }

    // if((this.options.mode == 0) && (cell.getField() == 'no'))
    // {
    //     if(this.options && this.options.eventUnseenVideoClick)
    //         this.options.eventUnseenVideoClick(column_no+1,parseInt(row_no)-1,value);
    //     return;
    // }
    if (column_no < 0) return;

    // 선생님 모드 && 안 본 비디오
    // if((this.options.mode == 0) &&
    //     ((value == 'X') && (cell.getField() == 'video')))
    // {
    //     if(this.options && this.options.eventUnseenVideoClick)
    //         this.options.eventUnseenVideoClick(column_no,parseInt(row_no)-1,value);
    //     return;
    // }
    if (value != "O" && (value != "X" || cell.getField() == "video") && value != "?") {
      return;
    }
    // setTimeout ???
    if (this.options && this.options.eventCellClick)
      this.options.eventCellClick(column_no, parseInt(row_no) - 1, value);

    // console.log('mtvPlayerTestumResultTable > cellClick :',row_no,column_no);
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
  clickActionVideoCell(e, cell) {
    e.preventDefault();
    e.stopPropagation();
    var row = cell.getRow();
    var video = cell.getData().video;
    // console.log('clickActionVideoCell : ', row.getPosition(true));
    if (video == "O") {
      // console.log('clickActionVideoCell : ', row.getPosition(true));
      if (this.options && this.options.eventVideoHandler) this.options.eventVideoHandler();
    }

    // else if(this.options.mode == 0) // 선생님 모드
    // {
    //     if(this.options && this.options.eventVideoHandler)
    //         this.options.eventVideoHandler();
    // }
    // row.getElement().style.backgroundColor = "#00ff00";
    // alert("Add new data for: " + cell.getRow().getData().name);
    return false;
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
  // mtv/core/utils/mtvComponentBuilder 에 등록
  // mtvComponentBuilder.register('mtv-player-lesson-result-table',mtmPlayerLessonResultTable);
  _prepareData(size) {
    this.resultList = [];
    for (var i = 0; i < size; i++) {
      this.resultList.push({
        no: i + 1,
        video: "",
        q1: "",
        q2: "",
        q3: "",
      });
    }
  }
  //////////////////////// API ///////////////////////
  show(bShow) {
    if (bShow) {
      this.elThis.style.display = "block";
      var self = this;
      setTimeout(function () {
        self.tabulator.redraw(true);
      }, 0);
    } else this.elThis.style.display = "none";
  }
  //
  setLessonResultList(listUnit, listResult) {
    // mtmPlayerLessonResultTable.testdata = [
    //     { no:1, video :'O', q1 :'X', q2 :'O', q3 :'X', },
    //  ]
    this.listData = [];
    console.log(listUnit);
    console.log(listResult);
    // 이어하기
    var bContinue = false; // 이어하기 존재?
    var tContinue = ""; // 이어하기 타입?
    var iContiIndexUnit = -1;
    var iContiIndexItem = -1;
    // 마지막으로 한 Element Item (영상/문제)
    var bLast = false;
    var iIndexUnit = 0;
    var iIndexItem = 0;

    // 이게 왜이리 어렵냐?, Table 을 만드는 것은 쉬운데...
    for (var i = 0; i < listUnit.length; i++) {
      var data = { no: i + 1, video: "X", q1: "", q2: "", q3: "" };
      if (listResult.length > i && listResult[i].result.length > 0) {
        iIndexUnit = i;
        iIndexItem = 0;
        for (var j = 0; j < listUnit[i].types.length; j++) {
          if (j > 3) break;
          if (listUnit[i].types[j] == "v") {
            if (listResult[i].result.length > j) {
              data.video = listResult[i].result[j];
              iIndexItem = j + 1;
            } else {
              bLast = true;
              // break;
            }
          } else {
            if (listResult[i].result.length > j) {
              data["q" + j] = listResult[i].result[j];
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
          if (listUnit[iIndexUnit].types.length <= iIndexItem) iIndexUnit++;
          iIndexItem = 0;
          bLast = true;
        }
        // break;
      }
      this.listData.push(data);
    }

    // console.log('mtmPlayerLessonResultTable.>.setLessonResultList:',iIndexUnit, iIndexItem)
    // // 이어 하기 Element 가 존재 확인
    if (listUnit[iIndexUnit].types.length > iIndexItem) {
      // 마지막 Unit 에 존재하는가?
      bContinue = true;
      iContiIndexUnit = iIndexUnit;
      // iContiIndexItem = iIndexItem + 1;
      iContiIndexItem = iIndexItem;
      tContinue = listUnit[iContiIndexUnit].types[iContiIndexItem];
      var data = this.listData[iContiIndexUnit];
      if (tContinue == "v") data.video = "O";
      else data["q" + iContiIndexItem] = "?";
    }

    // 여기까지는 안 가는 것이 정상....
    else if (listUnit.length > iIndexUnit + 1) {
      // 다음 Unit 처음에 존재하는 가?
      iContiIndexUnit = iIndexUnit + 1;
      if (listUnit[iContiIndexUnit].types.length > 0) {
        bContinue = true;
        iContiIndexItem = 0;
        tContinue = listUnit[iContiIndexUnit].types[iContiIndexItem];
        var data = { no: i + 1, video: "X", q1: "", q2: "", q3: "" };

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

    var self = this;
    setTimeout(function () {
      self.tabulator.redraw(true);
    }, 0);

    return this.infoResult;
  }
  setLessonResultTable(listResult) {
    this.tabulator.setData(listResult);
    // this.tabulator.clearData();
    // this.resultList = tryResult;
    // for(var i =0;i<this.resultList.length;i++)
    // {
    //     this.tabulator.addRow(this.resultList[i],false);   // add to bottom
    // }
  }
  redraw() {
    // console.log('mtmPlayerTestumResultTable > redraw');
    // this.tabulator.redraw(true);
    if (this.bInit) {
      var dataList = this.tabulator.getData();
      if (dataList.length > 0) this.tabulator.redraw(true);
    }
  }
}

mtmPlayerLessonResultTable.id = 0;
mtmPlayerLessonResultTable.columnField = ["video", "q1", "q2", "q3"];

mtmPlayerLessonResultTable.testdata = [
  { no: 1, video: "O", q1: "X", q2: "O", q3: "X" },
  { no: 2, video: "-", q1: "O", q2: "O", q3: "" },
  { no: 3, video: "O", q1: "X", q2: "", q3: "" },
  { no: 4, video: "-", q1: "", q2: "", q3: "" },
  { no: 5, video: "X", q1: "", q2: "", q3: "" },
  { no: 6, video: "-", q1: "", q2: "", q3: "" },
  { no: 7, video: "X", q1: "", q2: "", q3: "" },
  { no: 8, video: "-", q1: "", q2: "", q3: "" },
  { no: 9, video: "X", q1: "", q2: "", q3: "" },
  { no: 10, video: "-", q1: "", q2: "", q3: "" },
  // { no:3, video :'X', q1 :'',   q2 :'', q3 :'', },
];
