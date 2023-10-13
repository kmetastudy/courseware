// 1. sortable
// 2. get the index
// 3. checkbox
// 4. pagination
// 5. CRUD
// 6. filter(optional)

export const mtmTabulator = function () {
  this._init();
};

let mtmTabulatorId = 0;

mtmTabulator.prototype._init = function () {
  this.create();
  this.initConfig();
  this._initTabulator();
  this._initEvents();
};

mtmTabulator.prototype.create = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", `mtm-tabulator-wrapper-${mtmTabulatorId++}`);
};

mtmTabulator.prototype.initConfig = function () {
  const defaultConfig = {
    // height: "311px",
    layout: "fitDataTable",
    movableRows: true,
    pagination: true,
    columns: [
      // {formatter:"rowSelection", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, cellClick:function(e, cell){
      //   cell.getRow().toggleSelect();
      // }},
      { rowHandle: true, formatter: "handle" },
      { title: "Title", field: "title" },
      { title: "Description", field: "description" },
      { title: "Category", field: "category" },
    ],
    data: [
      { title: "중1-1", description: "중1-1 설명입니다.", category: "math" },
      { title: "중3-1", description: "중3-1 설명입니다.", category: "math" },
    ],
  };
};

mtmTabulator.prototype._initTabulator = function () {
  this.table = new Tabulator(this.elThis, this.config);
};

mtmTabulator.prototype._initEvents = function () {
  this.table.on("rowMoved", this.handleRowMoved.bind(this));
  this.table.on("rowClick", this.handleRowClick.bind(this));
};

mtmTabulator.prototype.handleRowMoved = function (row) {
  console.log("Row: " + row.getData().name + " has been moved");
};

mtmTabulator.prototype.handleRowClick = function (e, row) {
  console.log(e, row);
};
