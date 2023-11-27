export function Sidebar(options) {
  /*[
      {
        title: text(kor)
        url: text(end)
        onClick: handler
      } ...
    ]
  */
  this.options = options;
  this.elThis = null;
  this.create();
}
  
Sidebar.prototype.create = function () {
  var $elSidebarList = $('<div class="sidebar-container border"></div>');
  this.options.forEach(function(option) {
    var $elSidebar =
      $(`<div class="p-4 border-b text-base cursor-pointer">
            <i class="ri-book-line"></i>
            ${option.title}
        </div>`);

    
    // console.log(option.onClick)
    $elSidebar.on("click", () => option.onClick(option.title, option.url));

    $elSidebarList.append($elSidebar);
  });

  this.elThis = $elSidebarList;
};
  