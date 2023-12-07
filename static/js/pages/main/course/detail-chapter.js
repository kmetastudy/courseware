export function DetailChapter(courseId){
    this.data = null
    this.courseId = courseId
    this.elThis = null
    this.init()
}

DetailChapter.prototype.init = async function() {
    var chapter_list = await this.getChapter()
    var $elChapterList = $('<div class="p-2"></div>')
    // console.log(chapter_list.level1)
    chapter_list.level1.forEach((title, index) => {
        var $large = $(`<div class="">
                            <div class="p-2 border bg-gray-100 flex justify-between">
                                <p class="text-sm">${title}</p>
                                <i class="ri-arrow-down-s-line"></i>
                                <i class="ri-arrow-up-s-line hidden"></i>
                            </div>
                            <ul class="hidden"></ul>
                        </div>`)

        if(chapter_list.level2[index].length == 0){
            // console.log($large[0].children[0].children[2])
            $large[0].children[0].children[1].remove()
            // $large.children[0].children[2].remove()
        }

        // console.log(chapter_list.level2[index])
        chapter_list.level2[index].forEach(title2 => {
            var replaced_title = title2.replace(/[1-9]+\./,'')
            var $small = $(`<li class="p-2 border text-sm cursor-default"><i class="ri-play-circle-line"></i> ${replaced_title}</li>`)
            $large.children('ul').append($small)
        })
        // console.log($large[0].firstElementChild)
        $large[0].firstElementChild.addEventListener('click', function() {
            if(this.children[1].classList.contains('ri-arrow-down-s-line')){
                this.children[1].classList.toggle('hidden')
                this.children[2].classList.toggle('hidden')
            }
            
            this.nextElementSibling.classList.toggle('hidden')
        })
        
        $elChapterList.append($large)
        this.elThis = $elChapterList
    })
    
    $(".course_chapter").append(this.elThis)
}

DetailChapter.prototype.getChapter = async function() {
    var level1=[]
    var level2_list=[]
    var level2=[]
    
    $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        type: "POST",
        url: "/chapter/",
        async: false,
        data: {"courseId":this.courseId},
        success: function (res) {
          
          var data = JSON.parse(res.data)
          var chapters = data.lists

          
          chapters.forEach((chapter, index) => {
            if(index == 0){
                level1.push(chapter.title)
                return true
            }
            if(chapter.level == 1){
                level1.push(chapter.title)
                level2_list.push(level2)
                level2=[]
            } else if(chapter.level == 2){
                level2.push(chapter.title)
            }
            
          });
          level2_list.push(level2)
        }, //end success
    }); // end of ajax

    return {"level1":level1, "level2":level2_list}
}