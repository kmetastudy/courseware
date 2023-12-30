import { Button } from "./mtu-button"
import { FilterUnit } from "./mtu-filter"
import { SchoolSelectUnit } from "./mtu-school-select"

export function FilterView(options) {
    /*
        {
            title:[
                {text,type,onClick}
                ...
            ]
            ...
        }
    */
    this.options = {}
    this.options.filter = options
    this.elThis = null

    this.init()
}

FilterView.prototype.init = function() {
    // 학교 선택 드롭다운, 필터 리스트, 검색 버튼 

    this.options.kor = {grade:'학년', semester:'학기', publisher:'교과서', difficulty:'난이도'}

    var $elFilterView = $(`<div class="w-full p-2 border"></div>`)

    // 타켓학교 학교선택
    // var clSchoolSelect = new SchoolSelectUnit()
    // $elFilterView.append(clSchoolSelect.elThis)

    // 분류 필터 선택
    var clFilterUnit = new FilterUnit(this.options)
    $elFilterView.append(clFilterUnit.elThis)

    // 검색 버튼
    // this.options.button = {title:'검색', style:'my-2 px-4 py-1 w-full rounded-full bg-[#1E40AF] text-white hover:bg-blue-700'}
    // var clButton = new Button(this.options.button)
    // $elFilterView.append(clButton.elThis)

    this.elThis=$elFilterView

}