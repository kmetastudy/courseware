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
  var $elSidebarList = $('<div class="sidebar-container w-[150px] border fixed hidden md:block"></div>');
  this.options.forEach(function(option) {
    var $elSidebar =
      $(`<div class="px-4 py-3 flex justify-between border-b text-sm cursor-pointer bg-[#FAFAFA]">
            ${option.title}
            <i class="ri-arrow-right-s-line"></i>
        </div>`);

    
    // console.log(option.onClick)
    $elSidebar.on("click", function() {
      option.onClick(option.title, option.url)
      $elSidebarList.children().removeClass('bg-[#1E40AF]')
      this.classList.remove('bg-[#FAFAFA]')
      this.classList.add('bg-[#1E40AF]')
      $elSidebarList.children().removeClass('text-white')
      this.classList.add('text-white')
      
    });

    $elSidebarList.append($elSidebar);
  });

  this.elThis = $elSidebarList;
};
  