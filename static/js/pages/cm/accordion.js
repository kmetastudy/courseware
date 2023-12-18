export function Accordion(options) {
  /*[
      {
        title: banner
        url: /banner
        icon:
        submenu: true
        subMenuItems: [title,path]
      } ...
    ]
  */
  this.options = options;
  this.elThis = null;
  this.create();
}
  
Accordion.prototype.create = function () {
  var self = this
  var $elMenuList = $(`<div class="cursor-pointer"></div>`)
  this.options.forEach(function(option) {
    if(option.submenu == true) {
      var $elMenu = $(`<div class="">
                        <div class="px-6 pt-4 flex justify-between items-center">
                          <div class="flex items-center">
                            <i class="${option.icon}"></i>
                            <p class="px-2">${option.title}</p class="">
                          </div>
                          <i class="ri-arrow-right-s-line hidden"></i>
                          <i class="ri-arrow-down-s-line"></i>
                        </div>
                        <ul class="subMenu px-8 py-2">
                        </ul>
                      </div>`);

      option.subMenuItems.forEach(function(subMenu) {
        var $elSubMenu = $(`<li class="border-l" onclick="window.location.href='./${subMenu.url}'"><p class="px-4 py-2 text-sm">${subMenu.title}</p></li>`)

        $elMenu.find('.subMenu').append($elSubMenu)
      })
      $elMenu.on("click", () => self.toggleMenu($elMenu))

      $elMenuList.append($elMenu)
      
    } else {
      var $elMenu = $(`<div class="px-6 pt-4 flex items-center" onclick="window.location.href='./${option.url}'">
                        <div class="flex items-center">
                        <i class="${option.icon}"></i>
                        <p class="px-2">${option.title}</p>
                        </div>
                      </div>`);

      $elMenuList.append($elMenu)
    }

  });

  this.elThis = $elMenuList;
};  

Accordion.prototype.toggleMenu = function(obj) {
  obj.find('ul').toggleClass('hidden')
  obj.find('i:eq(1)').toggleClass('hidden')
  obj.find('i:eq(2)').toggleClass('hidden')


}