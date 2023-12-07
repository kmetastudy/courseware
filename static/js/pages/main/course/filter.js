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
    var $elFilterList = $(`<div class="flex-1 flex flex-wrap justify-start items-center"></div>`)
    for (const [key, values] of Object.entries(this.options)) {
        var $elFilterGroup = $(`<div class="flex py-2 "></div>`)
        values.forEach(function (value) {
            var $elFilter = $(
              `<div class="${key} mx-1 px-3 py-2 flex-none rounded-full ring ring-1 ring-gray-200 ring-inset text-xs cursor-pointer">${value.text}</div>`,
            );

            $elFilter.on("click", function () {
                $(this).toggleClass("ring-blue-500");
                $(this).toggleClass("ring-2");
                // $(this).toggleClass("text-blue-700");
                value.onClick(key, value.type)
            });

            $elFilterGroup.append($elFilter);
        });
        $elFilterList.append($elFilterGroup);
        $elFilterList.append(`<div class="mx-1 text-gray-400">|</div>`);
    }

    


    // $elFilterList.append($elSearch)

    this.elThis = $elFilterList
}