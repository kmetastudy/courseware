export function SchoolSelectUnit() {
    this.options = null
    this.elThis = null

    this.create()
}

SchoolSelectUnit.prototype.create = function() {
    var $elGroup = $(`<div class="flex items-center p-2">
                                    <p class="flex-none w-[60px]">학교</p>
                                </div>`)

    var $elLargeUnit = $(`<select name="Large" class="mx-1 px-3 py-1 text-xs">
                            <option>전체지역</option>
                        </select>`)

    var $elMediumUnit = $(`<select name="Medium" class="mx-1 px-3 py-1 text-xs">
                            <option>시/구/군</option>
                        </select>`)

    var $elSmallUnit = $(`<select name="Small" class="mx-1 px-3 py-1 text-xs">
                            <option>학교선택</option>
                        </select>`)

    $elGroup.append($elLargeUnit)
    $elGroup.append($elMediumUnit)
    $elGroup.append($elSmallUnit)

    this.elThis = $elGroup
}