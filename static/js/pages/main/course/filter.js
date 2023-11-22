export function Filter(options) {
    /*
        {
            title:[
                {text,type,onClick}
                ...
            ]
            ...
        }
    */
    this.options = options
    this.elThis = null

    this.create()
}

Filter.prototype.create = function() {
    var $elFilterList = $(`<div class="flex justify-center items-center"></div>`)
    for (const [key, values] of Object.entries(this.options)) {
        values.forEach(function (value) {
            var $elFilter = $(
              `<div class="${key} mx-2 px-2 py-1 rounded-full border text-sm cursor-pointer">${value.text}</div>`,
            );

            $elFilter.on("click", function () {
                $(this).toggleClass("border-[#08A843]");
                value.onClick(key, value.type)
            });

            $elFilterList.append($elFilter);
        });
        $elFilterList.append(`<div class="mx-1 text-gray-500">|</div>`);
    }
    this.elThis = $elFilterList
}