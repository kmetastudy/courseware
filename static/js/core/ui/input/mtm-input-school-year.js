// School Year == Academic Year == Academic Term
// Category Year == 
// 기타 다른 선택 Box + 좌/우 Arrow Button
// 가운데를 선택하면 현재 Year 를 나타낸다.
// 

// 이렇게 날짜/시간 과 관계되어 선택하고자 하는 Item 들은
// 1) 관련된 기간에 Item 이 있는가 ? 를 어떻게 보여줘야 하는가?
// 2) Item 이 없는 시간대에 어떻게 접급해야 하는가?

// mtv/core/input/mtv(m)-input-select-year.js
// mtv/core/input/mtm-input-select-scoll.js
// 위 두개를 결합한다.

export var mtmInputSchoolYear = function(options) {
    
    this.id = 'id-mtm-input-school-year-' + mtmInputSchoolYear.id++;
    this.elThis = null;
    this.elLeft = null;
    this.elYear = null;
    this.elRight = null;
    
    // for elements matching
    this.elCompList = null;
    this.elsArray = ['elThis','elLeft','elYear','elRight'];
    this.elsObject = {};

    this.today = new Date();
    this.year = this.today.getFullYear();
    this.currentYear = this.year;

    this._init();
}

mtmInputSchoolYear.id = 0;

mtmInputSchoolYear.prototype._init = function() {
    
}

