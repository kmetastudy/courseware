// 학생들의 Course 정오표를 표시한다.
// tabulator 의 Tree Structure and Nested Data 를 사용한다.
// 아니다... 그냥 위에는 제목(T1,L1)이 나오고 아래는 안나오게 한다.
require("../../../css/core/component/mtm-tabulator.css");

// Exam 을 위하여 title 을 없애는 type : 1
// type 0 : Normal Course Truth Table (with title and cell click ?)
// type 1 : Exam Truth Table (without title and cell click enable)
export var mtmListTableStatisticsCourseTruth = function (options) {
  this.id = "id-mtm-list-table-statistics-course-truth-" + mtmListTableStatisticsCourseTruth.id++;
  this.elThis = null;

  this.options = options;

  // this.elThis = null;
  this.elTable = null;
  this.elPagenation = null;

  this.tabulator = null;
  this.elColumnAddHeaderTitle = null;
  this.elColumnAddHeader = null;

  this.tests = {};
  this.tests.typeIndex = 0;
  this.selectedRow = null;

  this.activeField = 0;

  this.bareDataList = [];
  this.dataList = [];

  this.allRowSelected = false;
  this._init();
};

mtmListTableStatisticsCourseTruth.id = 0;

mtmListTableStatisticsCourseTruth.columns = [];
mtmListTableStatisticsCourseTruth.ContentNum = 10;

mtmListTableStatisticsCourseTruth.staticBody = [];

mtmListTableStatisticsCourseTruth.testBareData = [
  // lesson
  {
    type: "L",
    title: "레슨 1",
    data: [
      ["1", "O", "O"],
      ["1", "O", "O"],
      ["1", "X", "O"],
    ],
  },
  // testum
  {
    type: "T",
    title: "테스트 1",
    data: [
      ["O", "O", "O", "X", "X", "O", "O", "O", "O", "X", "X"],
      ["O", "O", "X", "X", "O", "X", "X", "O", "O", "O", "X"],
      ["X", "O", "O", "O", "O", "X", "X", "O", "O", "O", "X"],
    ],
  },
  // lesson
  {
    type: "L",
    title: "레슨 2",
    data: [
      ["1", "O", "O", "X"],
      ["1", "O", "O"],
      ["1", "X", "O"],
      ["1", "X", "O"],
    ],
  },
  // testum
  {
    type: "T",
    title: "테스트 2",
    data: [
      ["O", "O", "O", "O", "X", "O", "O", "O", "O", "O"],
      // ['O','O','X','O','O','X','X','O','O','O',],
      ["O", "O", "O", "O", "O", "O", "X", "O", "O", "O"],
    ],
  },
  // lesson
  {
    type: "L",
    title: "레슨 3",
    data: [
      ["1", "O", "O"],
      ["1", "O", "O"],
      // ['1','X','O',],
    ],
  },
];

mtmListTableStatisticsCourseTruth.testdata = [
  // {name:'테스트 1', c01:'O', c02:'X', c03:'O', c04:'O',}
];

mtmListTableStatisticsCourseTruth.prototype.typeFormatter = function (cell, formatterParams) {
  var el = cell.getElement();
  // el.style.color = 'blue';
  // console.log('data : ', cell.getData().code);
  if (cell.getData().type == "T" || cell.getData().type == "11")
    // return "<i class='fa fa-file-text-o'></i>";
    return "<i class='fa-regular fa-pen-to-square fa-lg mx-2'></i>";

  if (cell.getData().type == "L" || cell.getData().type == "12")
    // return "<i class='fa fa-file-video-o'></i>";
    return "<i class='fa-brands fa-youtube fa-lg mx-2'></i>";

  // return cell.getData().type;
};

mtmListTableStatisticsCourseTruth.prototype.addIconTitleFormatter = function (column, param2, param3) {
  //plain text value

  // 아직 column 이 parent 에 붙지 않았다.
  // tableBuilt 핸들러에서 처리한다.
  this.elColumnAddHeaderTitle = column.getElement();
  return "<i class='fa fa-plus'></i>";
};

mtmListTableStatisticsCourseTruth.prototype.addIconFormatter = function (cell, formatterParams) {
  //plain text value
  // cell.get
  // return "<i class='fa fa-plus'></i>";
  return;
};

mtmListTableStatisticsCourseTruth.prototype._onRenderLatex = function (cell) {
  // var data = cell.getData();
  var data = cell.getRow().getData();
  var el = cell.getElement();

  // console.log('mtmListTableStatisticsCourseTruth > _onRenderLatex :', data);

  // rowFormatter 에서 해야지 CellFormatter 에서 하면 안됨
  // var elRow = cell.getRow().getElement();

  var icon = "";
  // console.log('mtmListTableStatisticsCourseTruth > _onRenderLatex :',data);
  if (data.type == "11" || data.type == "T")
    //icon = "<i class='fa-solid fa-file-signature fa-lg mx-2' style='color:rgb(244,175,35)'></i> ";
    // icon = "<i class='fa-regular fa-pen-to-square fa-lg mx-2' style='color:var(--theme-color-main);'></i>";
    icon = "<i class='title fa-regular fa-pen-to-square fa-lg mx-2'></i>";
  else if (data.type == "12" || data.type == "L")
    // icon = "<i class='fa-brands fa-youtube fa-lg mx-2' style='color:var(--theme-color-main);'></i> ";
    icon = "<i class='title fa-brands fa-youtube fa-lg mx-2'></i> ";

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

  // 커서의 모양을 손모양으로 하려면...
  if (icon + data.title) el.style.cursor = "pointer";

  // 선택된 Row 배경
  // rowFormatter 에서 해야지 CellFormatter 에서 하면 안됨
  // if(data.selected)
  //     elRow.style.backgroundColor = "rgba(var(--theme-color-v2-c3),0.8)";
  // else
  //     elRow.style.backgroundColor = '';
};

mtmListTableStatisticsCourseTruth.prototype.titleFormatter = function (cell, formatterParams, onRendered) {
  // var el = cell.getElement();
  // el.style.color = 'blue';
  // console.log('data : ', cell.getData().code);
  // return cell.getData().title;
  var self = this;
  onRendered(function () {
    self._onRenderLatex.call(self, cell, 0);
  });
};

// Doc. Jstar :
// 원문자 또는 괄호 영숫자
// https://symbl.cc/kr/unicode/blocks/enclosed-alphanumerics/
mtmListTableStatisticsCourseTruth.prototype.truthFormatter = function (cell, formatterParams, onRendered) {
  //plain text value

  var el = cell.getElement();
  var field = "w" + cell.getField().substring(1);
  var repeat = "r" + cell.getField().substring(1);

  var data = cell.getRow().getData();

  if (cell.getValue() == "O") {
    if (data[field] == "X") {
      el.style.color = "red";
      if (data[repeat] == "1") {
        // ① = &#9312;
        return "&#9312;";
      }
      if (data[repeat] == "2") {
        // ② = &#9313;
        return "&#9313;";
      } else if (data[repeat] == "3") {
        // ③ = &#9314;
        return "&#9314;";
      } else if (data[repeat] == "4") {
        // ④ = &#9315;
        return "&#9315;";
      } else if (data[repeat] == "5") {
        // ⑤ = &#9316;
        return "&#9316;";
      } else if (data[repeat] > "5") {
        // (n)
        return "&#9437;";
      }
    } else el.style.color = "blue";
  } else if (cell.getValue() == "X") {
    el.style.color = "red";
  } else if (cell.getValue() == "?") el.style.color = "red";
  else if (cell.getValue() == "1") {
    el.style.color = "red";
    return "<i class='fa-brands fa-youtube' style='font-size:20px;padding-top:0px;padding-bottom:0px;'></i>";
  } else if (cell.getValue() == "0") {
    el.style.color = "grey";
    return "<i class='fa-brands fa-youtube' style='font-size:20px;'></i>";
  }

  return cell.getValue();
};

mtmListTableStatisticsCourseTruth.prototype.truthPrintFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // d3Formatter

  var self = this;
  onRendered(function () {
    // Todo. Jstar : Print Implementation
    // self.printDoubleD3Donut.call(self,cell,0)
  });
  // return '';
};

mtmListTableStatisticsCourseTruth.prototype.blankFormatter = function (cell, formatterParams, onRendered) {
  //plain text value
  // blankFormatter
  return "";
};

mtmListTableStatisticsCourseTruth.prototype.tableBuilt = function () {
  // 컬럼 정의 == ColumnDefinition 을 사용하자.

  var tableHolder = $(this.elThis).find(".tabulator-tableholder");
};

mtmListTableStatisticsCourseTruth.prototype.tableBuilding = function () {
  var tableHolder = $(this.elThis).find(".tabulator"); //[0].find('.tabulator-tableholder'); //> .tabulator-tableholder');
  // $(tabl)
  console.log("tableHolder : ", tableHolder);
};

// mtmListTableStatisticsCourseTruth.prototype.create = function(tagList) {

// }

mtmListTableStatisticsCourseTruth.prototype.prepare = function () {};

mtmListTableStatisticsCourseTruth.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);
  this.elThis.setAttribute("class", "mtm-tabulator-table");

  this.elFlex = document.createElement("div");
  this.elFlex.setAttribute("class", "row d-flex justify-content-center");

  this.elWrapper = document.createElement("div");
  // this.elWrapper.setAttribute('class','mtv-tabulator-table col-12 col-md-10 col-lg-9 col-xl-8');
  this.elWrapper.setAttribute("class", "mtv-tabulator-table col-12");

  this.elTable = document.createElement("div");
  this.elTable.classList.add("mtm-tabulator");

  this.elWrapper.appendChild(this.elTable);
  this.elFlex.appendChild(this.elWrapper);
  this.elThis.appendChild(this.elFlex);
  // this.elThis.appendChild(this.elPagenationTop);
  this._prepareData();

  this._create();
  console.log("mtmListTableStatisticsCourseTruth > _init :", this.dataList);

  // Todo. Jstar
  // 여기서 하면 Error 가 나온다.
  // postInit 에서 해야 한다.
  // this._setData();
  // this.tabulator.addData(this.dataList,true);
};

mtmListTableStatisticsCourseTruth.prototype.pageCount = function (
  pageSize,
  currentRow,
  currentPage,
  totalRows,
  totalPages,
) {
  // this.elPageCounter.innerHTML =  "Showing " + pageSize +  " rows of " + totalRows + " total";
  this.elPageCounter.innerHTML =
    "Showing " + currentRow + " - " + (parseInt(currentRow) + parseInt(pageSize) - 1) + " of " + totalRows;
  // if(totalRows)
  //     this.tabulator.setPage(parseInt(totalRows/10) + 1);
  return "Showing " + pageSize + " rows of " + totalRows + " total";
};

mtmListTableStatisticsCourseTruth.prototype.cellClick = function (e, cell) {
  //
  var field = cell.getField();
  if (field != "title") return;
  // 범위 선택
  console.log("mtmListTableStatisticsCourseTruth > cellClick :", field);

  var row = cell.getRow();
  var index = parseInt(row.getData().index);
  var data = this.tabulator.getData();

  for (var i = index; i < data.length; i++) {
    var rowData = this.tabulator.getRow(i).getData();
    if (rowData.selected) rowData.selected = false;
    else rowData.selected = true;

    this.tabulator.updateRow(i, rowData);
  }
};

mtmListTableStatisticsCourseTruth.prototype.clickRow = function (e, row) {
  // 현재 여기서는 아무 기능도 하지 않음.
  var rowData = row.getData();
  var index = rowData.index;

  console.log("mtmListTableStatisticsCourseTruth > clickRow :", index);
};

mtmListTableStatisticsCourseTruth.prototype.clickActionAddHeader = function (e, column) {
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

mtmListTableStatisticsCourseTruth.prototype._prepareRawData = function (courseList, resultList) {};

mtmListTableStatisticsCourseTruth.prototype._prepareBareData = function (bData) {
  var bareData = bData;
  // mtmListTableStatisticsCourseTruth.testdata = [];
  this.dataList = [];

  var contentNum = mtmListTableStatisticsCourseTruth.ContentNum;
  for (var i = 0; i < bareData.length; i++) {
    // testum
    if (bareData[i].type == "T") {
      var data = {};
      data.type = "T";
      data.wtype = "T";
      data.value = [];
      data.wrong = [];
      data.repeat = [];

      data.uuid = [];
      data.kl_mapper = [];

      data.title = bareData[i].title;
      data.unit_index = 0;
      for (var j = 0; j < bareData[i].data.length; j++) {
        var num = 0;
        if (j > 0) {
          if (j == 1) {
            data.title = "(쌍)";
            data.unit_index = 1;
          } else {
            data.title = "(막)";
            data.unit_index = 2;
          }
        }

        var k = 0;
        for (k = 0; k < bareData[i].data[j].length; k++) {
          var index = (k % contentNum) + 1;
          // column <- visible
          var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // wrong column <- not visible
          var wfield = "w" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // repeat colum <- not visible (repeat count)
          var rfield = "r" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // id column <- not visible
          var idfield = "i" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // kl column <- not visible
          var klfield = "k" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();

          data[field] = bareData[i].data[j][k];
          data[wfield] = bareData[i].wrong[j][k];
          data[rfield] = bareData[i].repeat[j][k];
          data[idfield] = bareData[i].contentId[j][k];

          data[klfield] = bareData[i].kl_mapper[j][k];

          data.value.push(bareData[i].data[j][k]);
          data.wrong.push(bareData[i].wrong[j][k]);
          data.repeat.push(bareData[i].repeat[j][k]);
          data.uuid.push(bareData[i].contentId[j][k]);
          data.kl_mapper.push(bareData[i].kl_mapper[j][k]);

          if (index == contentNum) {
            if (num > 0) data.title = "";
            num++;
            this.dataList.push(data);
            // console.log('Testum Truth Table 0 : ',data);

            data = {};
            data.type = "";
            data.wtype = "T";
            data.title = "";
            data.value = [];
            data.wrong = [];
            data.repeat = [];

            data.uuid = [];
            data.kl_mapper = [];
          }
        }

        if (k % contentNum) {
          this.dataList.push(data);
          // console.log('Testum Truth Table 1 : ',data);
        }

        data = {};
        data.type = "";
        data.wtype = "T";
        data.title = "";
        data.value = [];
        data.wrong = [];
        data.repeat = [];
        data.uuid = [];
        data.kl_mapper = [];
      }
    }
    // lesson
    else if (bareData[i].type == "L") {
      var num = 0;
      var unit_index = 0;
      var data = {};
      data.type = "L";
      data.wtype = "L";
      data.value = [];
      data.wrong = [];
      data.repeat = [];
      data.uuid = [];
      data.kl_mapper = [];
      data.unit_index = unit_index++;

      // toogleSelected ...
      data.selected = false;
      data.title = bareData[i].title;
      for (var j = 0; j < bareData[i].data.length; j++) {
        if (!bareData[i].data[j]) continue;
        for (var k = 0; k < bareData[i].data[j].length; k++) {
          var index = (num % contentNum) + 1;
          // var field = 'c'+ parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();
          // column <- visible
          var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // wrong column <- not visible
          var wfield = "w" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // repeat colum <- not visible (repeat count)
          var rfield = "r" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // id column <- not visible
          var idfield = "i" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // kl column <- not visible
          var klfield = "k" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();

          data[field] = bareData[i].data[j][k];
          // if(bareData[i].wrong[j])
          data[wfield] = bareData[i].wrong[j][k];
          data[rfield] = bareData[i].repeat[j][k];
          data[idfield] = bareData[i].contentId[j][k];
          data[klfield] = bareData[i].kl_mapper[j][k];

          data.value.push(bareData[i].data[j][k]);
          data.wrong.push(bareData[i].wrong[j][k]);
          data.repeat.push(bareData[i].repeat[j][k]);
          data.uuid.push(bareData[i].contentId[j][k]);
          data.kl_mapper.push(bareData[i].kl_mapper[j][k]);

          num++;
          if (num % contentNum == 0) {
            this.dataList.push(data);
            // console.log('Lesson Truth Table 0: ',data);

            data = {};
            data.unit_index = unit_index++;
            data.type = "";
            data.wtype = "L";
            data.title = "";
            data.value = [];
            data.wrong = [];
            data.repeat = [];
            data.uuid = [];
            data.kl_mapper = [];
          }
        }
      }

      if (num % contentNum) {
        this.dataList.push(data);
        // console.log('Lesson Truth Table 0: ',data);
      }
    }
  }

  // set index
  for (var i = 0; i < this.dataList.length; i++) {
    this.dataList[i].index = i; // this.dataList.length - 1 - i;
  }
};

mtmListTableStatisticsCourseTruth.prototype._prepareRowData = function (bData) {
  var bareData = bData;
  // mtmListTableStatisticsCourseTruth.testdata = [];
  this.dataList = [];

  var contentNum = mtmListTableStatisticsCourseTruth.ContentNum;
  for (var i = 0; i < bareData.length; i++) {
    // testum
    if (bareData[i].type == "T") {
      var data = {};
      data.type = "T";
      data.wtype = "T";
      data.value = [];
      data.wrong = [];
      data.repeat = [];

      // data.uuid = [];
      // data.kl_mapper = [];

      data.title = bareData[i].title;
      data.unit_index = 0;
      for (var j = 0; j < bareData[i].data.length; j++) {
        var num = 0;
        if (j > 0) {
          if (j == 1) {
            data.title = "(쌍)";
            data.unit_index = 1;
          } else {
            data.title = "(막)";
            data.unit_index = 2;
          }
        }

        var k = 0;
        for (k = 0; k < bareData[i].data[j].length; k++) {
          var index = (k % contentNum) + 1;
          // column <- visible
          var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // wrong column <- not visible
          var wfield = "w" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // repeat colum <- not visible (repeat count)
          var rfield = "r" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // // id column <- not visible
          // var idfield = 'i'+ parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();
          // // kl column <- not visible
          // var klfield = 'k'+ parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();

          data[field] = bareData[i].data[j][k];
          data[wfield] = bareData[i].wrong[j][k];
          data[rfield] = bareData[i].repeat[j][k];
          // data[idfield] = bareData[i].contentId[j][k];

          // data[klfield] = bareData[i].kl_mapper[j][k];

          data.value.push(bareData[i].data[j][k]);
          data.wrong.push(bareData[i].wrong[j][k]);
          data.repeat.push(bareData[i].repeat[j][k]);

          // data.uuid.push(bareData[i].contentId[j][k]);
          // data.kl_mapper.push(bareData[i].kl_mapper[j][k]);

          if (index == contentNum) {
            if (num > 0) data.title = "";
            num++;
            this.dataList.push(data);
            // console.log('Testum Truth Table 0 : ',data);

            data = {};
            data.type = "";
            data.wtype = "T";
            data.title = "";
            data.value = [];
            data.wrong = [];
            data.repeat = [];

            // data.uuid = [];
            // data.kl_mapper = [];
          }
        }

        if (k % contentNum) {
          this.dataList.push(data);
          // console.log('Testum Truth Table 1 : ',data);
        }

        data = {};
        data.type = "";
        data.wtype = "T";
        data.title = "";
        data.value = [];
        data.wrong = [];
        data.repeat = [];
        // data.uuid = [];
        // data.kl_mapper = [];
      }
    }
    // lesson
    else if (bareData[i].type == "L") {
      var num = 0;
      var unit_index = 0;
      var data = {};
      data.type = "L";
      data.wtype = "L";
      data.value = [];
      data.wrong = [];
      data.repeat = [];
      data.uuid = [];
      data.kl_mapper = [];
      data.unit_index = unit_index++;

      // toogleSelected ...
      data.selected = false;
      data.title = bareData[i].title;
      for (var j = 0; j < bareData[i].data.length; j++) {
        if (!bareData[i].data[j]) continue;
        for (var k = 0; k < bareData[i].data[j].length; k++) {
          var index = (num % contentNum) + 1;
          // var field = 'c'+ parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();
          // column <- visible
          var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // wrong column <- not visible
          var wfield = "w" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // repeat colum <- not visible (repeat count)
          var rfield = "r" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
          // id column <- not visible
          // var idfield = 'i'+ parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();
          // // kl column <- not visible
          // var klfield = 'k'+ parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();

          data[field] = bareData[i].data[j][k];
          // if(bareData[i].wrong[j])
          data[wfield] = bareData[i].wrong[j][k];
          data[rfield] = bareData[i].repeat[j][k];
          // data[idfield] = bareData[i].contentId[j][k];
          // data[klfield] = bareData[i].kl_mapper[j][k];

          data.value.push(bareData[i].data[j][k]);
          data.wrong.push(bareData[i].wrong[j][k]);
          data.repeat.push(bareData[i].repeat[j][k]);
          // data.uuid.push(bareData[i].contentId[j][k]);
          // data.kl_mapper.push(bareData[i].kl_mapper[j][k]);

          num++;
          if (num % contentNum == 0) {
            this.dataList.push(data);
            // console.log('Lesson Truth Table 0: ',data);

            data = {};
            data.unit_index = unit_index++;
            data.type = "";
            data.wtype = "L";
            data.title = "";
            data.value = [];
            data.wrong = [];
            data.repeat = [];
            // data.uuid = [];
            // data.kl_mapper = [];
          }
        }
      }

      if (num % contentNum) {
        this.dataList.push(data);
        // console.log('Lesson Truth Table 0: ',data);
      }
    }
  }

  // set index
  for (var i = 0; i < this.dataList.length; i++) {
    this.dataList[i].index = i; // this.dataList.length - 1 - i;
  }
};

// 1) 학습 한 결과를 정오표로 출력
// 2) 만약 일정이 지나 미학습된 결과는 어떻게 보여 줘야 하나?

// +-----------------------------------------------+
// | 제목  | 1  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
// | title |c01 |c02| ......................... |c10 |
mtmListTableStatisticsCourseTruth.prototype._prepareData = function () {
  // mtmListTableStatisticsCourseTruth.testdata = [];
  mtmListTableStatisticsCourseTruth.columns = [];

  // mtmListTableStatisticsCourseTruth.columns.push({title:"종류", formatter:this.typeFormatter.bind(this), field:"type", width:40, headerSort:false,headerHozAlign:"center", hozAlign:"center",frozen:true});
  mtmListTableStatisticsCourseTruth.columns.push({
    title: "제목",
    formatter: this.titleFormatter.bind(this),
    field: "title", // width:200,
    headerSort: false,
    headerHozAlign: "center",
    maxWidth: 600,
    hozAlign: "left",
    frozen: true,
  });

  var contentNum = mtmListTableStatisticsCourseTruth.ContentNum;
  for (var j = 0; j < contentNum; j++) {
    var index = (j % contentNum) + 1;
    var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
    // var title = parseInt(index/contentNum).toString()+ parseInt(index%contentNum).toString();
    var title = parseInt(index).toString();
    mtmListTableStatisticsCourseTruth.columns.push({
      title: title,
      formatter: this.truthFormatter.bind(this),
      field: field,
      minWidth: 34,
      maxWidth: 50,
      // width:34,
      headerHozAlign: "center",
      hozAlign: "center",
      headerSort: false,
      formatterPrint: this.truthPrintFormatter.bind(this),
    });
  }
};

mtmListTableStatisticsCourseTruth.prototype._create = function () {
  // https://jsfiddle.net/8hcjbatz/

  // Exclude Groups from Pagination
  // https://codepen.io/lukeorriss/pen/dyZwwez

  // console.log('mtmListTableStatisticsCourseTruth > _create :',mtmListTableStatisticsCourseTruth.columns);

  // this.tabulator = new Tabulator("#"+this.id, {
  this.tabulator = new Tabulator(this.elTable, {
    // 이걸로 해야지 CellFormatter 에서 하면 안됨
    rowFormatter: function (row) {
      //row - row component

      var data = row.getData();

      if (data.selected) {
        row.getElement().style.backgroundColor = "rgba(var(--theme-color-v2-c3),1.0)";
      } else {
        row.getElement().style.backgroundColor = "";
      }
    },
    index: "index",

    selectable: false,
    height: "333",
    layout: "fitColumns",
    // layout:"fitDataTable",
    reactiveData: true, //turn on data reactivity
    columns: mtmListTableStatisticsCourseTruth.columns,

    rowContextMenu: this.rowContextMenuHandler.bind(this),
  });

  this.tabulator.on("tableBuilt", this.tableBuilt.bind(this));
  // version 5.1
  this.tabulator.on("rowClick", this.clickRow.bind(this));
  // this.tabulator.on("cellMouseEnter", this.cellMouseEnter.bind(this));
  // this.tabulator.on("cellMouseLeave", this.cellMouseLeave.bind(this));
  this.tabulator.on("cellClick", this.cellClick.bind(this));
  // console.log('mtmListTableStatisticsCourseTruth');

  // var cols = this.tabulator.getColumns(true);
  // var colDefs = this.tabulator.getColumnDefinitions();
  // console.log('mtmListTableStatisticsCourseTruth : ', colDefs);
};

mtmListTableStatisticsCourseTruth.prototype._showActionButtons = function (bShowList) {
  // this.clMainButton.elThis
  // console.log('_showActionButton : ', this.showButtonList);

  for (var i = 0; i < this.showButtonList.length; i++) {
    var clButton = this.clActionButtons[i];
    clButton.setGrayDisable();
    if (this.showButtonList[i].notyet > 0) {
      clButton.setEnable(true);
    }
  }
};

mtmListTableStatisticsCourseTruth.prototype._setData = function () {
  this.tabulator.clearData();
  // this.dataList = dataList;
  for (var i = 0; i < this.dataList.length; i++) {
    this.tabulator.addRow(this.dataList[i], false); // add to bottom
  }
};

mtmListTableStatisticsCourseTruth.prototype.selectAllRowMenuHandler = function () {
  this.allRowSelected = true;
};

mtmListTableStatisticsCourseTruth.prototype.deSelectAllRowMenuHandler = function () {
  this.allRowSelected = false;
};

mtmListTableStatisticsCourseTruth.prototype.rowContextMenuHandler = function (e, component) {
  //component - column/cell/row component that triggered the menu
  //e - click event object

  var menu = [];

  if (!this.allRowSelected)
    menu.push({
      label: "모두 선택",
      action: this.selectAllRowMenuHandler.bind(this),
    });
  else
    menu.push({
      label: "모두 해제",
      action: this.deSelectAllRowMenuHandler.bind(this),
    });

  return menu;
};

///////////////////////////////////////////////////////////////////////////////////////
// O : 맞음 , X : 틀림 , ? : 문제 안함, '-' : 내용 없음
// 1 : 비디오 봄 , 0 : 비디오 안봄, '-' : 내용 없음.
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API //////////////////////////////////////////
mtmListTableStatisticsCourseTruth.prototype.showActionButtons = function (bShowList) {
  this._showActionButtons(bShowList);
};

mtmListTableStatisticsCourseTruth.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

// rawData -> bareData -> tableData
// result :
// 1) try_count 는 실행 횟수 (sequence): 한 컨텐트의 실행 횟수는 하나씩 계속 증가.
// 2) try_index 는 unit index (unit_index): 한 컨텐트를 구성하는 unit 의 index
// 3) repeat_count 반복 회수 (repeat_count): 문제를 반복한 횟수
// 4) question_results (question_results): 문제의 정/오 결과
mtmListTableStatisticsCourseTruth.prototype.setRawData = function (courseList, resultList) {
  // courseList (== content_list) 와 resultList (== contentresult_list) 의 length 는 같다.
  // courseList
  // console.log('mtmListTableStatisticsCourseTruth > setRawData : resultList',resultList);
  this.bareDataList = [];
  this.content_list = courseList;
  for (var i = 0; i < courseList.length; i++) {
    // 각 코스 컨텐츠의 결과에 따라서...
    // Mark. Jstar : bareData Start
    if (resultList[i].result_list.length > 0) {
      var bareData = {};
      bareData.title = courseList[i].content_title;
      bareData.data = [];
      bareData.wrong = [];
      bareData.contentId = [];
      bareData.dataCount = []; // unit_index 를 시도한 누적 횟수, 중요하지 않음.
      // 틀린 문제를 기록하자.
      bareData.repeat = [];

      if (courseList[i].content_type == 11) {
        bareData.type = "T";
        // 결과 로그에 따라서...
        for (var j = 0; j < resultList[i].result_list.length; j++) {
          var try_index = resultList[i].result_list[j].try_index;
          if (!bareData.data[try_index]) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;

            bareData.data[try_index] = qr.split(",");
            bareData.wrong[try_index] = qr.split(",");
            bareData.repeat[try_index] = rc.split(",");
            bareData.contentId[try_index] = [];

            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          } else if (bareData.dataCount[try_index] < resultList[i].result_list[j].try_count) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;
            var qr_list = qr.split(",");
            var rc_list = rc.split(",");
            for (var k = 0; k < qr_list.length; k++) {
              if (qr_list[k] == "O") bareData.data[try_index][k] = "O";
              // 한번이라도 틀렸으면...
              if (qr_list[k] == "X") {
                bareData.wrong[try_index][k] = "X";
                if (rc_list[k] > bareData.repeat[try_index][k]) {
                  bareData.repeat[try_index][k] = rc_list[k];
                  // console.log('mtmListTableStatisticsCourseTruth > setRawData Testum :', rc_list[k]);
                }
              }
            }
            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          }
        }

        // insert content id for wrong correct clinic
        for (var j = 0; j < bareData.data.length; j++) {
          if (courseList[i].unit_list && courseList[i].unit_list[j]) {
            for (var k = 0; k < courseList[i].unit_list[j].content_list.length; k++) {
              bareData.contentId[j][k] = courseList[i].unit_list[j].content_list[k].id;
            }
          }
        }
      } else if (courseList[i].content_type == 12) {
        bareData.type = "L";
        for (var j = 0; j < resultList[i].result_list.length; j++) {
          var try_index = resultList[i].result_list[j].try_index;
          if (!bareData.data[try_index]) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;

            bareData.data[try_index] = qr.split(",");
            bareData.wrong[try_index] = qr.split(",");
            bareData.repeat[try_index] = rc.split(",");

            bareData.contentId[try_index] = [];
            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          } else if (bareData.dataCount[try_index] < resultList[i].result_list[j].try_count) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;

            bareData.data[try_index] = qr.split(",");
            var qr_list = qr.split(",");
            var rc_list = rc.split(",");
            for (var k = 0; k < qr_list.length; k++) {
              if (qr_list[k] == "X") {
                bareData.wrong[try_index][k] = "X";
                bareData.repeat[try_index][k] = rc_list[k];
              }
            }
            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          }
        }

        for (var j = 0; j < bareData.data.length; j++) {
          if (!bareData.data[j]) continue;
          for (var k = 0; k < bareData.data[j].length; k++) {
            if (bareData.data[j][k] == "-") bareData.data[j][k] = "";
          }

          // Todo. Jstar : 콘텐츠가 영상인가? 를 항상 이렇게 확인해야 하나?
          // if(courseList[i].unit_list[j])
          if (courseList[i].unit_list && courseList[i].unit_list[j]) {
            for (var k = 0; k < courseList[i].unit_list[j].content_list.length; k++) {
              if (courseList[i].unit_list[j].content_list[k].video == "1") {
                // 아마 항상 k == 0 이다.
                // 비디오는 'O' -> '1'
                if (bareData.data[j][k] == "O") bareData.data[j][k] = "1";
                // 비디오는 !'O' -> '0'
                else bareData.data[j][k] = "0";
              }
              bareData.contentId[j][k] = courseList[i].unit_list[j].content_list[k].id;
            }
          }
        }
      }

      this.bareDataList.push(bareData);
    }
  }

  // console.log('mtmListTableStatisticsCourseTruth > setRawData :', this.bareDataList);
  this._prepareBareData(this.bareDataList);
  this.tabulator.clearData();

  this.tabulator.setData(this.dataList);
};

mtmListTableStatisticsCourseTruth.prototype.setRawDataWithKl = function (courseList, resultList, kl_book) {
  // courseList (== content_list) 와 resultList (== contentresult_list) 의 length 는 같다.
  // courseList
  // console.log('mtmListTableStatisticsCourseTruth > setRawData : resultList',resultList);
  this.bareDataList = [];
  this.content_list = courseList;
  for (var i = 0; i < courseList.length; i++) {
    // 각 코스 컨텐츠의 결과에 따라서...
    // Mark. Jstar : bareData Start
    if (resultList[i].result_list.length > 0) {
      var bareData = {};
      bareData.title = courseList[i].content_title;
      bareData.data = [];
      bareData.wrong = [];
      bareData.contentId = [];
      bareData.kl_mapper = [];

      bareData.dataCount = []; // unit_index 를 시도한 누적 횟수, 중요하지 않음.
      // 틀린 문제를 기록하자.
      bareData.repeat = [];

      if (courseList[i].content_type == 11) {
        bareData.type = "T";
        // 결과 로그에 따라서...
        for (var j = 0; j < resultList[i].result_list.length; j++) {
          var try_index = resultList[i].result_list[j].try_index;
          if (!bareData.data[try_index]) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;

            bareData.data[try_index] = qr.split(",");
            bareData.wrong[try_index] = qr.split(",");
            bareData.repeat[try_index] = rc.split(",");
            bareData.contentId[try_index] = [];
            bareData.kl_mapper[try_index] = [];

            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          } else if (bareData.dataCount[try_index] < resultList[i].result_list[j].try_count) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;
            var qr_list = qr.split(",");
            var rc_list = rc.split(",");
            for (var k = 0; k < qr_list.length; k++) {
              if (qr_list[k] == "O") bareData.data[try_index][k] = "O";
              // 한번이라도 틀렸으면...
              if (qr_list[k] == "X") {
                bareData.wrong[try_index][k] = "X";
                if (rc_list[k] > bareData.repeat[try_index][k]) {
                  bareData.repeat[try_index][k] = rc_list[k];
                  // console.log('mtmListTableStatisticsCourseTruth > setRawData Testum :', rc_list[k]);
                }
              }
            }
            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          }
        }

        // insert content id for wrong correct clinic
        for (var j = 0; j < bareData.data.length; j++) {
          if (courseList[i].unit_list && courseList[i].unit_list[j]) {
            for (var k = 0; k < courseList[i].unit_list[j].content_list.length; k++) {
              bareData.contentId[j][k] = courseList[i].unit_list[j].content_list[k].id;
              bareData.kl_mapper[j][k] = courseList[i].unit_list[j].content_list[k].kl_mapper;
            }
          }
        }
      } else if (courseList[i].content_type == 12) {
        bareData.type = "L";
        for (var j = 0; j < resultList[i].result_list.length; j++) {
          var try_index = resultList[i].result_list[j].try_index;
          if (!bareData.data[try_index]) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;

            bareData.data[try_index] = qr.split(",");
            bareData.wrong[try_index] = qr.split(",");
            bareData.repeat[try_index] = rc.split(",");

            bareData.contentId[try_index] = [];
            bareData.kl_mapper[try_index] = [];

            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          } else if (bareData.dataCount[try_index] < resultList[i].result_list[j].try_count) {
            var qr = resultList[i].result_list[j].question_results;
            var rc = resultList[i].result_list[j].repeat_count;

            bareData.data[try_index] = qr.split(",");
            var qr_list = qr.split(",");
            var rc_list = rc.split(",");
            for (var k = 0; k < qr_list.length; k++) {
              if (qr_list[k] == "X") {
                bareData.wrong[try_index][k] = "X";
                bareData.repeat[try_index][k] = rc_list[k];
              }
            }
            bareData.dataCount[try_index] = resultList[i].result_list[j].try_count;
          }
        }

        for (var j = 0; j < bareData.data.length; j++) {
          if (!bareData.data[j]) continue;
          for (var k = 0; k < bareData.data[j].length; k++) {
            if (bareData.data[j][k] == "-") bareData.data[j][k] = "";
          }

          // Todo. Jstar : 콘텐츠가 영상인가? 를 항상 이렇게 확인해야 하나?
          // if(courseList[i].unit_list[j])
          if (courseList[i].unit_list && courseList[i].unit_list[j]) {
            for (var k = 0; k < courseList[i].unit_list[j].content_list.length; k++) {
              if (courseList[i].unit_list[j].content_list[k].video == "1") {
                // 아마 항상 k == 0 이다.
                // 비디오는 'O' -> '1'
                if (bareData.data[j][k] == "O") bareData.data[j][k] = "1";
                // 비디오는 !'O' -> '0'
                else bareData.data[j][k] = "0";
              }
              bareData.contentId[j][k] = courseList[i].unit_list[j].content_list[k].id;
              bareData.kl_mapper[j][k] = courseList[i].unit_list[j].content_list[k].kl_mapper;
            }
          }
        }
      }

      this.bareDataList.push(bareData);
    }
  }

  // console.log('mtmListTableStatisticsCourseTruth > setRawDataWithKl :', this.bareDataList);
  this._prepareBareData(this.bareDataList);
  this.tabulator.clearData();

  this.tabulator.setData(this.dataList);

  // console.log('mtmListTableStatisticsCourseTruth > setRawDataWithKl' , this.dataList);
};

mtmListTableStatisticsCourseTruth.prototype.setStudyResultList = function (listStudy) {
  // console.log('mtmListTableStatisticsCourseTruth > setStudyResultList : ', listStudy);
  this.bareDataList = [];
  for (var i = 0; i < listStudy.length; i++) {
    if (listStudy[i].level <= 1) continue;

    // 결과가 있는 것
    if (listStudy[i].results.length <= 0) continue;
    if (listStudy[i].results[0].result.length <= 0) continue;

    var bareData = {};
    bareData.title = listStudy[i].title;
    bareData.data = [];
    bareData.wrong = [];
    bareData.repeat = [];

    if (listStudy[i].type == 11) {
      // Testum
      bareData.type = "T";
      // unit 별로
      for (var j = 0; j < listStudy[i].results.length; j++) {
        bareData.data.push(listStudy[i].results[j].result);
        var wrong = [];
        var repeat = [];
        for (var k = 0; k < listStudy[i].results[j].repeat.length; k++) {
          // 한번이라도 틀린것
          if (listStudy[i].results[j].repeat[k] > 1) {
            repeat.push(listStudy[i].results[j].repeat[k] - 1);
            wrong.push("X");
          }
          // 한번에 맞은것
          else {
            repeat.push(0);
            wrong.push("O");
          }
        }
        bareData.repeat.push(repeat);
        bareData.wrong.push(wrong);
      }
    } else if (listStudy[i].type == 12) {
      // Lesson
      bareData.type = "L";
      // unit 별로
      for (var j = 0; j < listStudy[i].results.length; j++) {
        bareData.data.push(listStudy[i].results[j].result);
        // video
        if (bareData.data[j][0] == "O") bareData.data[j][0] = "1";
        else bareData.data[j][0] = "0";

        var wrong = [];
        var repeat = [];
        for (var k = 0; k < listStudy[i].results[j].repeat.length; k++) {
          // 한번이라도 틀린것
          if (listStudy[i].results[j].repeat[k] > 1) {
            repeat.push(listStudy[i].results[j].repeat[k] - 1);
            wrong.push("X");
          }
          // 한번에 맞은것
          else {
            repeat.push(0);
            wrong.push("O");
          }
        }
        bareData.repeat.push(repeat);
        bareData.wrong.push(wrong);
      }
    }

    this.bareDataList.push(bareData);
    // console.log('bare : ',bareData);
  }

  this._prepareRowData(this.bareDataList);
  // this.tabulator.clearData();
  // console.log(this.dataList);
  this.tabulator.setData(this.dataList);
};

mtmListTableStatisticsCourseTruth.prototype.getTruthListData = function () {
  this.dataList = this.tabulator.getData();

  return this.dataList;
};

mtmListTableStatisticsCourseTruth.prototype.getTruthData = function () {
  this.dataList = this.tabulator.getData();
  var dataList = [];
  for (var i = 0; i < this.dataList.length; i++) {
    var data = {};
    data.type = this.dataList[i].type;
    data.title = this.dataList[i].title;
    data.unit_index = this.dataList[i].unit_index;
    data.value = this.dataList[i].value;
    data.wrong = this.dataList[i].wrong;
    data.repeat = this.dataList[i].repeat;
    dataList.push(data);
  }
  return dataList;
};

// 효율을 위해서는 따로 처리하는 것이 맞다.
// KL 과 결과를 따로 처리 할 것인가?
mtmListTableStatisticsCourseTruth.prototype.getTruthDataWithKl = function () {
  var dataReturn = {};

  this.dataList = this.tabulator.getData();
  var dataArray = [];
  var start_idx = 0;
  var selection = false;
  for (var i = 0; i < this.dataList.length; i++) {
    var data = {};
    data.type = this.dataList[i].type;
    data.title = this.dataList[i].title;
    data.unit_index = this.dataList[i].unit_index;
    data.value = this.dataList[i].value;
    data.wrong = this.dataList[i].wrong;
    data.repeat = this.dataList[i].repeat;
    data.kl_mapper = this.dataList[i].kl_mapper;
    data.selection = false;
    var rowData = this.tabulator.getRow(i).getData();
    if (rowData.selected) {
      data.selection = true;
      selection = true;
    }

    // for(var j=0;j<data.value.length;j++)
    // {
    //     for(var k=0; k < this.content_list[start_index].unit_list.length;k++)
    //     {
    //         for(var l=0; k<this.content_list[start_index].unit_list[k].content_list.length;l++)
    //         {
    //             var kl_mapper = this.content_list[start_index].unit_list[k].kl_mapper;
    //             data.kl_mapper.push(kl_mapper);
    //         }

    //     }
    //     start_index++;
    // }
    dataArray.push(data);
  }
  dataReturn.dataList = dataArray;
  dataReturn.content_list = this.content_list;
  dataReturn.selection = selection;
  return dataReturn;
};

mtmListTableStatisticsCourseTruth.prototype.postInit = function () {
  // this.tabulator.addData(this.dataList,true);
  // this._setData();
};

/**
 *
 */
mtmListTableStatisticsCourseTruth.prototype.clearSelection = function (bClear) {
  if (bClear) {
  } else {
  }
};

/**
 *
 */
mtmListTableStatisticsCourseTruth.prototype.setToggleIndex = function (index) {};

/**
 *
 */
mtmListTableStatisticsCourseTruth.prototype.getWrongContent = function () {};

mtmListTableStatisticsCourseTruth.prototype.makeCorrectClinicContent = function (student_id) {
  var contentNum = mtmListTableStatisticsCourseTruth.ContentNum;

  var data = this.tabulator.getData();
  this.clinicContents = [];
  this.wrongQuestionIds = [];
  var lessonUnitList = [];
  var testumUnitList = [];
  var lessonUnit = [];
  var testumUnit = [];
  var videoId = null;
  var unit_index = -1;
  var content_kind = "";
  var content_title = "";
  var title = "";
  var item_num = 0;

  for (var i = 0; i < data.length; i++) {
    var rowData = this.tabulator.getRow(i).getData();

    if (rowData.unit_index == 0 && !!rowData.title) title = rowData.title;
    if (rowData.selected) {
      console.log("mtmListTableStatisticsCourseTruth  makeCorrectClinicContent : selected", i);
      for (var k = 0; k < contentNum; k++) {
        var index = (k % contentNum) + 1;
        var field = "c" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
        var wfield = "w" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();
        var idfield = "i" + parseInt(index / contentNum).toString() + parseInt(index % contentNum).toString();

        if (rowData[field] == "1" || rowData[field] == "0") {
          // 본 video, 안 본 video
          videoId = rowData[idfield];
        } else if (rowData[field] == "X" || rowData[wfield] == "X") {
          // 틀린 값...
          // 일단 오답 문제 -> Testum 의 쌍둥이 문제는 id 가 없는 경우도 있다.
          // console.log('item X : ',item_num++);
          if (rowData[idfield] && this.wrongQuestionIds.indexOf(rowData[idfield]) < 0) {
            // 중복 안된 오답 문제
            this.wrongQuestionIds.push(rowData[idfield]); // 넣고,
            if (rowData.wtype == "T") {
              content_kind = "T";
              if (rowData.unit_index == 0) content_title = "오답 클리닉 : " + title;

              console.log("mtmListTableStatisticsCourseTruth  makeCorrectClinicContent : add Testum Question");

              testumUnit.push(rowData[idfield]);
            } else if (rowData.wtype == "L") {
              content_kind = "L";

              // if(rowData.unit_index == 0)
              content_title = "오답 클리닉 : " + title;

              if (lessonUnit.length == 0 && videoId) {
                console.log("mtmListTableStatisticsCourseTruth  makeCorrectClinicContent : add Video");
                lessonUnit.push(videoId);
              } else {
                if (lessonUnit[0] != videoId) {
                  lessonUnitList.push(lessonUnit);
                  lessonUnit = [];
                  lessonUnit.push(videoId);
                }
              }
              console.log("mtmListTableStatisticsCourseTruth  makeCorrectClinicContent : add Lesson Question");
              lessonUnit.push(rowData[idfield]);
            }
          }
          // else
          //     console.log('mtmListTableStatisticsCourseTruth  > makeCorrectClinicContent : X ',);
        }
      }
    }

    //  unit 단위로 끊으려고 하는데...
    // Todo. Jstar : unit_index 의 문제 ->
    // Lesson 과 같이 10 개 미만의 Unit 은 문제 없다.
    var bNextExist = data.length > i + 1;
    var nextRowData = null;
    if (bNextExist) nextRowData = this.tabulator.getRow(i + 1).getData();

    // nextRowData.type 는 같은 content 의 다른 row 에서는 empty 이다.
    // nextRowData.wtype => 이어지는 같은 Content 에서는 같은 type 을 나타낸다.
    if (!bNextExist || (nextRowData && nextRowData.unit_index == 0 && !!nextRowData.type)) {
      unit_index = rowData.unit_index;
      if (content_kind == "L") {
        if (lessonUnit.length > 0) {
          lessonUnitList.push(lessonUnit);
          lessonUnit = [];
        }
      } else if (content_kind == "T") {
        if (testumUnit.length > 0) {
          testumUnitList.push(testumUnit);
          testumUnit = [];
        }
      }
    }
    // 테스텀 유닛 리스트에 Data가 있고
    if (testumUnitList.length > 0 && (!bNextExist || (nextRowData && nextRowData.unit_index == 0))) {
      console.log("mtmListTableStatisticsCourseTruth  makeCorrectClinicContent : add Clinic Testum");
      // content_kind = 'T';
      if (rowData.unit_index == 0) content_title = "오답 클리닉 : " + title;
      // testum data
      var t_data = {
        branch_uuid: null, // this.branch_id,
        student_uuid: student_id,
        title: content_title, // title
        level: 1,
        code: "", //
        type: 11, // 11 or 12
        unit: testumUnitList,
      };

      this.clinicContents.push(t_data);
      testumUnitList = [];
      testumUnit = [];
    }

    // if((lessonUnitList.length > 0) && (rowData.unit_index == 0))
    if (lessonUnitList.length > 0 && (!bNextExist || (nextRowData && nextRowData.unit_index == 0))) {
      // lesson data
      // content_kind = 'L';
      console.log("mtmListTableStatisticsCourseTruth  makeCorrectClinicContent : add Clinic Testum");
      var l_data = {
        branch_uuid: null,
        student_uuid: student_id,
        title: content_title,
        code: "", //
        level: 1,
        type: 12, // 11 or 12
        unit: lessonUnitList,
      };

      this.clinicContents.push(l_data);
      lessonUnitList = [];
      lessonUnit = [];
    }
  }

  console.log("mtmListTableStatisticsCourseTruth > makeCorrectClinicContent : ", this.clinicContents);
  return this.clinicContents;
};

// Lesson 의 Unit 을 그대로 유지하자....
mtmListTableStatisticsCourseTruth.prototype.makeLessonClinicContent = function (student_id, clinic_list) {
  this.clinicContents = [];

  // var lesson_content_index = 0;
  var content_index = 0;
  // L0 와 같이 Lesson 에 Unit 이 1개만 들어 있으면 상관없다.
  // L1 과 같이 Lesson 에 여러 KL Units 이 들어 있을 경우를 고려해서
  // content_unit_index 를 사용한다.
  var content_unit_index = 0;
  // var clinic_index = 0;
  for (var i = 0; i < clinic_list.length; i++) {
    if (!clinic_list[i].valid) continue;
    if (clinic_list[i].clinic) {
      console.log("mtmListTableStatisticsCourseTruth > makeLessonClinicContent : clinic", i);
      for (; content_index < this.content_list.length; ) {
        if (this.content_list[content_index].content_type == 12) {
          // 여러 개의 Lesson Unit 을 합쳐야 하는 경우
          if (
            this.clinicContents.length > 0 &&
            this.content_list[content_index].unit_list.length > content_unit_index &&
            this.clinicContents[this.clinicContents.length - 1].index == content_index
          ) {
            var content_list = [];
            for (
              var j = 0;
              j < this.content_list[content_index].unit_list[content_unit_index].content_list.length;
              j++
            ) {
              content_list.push(this.content_list[content_index].unit_list[content_unit_index].content_list[j].id);
            }
            this.clinicContents[this.clinicContents.length - 1].unit.push(
              // this.content_list[content_index].unit_list[content_unit_index]
              content_list,
            );
          } else {
            var l_data = {
              index: content_index,
              branch_uuid: null,
              student_uuid: student_id,
              // 이름은 기존 Course 의 이름을 이용한다. 또는 Lesson KL 이름을 이용한다.
              title: this.content_list[content_index].content_title,
              code: "", //
              level: 1,
              type: 12, // 11 or 12
              unit: [],
              // unit : [this.content_list[content_index].unit_list[content_unit_index]],
            };
            var content_list = [];

            for (
              var j = 0;
              j < this.content_list[content_index].unit_list[content_unit_index].content_list.length;
              j++
            ) {
              content_list.push(this.content_list[content_index].unit_list[content_unit_index].content_list[j].id);
            }
            l_data.unit.push(content_list);

            this.clinicContents.push(l_data);
            console.log("mtmListTableStatisticsCourseTruth > makeLessonClinicContent :");
          }

          if (this.content_list[content_index].unit_list.length > content_unit_index + 1) {
            content_unit_index++;
            // break;
          } else {
            content_index++;
            content_unit_index = 0;
          }
          break;
        } else {
          content_index++;
          content_unit_index = 0;
        }
      }
    } else {
      // skip lesson
      for (; content_index < this.content_list.length; ) {
        // Lesson 추천 이므로 Lesson 을 찾자
        if (this.content_list[content_index].content_type == 12) {
          if (this.content_list[content_index].unit_list.length > content_unit_index + 1) {
            content_unit_index++;
          } else {
            content_index++;
            content_unit_index = 0;
          }
          // 찾았으니 넘어가자.
          break;
        } else {
          // Lesson 이 아니므로 계속 찾자
          content_index++;
          content_unit_index = 0;
        }
      }
    }

    // overflow end
    if (content_index >= this.content_list.length) break;
  }

  console.log("mtmListTableStatisticsCourseTruth > makeLessonClinicContent : ", this.clinicContents);
  return this.clinicContents;
};

// Lesson 의 Unit을 풀어 헤지자.
mtmListTableStatisticsCourseTruth.prototype.makeLessonClinicContentWithOneUnit = function (student_id, clinic_list) {
  this.clinicContents = [];

  // var lesson_content_index = 0;
  var content_index = 0;
  // L0 와 같이 Lesson 에 Unit 이 1개만 들어 있으면 상관없다.
  // L1 과 같이 Lesson 에 여러 KL Units 이 들어 있을 경우를 고려해서
  // content_unit_index 를 사용한다.
  var content_unit_index = 0;
  // var clinic_index = 0;
  // console.log('mtmListTableStatisticsCourseTruth > makeLessonClinicContentWithOneUnit : clinic_list', clinic_list);

  for (var i = 0; i < clinic_list.length; i++) {
    if (!clinic_list[i].valid) continue;
    if (clinic_list[i].clinic) {
      console.log("mtmListTableStatisticsCourseTruth > makeLessonClinicContentWithOneUnit : clinic", i);
      for (; content_index < this.content_list.length; ) {
        if (this.content_list[content_index].content_type == 12) {
          var l_data = {
            index: content_index,
            branch_uuid: null,
            student_uuid: student_id,
            // title: this.content_list[content_index].content_title,
            // 이름은 Lesson KL 을 이용한다.
            title: clinic_list[i].title,
            code: "", //
            level: 1,
            type: 12, // 11 or 12
            unit: [],
            // [this.content_list[content_index].unit_list[content_unit_index]],
          };

          var content_list = [];

          for (var j = 0; j < this.content_list[content_index].unit_list[content_unit_index].content_list.length; j++) {
            content_list.push(this.content_list[content_index].unit_list[content_unit_index].content_list[j].id);
          }
          l_data.unit.push(content_list);
          this.clinicContents.push(l_data);

          if (this.content_list[content_index].unit_list.length > content_unit_index + 1) {
            content_unit_index++;
            // break;
          } else {
            content_index++;
            content_unit_index = 0;
          }
          break;
        } else {
          content_index++;
          content_unit_index = 0;
        }
      }
    } else {
      // skip lesson
      for (; content_index < this.content_list.length; ) {
        // Lesson 추천 이므로 Lesson 을 찾자
        if (this.content_list[content_index].content_type == 12) {
          if (this.content_list[content_index].unit_list.length > content_unit_index + 1) {
            content_unit_index++;
            // break;
          } else {
            content_index++;
            content_unit_index = 0;
          }
          // 찾았으니 넘어가자.
          break;
        } else {
          // Lesson 이 아니므로 계속 찾자
          content_index++;
          content_unit_index = 0;
        }
      }
    }

    // overflow end
    if (content_index >= this.content_list.length) break;
  }

  console.log("mtmListTableStatisticsCourseTruth > makeLessonClinicContentWithOneUnit : ", this.clinicContents);
  return this.clinicContents;
};
