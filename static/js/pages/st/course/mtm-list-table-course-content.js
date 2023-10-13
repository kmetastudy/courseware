// Tabulator row formatting removes hover effect, while cell formatting doesn't
// https://stackoverflow.com/questions/61739079/tabulator-row-formatting-removes-hover-effect-while-cell-formatting-doesnt
// 공통 css 인 경우
require("../../../../css/core/component/mtm-tabulator.css");
import { mtoEvents } from "../../../core/utils/mto-events";
import { mtoContentFormat } from "../../../core/utils/mto-content-format";
import { mtmCircularProgress } from "../../../core/ui/output/mtm-circular-progress.js";

// options.mode
// 0 - student mode
// 1 - teacher mode
// options.type
// 0 - normal/clinic content : student/teacher mode
// 1 - exam content : student/teacher mode
export var mtmListTableCourseContent = function (options) {
  this.id = "id-mtm-list-table-course-content-" + mtmListTableCourseContent.id++;
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
  this._init();
};

mtmListTableCourseContent.id = 0;

mtmListTableCourseContent.staticPlayArea = [];

mtmListTableCourseContent.prototype.typeFormatter = function (cell, formatterParams) {
  var el = cell.getElement();
  el.style.color = "blue";
  // console.log('data : ', cell.getData().code);
  if (cell.getData().type == "T" || cell.getData().type == "11") return "<i class='fa fa-file-text-o mx-2'></i>";

  if (cell.getData().type == "L" || cell.getData().type == "12") return "<i class='fa fa-file-video-o mx-2'></i>";

  return cell.getData().type;
};

mtmListTableCourseContent.prototype._onRenderLatex = function (cell) {
  // var data = cell.getData();
  var data = cell.getRow().getData();
  var el = cell.getElement();
  var icon = "";
  // console.log('mtmListTableCourseContent > _onRenderLatex :',data);
  if (data.type == mtoContentFormat.TESTUM) icon = "<i class='title fa-regular fa-pen-to-square fa-lg mx-2'></i>";
  else if (data.type == mtoContentFormat.LESSION) icon = "<i class='title fa-brands fa-youtube fa-lg mx-2'></i> ";
  else if (data.type == mtoContentFormat.EXAM) icon = "<i class='title fa-solid fa-file-shield fa-lg mx-2'></i> ";
  el.innerHTML = icon + data.title;
  renderMathInElement(el, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
  el.style.fontWeight = 600;
};

mtmListTableCourseContent.prototype.titleFormatter = function (cell, formatterParams, onRendered) {
  // case 1)
  // var data = cell.getData();
  // var el = document.createElement('div');

  // el.innerHTML = data.title;
  // this._renderLatex(el);
  // return el;

  // case 2)
  var self = this;
  onRendered(function () {
    self._onRenderLatex.call(self, cell, 0);
  });
};

mtmListTableCourseContent.prototype.renderCircularProgress = function (cell, type) {
  var el = cell.getElement();
  // el.classList.add('d3-chart');
  var value = 0;
  var unit = "";
  if (this.options && this.options.type == 1) {
    // exam
    var value = cell.getRow().getData().percent;
    if (value <= 0) return " ";
    var times = cell.getRow().getData().examtime.split(":");
    var time = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60 + value;
    var now = new Date();
    var curr_time = parseInt(now.getTime() / 1000);
    console.log("mtmListTableCourseContent > renderCircularProgress :", time, curr_time);
    if (time > curr_time) return " ";
  }

  if (type == 0) value = cell.getRow().getData().point;
  else {
    value = cell.getRow().getData().percent;
    unit = "%";
  }

  // for test
  // value = parseInt((Math.random()*100)%100);

  var clPrgoress = new mtmCircularProgress();
  // var elProgress = mtoCircularProgress.create(value,unit,false);
  clPrgoress.setProgress(value, unit, false);
  el.appendChild(clPrgoress.elThis);
};

mtmListTableCourseContent.prototype._reRenderProgress = function (cell, type) {
  // var el = $(cell.getElement())[0];
  var el = cell.getElement();
  var value = 0;
  var unit = "";
  if (type == 0) value = cell.getRow().getData().point;
  else {
    value = cell.getRow().getData().percent;
    unit = "%";
  }

  // Todo. 기존의 class 는 어떻게 없애지?
  while (el.firstChild) {
    el.removeChild(el.lastChild);
  }

  var clPrgoress = new mtmCircularProgress();
  clPrgoress.setProgress(value, unit, false);
  el.appendChild(clPrgoress.elThis);
};

mtmListTableCourseContent.prototype.pointFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // d3Formatter

  var self = this;
  onRendered(function () {
    // self.renderD3Donut.call(self,cell,0)
    self.renderCircularProgress.call(self, cell, 0);
  });
};

mtmListTableCourseContent.prototype.percentFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // d3Formatter

  var self = this;
  onRendered(function () {
    // self.renderD3Donut.call(self,cell,1)
    self.renderCircularProgress.call(self, cell, 1);
  });
};

mtmListTableCourseContent.prototype._dateStudyFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // console.log('mtmListTableCourseContent > _dateStudyFormatter : ', cell.getData());
  // 학습일 YYYY-MM-DD,
  // return cell.getData().ondate;

  if (!cell.getData().date) return;

  var date = cell.getData().date;

  return date;
};

mtmListTableCourseContent.prototype._dateExamFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // console.log('mtmListTableCourseContent > _dateExamFormatter : ', cell.getData());
  // 평가일시를 YYYY-MM-DD, 오전 10:00
  // return cell.getData().examdate;

  if (!cell.getData().examdate) return;

  var examdate = cell.getData().examdate;
  var data = examdate.split(",");
  // if(data.length < 2)
  //     return ''
  var times = data[1].split(":");
  var time = parseInt(times[0]) * 60 + parseInt(times[1]);
  var am_pm = "오전";
  if (time > 12 * 60) {
    am_pm = "오후";
    time -= 12 * 60;
  }

  var new_time = parseInt(time / 60) < 10 ? "0" + parseInt(time / 60).toString() : parseInt(time / 60).toString();
  time -= parseInt(time / 60) * 60;
  var new_min = parseInt(time) < 10 ? "0" + parseInt(time).toString() : parseInt(time).toString();

  // return cell.getData().examdate;
  return data[0] + ", " + am_pm + " " + new_time + ":" + new_min;
};

mtmListTableCourseContent.prototype._timeExamFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // console.log('mtmListTableCourseContent > _timeExamFormatter : ', cell.getData());
  return cell.getData().examtime;
};

mtmListTableCourseContent.testdata = [];

mtmListTableCourseContent.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);
  this.elThis.classList.add("mtm-tabulator-table-round", "shadow");

  if (this.options && this.options.classList) {
    for (var i = 0; i < this.options.classList.length; i++) this.elThis.classList.add(this.options.classList[i]);
  }

  this.elTable = document.createElement("div");
  this.elTable.classList.add("mtm-tabulator");

  this.elThis.appendChild(this.elTable);
  // this.elThis.appendChild(this.elPagenationTop);

  this._create();

  mtoEvents.on("OnChangeProgressPoint", this.onChangeProgressHandler.bind(this));

  // 할 필요없다.
  // if(this.options && this.options.type == 1)  // exam
  //     mtoEvents.on('OnGetExamProperty',this.onGetExamPropertyHandler.bind(this));
  // 이것으로 이미 필요한 data 를 가져온다.
  // mtoEvents.on('OnChangeExamContent',this.onChangeExamContentHandler.bind(this));
};

// mtmListTableCourseContent.prototype.clearClickedRow = function() {
//     this.selectedRow = null;
// }

mtmListTableCourseContent.prototype._create = function () {
  // https://jsfiddle.net/8hcjbatz/

  // Exclude Groups from Pagination
  // https://codepen.io/lukeorriss/pen/dyZwwez

  this.columns = [];
  if (this.options && this.options.mode == 1) {
    this.columns = [
      {
        title: "No.",
        formatter: "rownum",
        field: "title",
        field: "index",
        headerHozAlign: "center",
        hozAlign: "center",
        width: 40,
        headerSort: false,
      },

      {
        title: "제목",
        field: "title",
        formatter: this.titleFormatter.bind(this),
        headerHozAlign: "center",
        headerSort: false,
        hozAlign: "left",
      },

      // 5-3) D3 Graph
      {
        title: "진도",
        formatter: this.percentFormatter.bind(this),
        field: "percent",
        minWidth: 37,
        width: 37,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
        // formatterPrint:this.d3PrintPercentFormatter.bind(this),
      },
      {
        title: "점수",
        formatter: this.pointFormatter.bind(this),
        field: "point",
        minWidth: 37,
        width: 37,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
        // formatterPrint:this.d3PrintPointFormatter.bind(this),
      },
      {
        title: "학습일",
        formatter: this._dateStudyFormatter.bind(this),
        field: "date",
        // sorter:"string",
        width: 100,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
      },
      {
        title: "평가일시",
        formatter: this._dateExamFormatter.bind(this),
        field: "examdate",
        // sorter:"string",
        width: 160,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
      },
      {
        title: "시간",
        formatter: this._timeExamFormatter.bind(this),
        field: "examtime",
        headerSort: false,
        width: 50,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
      },
      {
        title: "",
        width: 20,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
      },
    ];
  } else {
    this.columns = [
      {
        title: "제목",
        field: "title",
        formatter: this.titleFormatter.bind(this),
        headerHozAlign: "center",
        headerSort: false,
        hozAlign: "left",
      },

      // 5-3) CSS Donut
      {
        title: "진도",
        formatter: this.percentFormatter.bind(this),
        field: "percent",
        minWidth: 37,
        width: 37,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
        // formatterPrint:this.d3PrintPercentFormatter.bind(this),
      },
      {
        title: "점수",
        formatter: this.pointFormatter.bind(this),
        field: "point",
        minWidth: 37,
        width: 37,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
        // formatterPrint:this.d3PrintPointFormatter.bind(this),
      },

      {
        title: "평가일시",
        formatter: this._dateExamFormatter.bind(this),
        field: "examdate",
        // sorter:"string",
        width: 160,
        headerHozAlign: "center",
        hozAlign: "center",
      },
      {
        title: "시간",
        formatter: this._timeExamFormatter.bind(this),
        field: "examtime",
        headerSort: false,
        width: 50,
        headerHozAlign: "center",
        hozAlign: "center",
      },
      {
        title: "",
        width: 20,
        headerHozAlign: "center",
        hozAlign: "center",
        headerSort: false,
      },
    ];
  }

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

    height: 332,
    layout: "fitColumns",
    // layout:"fitDataTable",
    reactiveData: true, //turn on data reactivity
    data: mtmListTableCourseContent.testdata, //load data into table

    // Todo. Jstar : For Studing...
    // 이걸 하면, 어디서는 이상하게 Row 가 깨지네... 특히 Scroll Bar 도
    // 문제가 있네....
    // minHeight:311, //do not let table get smaller than 300 px heigh
    // (title:(29+4)=33, items :(30x10) = 300) - total = 333

    // 2) Alignment
    // Column Header Alignment
    // Data Alignment
    columns: this.columns,
    //     [

    //     // {
    //     //     title:"종류", formatter:this.typeFormatter.bind(this), field:"type",
    //     //     width:37,headerSort:false, headerHozAlign:"center", hozAlign:"center"
    //     // },

    //     {
    //         title:"제목", field:"title", formatter:this.titleFormatter.bind(this),
    //         headerHozAlign:"center",headerSort:false, hozAlign:"left"
    //     },

    //     // 5-3) D3 Graph
    //     {
    //         title:"점수", formatter: this.pointFormatter.bind(this),field:"point",
    //         minWidth :37, width:37,headerHozAlign:"center", hozAlign:"center",headerSort:false,
    //         // formatterPrint:this.d3PrintPointFormatter.bind(this),
    //     },
    //     {
    //         title:"진도", formatter: this.percentFormatter.bind(this),field:"percent",
    //         minWidth :37, width:37,headerHozAlign:"center", hozAlign:"center",headerSort:false,
    //         // formatterPrint:this.d3PrintPercentFormatter.bind(this),
    //     },
    //     {
    //         title:"평가일시",
    //         formatter:this._dateExamFormatter.bind(this), field:"examdate",
    //         // sorter:"string",
    //         width:160, headerHozAlign:"center", hozAlign:"center",
    //     },
    //     {
    //         title:"시간",
    //         formatter:this._timeExamFormatter.bind(this), field:"examtime",
    //         headerSort:false,
    //         width:50, headerHozAlign:"center", hozAlign:"center",
    //     },
    //     {
    //         title:"", width:20,headerHozAlign:"center", hozAlign:"center",headerSort:false,
    //     },

    // ],

    // version 5.2
    // rowClick: this.clickRow.bind(this),
    // function(e, row){
    //     //e - the click event object
    //     //row - row component
    //     console.log(row);
    // },
  });

  this.tabulator.on("tableBuilt", this.onTableBuilt.bind(this));
  // version 5.1
  this.tabulator.on("rowClick", this.clickRow.bind(this));
};

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Handler ///////////////////////////////////
mtmListTableCourseContent.prototype.onTableBuilt = function () {
  for (var i = 0; i < this.elTable.children.length; i++) {
    if (this.elTable.children[i].classList.contains("tabulator-tableholder"))
      this.elTable.children[i].style.overflowX = "hidden";
  }

  // | <--- 제목 ---> |  점수 | 진도 | 평가일시 | 평가시간 |
  if (this.options && this.options.type == 0) {
    // Normal Course Content
    this.tabulator.hideColumn("examdate");
    this.tabulator.hideColumn("examtime");
  } else if (this.options && this.options.type == 1) {
    // Exam Content
    // this.tabulator.hideColumn('point');
    this.tabulator.hideColumn("percent");
  }
};

mtmListTableCourseContent.prototype.clickRow = function (e, row) {
  // console.log(row);
  if (this.selectedRow) {
    // this.selectedRow.getElement().style.backgroundColor = "";
    // Todo. class 를 정의해서 border sytle 을 바꾸는 것이 어떨까?
    // this.selectedRow.getElement().style.border = "";
    if (this.selectedRow.getElement()) {
      this.selectedRow.getElement().children[0].style.border = "";
      this.selectedRow.getElement().children[0].style.boxSizing = "";
    }
  }

  this.selectedRow = row;
  // this.selectedRow.getElement().style.backgroundColor = "#00ff00";
  // this.selectedRow.getElement().style.backgroundColor = "rgb(240, 221, 139)";
  // this.selectedRow.getElement().style.backgroundColor = "var(--theme-color-deeplight)";

  // Todo. class 를 정의해서 border sytle 을 바꾸는 것이 어떨까?
  this.selectedRow.getElement().children[0].style.border = "2px solid var(--theme-color-v2-c3-rgb)";
  this.selectedRow.getElement().children[0].style.boxSizing = "border-box";

  var data = {};
  var rowData = this.selectedRow.getData();
  // data.class_id = rowData.class_id;
  // data.course_id = rowData.course_id;
  data.content_id = rowData.content_id;
  data.title = rowData.title;
  data.type = rowData.type;
  if (this.clinic) {
    data.course_idx = rowData.course_idx;
  }

  if (this.options && this.options.type == 1) {
    // exam
    data.examdate = rowData.examdate;
    data.examtime = rowData.examtime;
    data.attribute = rowData.attribute;
  }

  // console.log('mtmListTableCourseContent : clickRow > ', data.type);
  if (this.options && this.options.eventClickRow) this.options.eventClickRow(data);
};

mtmListTableCourseContent.prototype.onChangeProgressHandler = function (eData) {
  // console.log('mtmListTableCourseContent > setProgressPoint :');

  if (this.selectedRow) {
    var rowData = this.selectedRow.getData();
    // console.log('')
    if (rowData.content_id != eData.content_id) return;
    this.selectedRow.update({ point: eData.point, percent: eData.progress });

    var cellPoint = this.selectedRow.getCell("point");
    var cellPercent = this.selectedRow.getCell("percent");

    // this.reRenderD3Donut(cellPoint,0);

    // this.reRenderD3Donut(cellPercent,1);
    this._reRenderProgress(cellPoint, 0);
    this._reRenderProgress(cellPercent, 1);
  }
};

mtmListTableCourseContent.prototype.onGetExamPropertyHandler = function (id) {
  var dataList = this.tabulator.getData();
  // console.log('mtmListTableCourseContent > onGetExamPropertyHandler');
  for (var i = 0; i < dataList.length; i++) {
    if (dataList[i].content_id == id) {
      var data = {};
      data.examdate = dataList[i].examdate;
      data.examtime = dataList[i].examtime;
      data.attribute = dataList[i].attribute;
      console.log("mtmListTableCourseContent > onGetExamPropertyHandler :", data);
      return data;
    }
  }
};
///////////////////////////////////////////////////////////////////////////
/////////////////////////////// API ///////////////////////////////////////
mtmListTableCourseContent.prototype.show = function (bShow) {
  if (bShow) {
    this.elThis.style.display = "";
    this.tabulator.redraw(true);
  } else this.elThis.style.display = "none";
};

mtmListTableCourseContent.prototype.setWide = function (bWide) {
  if (bWide) this.elThis.classList.add("px-0");
  else this.elThis.classList.remove("px-0");
};

mtmListTableCourseContent.prototype.setContent = function (data) {
  if (!data) return;
  // ExamTest. Jstar : Exam Test
  var testdate = [];
  var testtime = [];
  testdate.push("2023-04-19, 02:17");
  testdate.push("2023-05-05, 14:00");

  testtime.push("00:01");
  testtime.push("01:00");

  this.tabulator.clearData();
  this.dataList = [];
  // 아래 addRow 를 한꺼번에 해야 한다.
  for (var i = 0; i < data.length; i++) {
    var attribute = null;
    if (this.options && this.options.type == 1)
      // exam type
      attribute = JSON.parse(data[i].attribute);

    var row = {
      id: i,
      class_id: data[i].class_id, // class_id
      course_id: data[i].course_id, // course_id
      content_id: data[i].content_id, // class_id
      type: data[i].content_type,
      point: data[i].point,
      percent: data[i].progress,
      title: data[i].content_title,
      // ExamTest. Jstar : Exam Test
      // Exam 을 위한 field
      examdate: data[i].examdate,
      examtime: data[i].examtime,
      // examdate : testdate[i],
      // examtime : testtime[i],
      attribute: attribute,
    };
    this.dataList.push(row);
    // this.tabulator.addRow(row,false);   // add to bottom
  }
  // addData 는 기존에 Data 가 있을때, size 가 크면 문제가 있다.
  // 지우고 , 두 개를 javascript 로 합치고 , setData를 하는 것이 좋다.
  // this.tabulator.addData(this.dataList,true);

  this.tabulator.setData(this.dataList);
  this.selectedRow = null;
};

//
mtmListTableCourseContent.prototype.setContentList = function (listContent) {
  this.dataList = [];

  for (var i = 0; i < listContent.length; i++) {
    var data = {};
    data.index = i + 1;
    data.title = listContent[i].title;
    data.type = listContent[i].type;
    data.point = 0;
    data.percent = 0;
    data.date = "";
    // for(var j=0;j<this.student_info.length;j++)
    // {
    //     // data['PR'+j] = Math.floor(Math.random() * 101);
    //     // data['PO'+j] = Math.floor(Math.random() * 101);
    //     // data['PR'+j] = 0;
    //     // data['PO'+j] = 0;
    // }

    this.dataList.push(data);
  }

  this.tabulator.setData(this.dataList);
  this.selectedRow = null;
};

//
mtmListTableCourseContent.prototype.setStudyResultList = function (listStudy) {
  this.dataList = [];

  var index = 0;
  for (var i = 0; i < listStudy.length; i++) {
    // book, chapter
    if (listStudy[i].level <= 1) continue;
    var data = {};
    data.index = index + 1;
    index++;
    data.content_id = listStudy[i].id;

    data.title = listStudy[i].title;
    data.type = listStudy[i].type;
    data.point = listStudy[i].point;
    data.percent = listStudy[i].progress;
    data.date = listStudy[i].date;

    this.dataList.push(data);
  }

  this.tabulator.setData(this.dataList);
  this.selectedRow = null;
};

/**
 * Tabulator에 데이터 넣기
 * @param {Object} list { content_list: [], study_list: [] }
 * @returns
 */
mtmListTableCourseContent.prototype.setStudyResultListInfo = function (list) {
  this.dataList = [];
  var content_list = list.content_list;
  var result_list = list.result_list;
  var index = 0;
  for (var i = 0; i < content_list.length; i++) {
    // book, chapter
    if (content_list[i].level <= 1) continue;
    var data = {};
    data.index = index + 1;
    index++;
    data.content_id = content_list[i].id;

    data.title = content_list[i].title;
    data.type = content_list[i].type;
    data.date = content_list[i].date;

    data.point = 0;
    data.percent = 0;
    if (result_list.length > i) {
      data.point = result_list[i].point;
      data.percent = result_list[i].progress;
    }

    this.dataList.push(data);
  }

  this.tabulator.setData(this.dataList);
  this.selectedRow = null;

  return this.dataList.length;
};

mtmListTableCourseContent.prototype.updateStudyProgressPointInfo = function (pData) {
  this.listData = this.tabulator.getData();
  // console.log('mtmListTableCourseContent > updateStudyProgressPointInfo :',pData);
  // console.log('mtmListTableCourseContent > updateStudyProgressPointInfo :',list);

  for (var i = 0; i < this.listData.length; i++) {
    // var rowData = this.tabulator.getRow(i).getData();
    if (this.listData[i].content_id == pData.content_id) {
      // var row = this.tabulator.getRow(i+1);
      // console.log('mtmListTableCourseContent > updateStudyProgressPointInfo :',this.listData,row);
      // if(row)
      // {
      //     var rowData = row.getData();
      //     rowData.percent = pData.progress;
      //     rowData.point = pData.point;
      //     this.tabulator.updateRow(i+1,rowData);
      // }

      this.listData[i].percent = pData.progress;
      this.listData[i].point = pData.point;
      this.tabulator.setData(this.listData);
      this.selectedRow = null;
      break;
    }
  }
};

mtmListTableCourseContent.prototype.setBaseList = function (list) {
  this.dataList = [];
  var content_list = list.content_list;
  // list.study_list 의 길이는 1개
  var study_list = list.study_list;
  var index = 0;
  this.base = true;
  // console.log('mtmListTableCourseContent > setBaseList : ', content_list);

  for (var i = 0; i < content_list.length; i++) {
    if (content_list[i].level <= 1) continue;
    // console.log(content_list[i].level)
    var data = {};
    data.index = index + 1;
    index++;

    data.content_id = content_list[i].id;
    data.title = content_list[i].title;
    data.type = content_list[i].type;
    data.date = content_list[i].date;

    // for(var j=0;j< study_list.length;j++)
    // {
    if (study_list.length > i) {
      if (study_list[i].progress) data.percent = study_list[i].progress;
      else data.percent = 0;
      if (study_list[i].point) data.point = study_list[i].point;
      else data.point = 0;
    } else {
      data.percent = 0;
      data.point = 0;
      // data.date = '';
    }
    // }

    this.dataList.push(data);
  }

  this.tabulator.setData(this.dataList);
  return this.dataList.length;
};

mtmListTableCourseContent.prototype.setClinicList = function (list) {
  this.dataList = [];
  var index = 0;
  this.clinic = true;
  for (var i = 0; i < list.length; i++) {
    // var clinic = JSON.parse(list[i]);
    var clinic = list[i].properties;
    console.log("mtmListTableCourseContent > setClinicList : ", clinic);
    if (!clinic.property) continue;
    var content_list = clinic.property;

    for (var j = 0; j < content_list.length; j++) {
      if (content_list[j].level <= 1) continue;

      if (!content_list[j].clinic) continue;
      // console.log(content_list[i].level)
      var data = {};
      data.index = index + 1;
      index++;

      data.content_id = content_list[j].id;
      data.title = content_list[j].title;
      data.type = content_list[j].type;
      data.course_idx = i;
      data.date = content_list[j].date;

      data.percent = content_list[j].progress;
      data.point = content_list[j].point;
      // }

      this.dataList.push(data);
    }
  }

  this.tabulator.setData(this.dataList);
  return this.dataList.length;
};

mtmListTableCourseContent.prototype.getStudyResultList = function () {
  return this.tabulator.getData();
};

mtmListTableCourseContent.prototype.setSimulResultList = function (listSimul) {
  this.dataList = [];

  for (var i = 0; i < listSimul.length; i++) {
    var data = {};
    data.index = i + 1;
    data.content_id = listSimul[i].id;

    data.title = listSimul[i].title;
    data.type = listSimul[i].type;
    data.point = listSimul[i].point;
    data.percent = listSimul[i].progress;
    data.date = listSimul[i].date;

    this.dataList.push(data);
  }

  this.tabulator.setData(this.dataList);
  this.selectedRow = null;
};

// mStuyResultN.properties
// # 속성
//     # ----------------------------------------------------------------
//     # try_count = squence number
//     # try_index = unit_index (0,1,2)
//     # repeat_count = (1,1,2,0) : 0 은 한번 안함, 1 = 한번함, 2 두번함
//     # result = (O,X,-,?) : O 맞음, X 틀림, - 아직 안봄, ? 정답 미기입
//     # ----------------------------------------------------------------
//     # exam = answer | start_time
//     # answer = {"answer":["1","2",]} - 기입한 정답
//     # start_time = 시작 시간.
// # ----------------------------------------------------------------
//     # {
//     #       {
//     #           content_id : , title : , progress : , point : ,
//     #           units : [
//     #                       {contents : [], types : []},
//     #                       {contents : [], types : []},
//     #                       {contents : [], types : []},
//     #                   ],
//     #           results : [
//     #                        {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
//     #                        {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
//     #                        {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
//     #                    ],
//     #       },
//     #       {
//     #           content_id : , title : , progress : , point : ,
//     #           units : [
//     #                       {contents : [], types : []},
//     #                       {contents : [], types : []},
//     #                       {contents : [], types : []},
//     #                   ],
//     #           results : [
//     #                        {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
//     #                        {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
//     #                        {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
//     #                    ],
//     #       },
//     # }

// 여기서 체험을 위한 학습 시뮬레이션을 한다. - mtmListTableClassCourseStatistics.studySimulation
mtmListTableCourseContent.prototype.studySimulation = function () {};

mtmListTableCourseContent.prototype.getSimulationData = function () {};
