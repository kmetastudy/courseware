export function FilterUnit(options) {
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

FilterUnit.prototype.create = function() {

    var $elFilterList = $(`<div class="flex-1 justify-start items-center"></div>`)
    for (const [key, values] of Object.entries(this.options.filter)) {
        var $elFilterGroup = $(`<div class="flex items-center p-2">
                                    <p class="flex-none w-[60px]">${this.options.kor[key]}</p>
                                    <div class="flex overflow-x-auto"></div>
                                </div>`)
        values.forEach(function (value) {
            var $elFilterUnit = $(
              `<div class="${key} mx-1 px-3 py-2 flex-none rounded-full ring ring-1 ring-gray-200 ring-inset text-xs cursor-pointer">${value.text}</div>`,
            );

            $elFilterUnit.on("click", function () {
                $(this).toggleClass("ring-blue-500");
                $(this).toggleClass("ring-2");
                // $(this).toggleClass("text-blue-700");
                value.onClick(key, value.type)
            });

            $elFilterGroup.children('div').append($elFilterUnit);
        });
        $elFilterList.append($elFilterGroup);
    }

    // $elFilterList.append($elSearch)

    this.elThis = $elFilterList
}

FilterUnit.prototype.toggleMenu = function(obj) {
    obj.find('ul').toggleClass('hidden')
    obj.find('i:eq(1)').toggleClass('hidden')
    obj.find('i:eq(2)').toggleClass('hidden')
    obj.toggleClass("ring-blue-500");
    obj.toggleClass("ring-2");
    // $(this).toggleClass("text-blue-700");
    value.onClick(key, value.type)
}