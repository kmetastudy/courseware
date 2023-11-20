export function Sidebar(options) {
    this.options = options;
    this.elThis = null;
    this.create();
  }
  
  Sidebar.prototype.create = function () {
    var subjectEng = {
      국어: "kor",
      영어: "eng",
      수학: "math",
      사회: "soc",
      역사: "hist",
      한국사: "korhist",
      과학: "sci",
      정보: "info",
      도덕: "mor",
    };
    var $elSubjects = $('<div class="sidebar-container border"></div>');
    this.options.subject_list.forEach(function (subject) {
      var $elSubject =
        $(`<div class="p-4 border-b text-base cursor-pointer" onclick="location.href='../${subjectEng[subject]}'">
                              <i class="ri-book-line"></i>
                              ${subject}
                          </div>`);
  
      // $elSubject.on("click",function(){
      //     // console.log(this.innerText)
      //     // var header = $('.courses_header').text()
      //     // $('.courses_header').text(header.split('/')[0]+' / '+this.innerText)
  
      //     $.ajax({
      //         url:'courses/getCourses/',
      //         type: 'POST',
      //         data: { courseId : courseId },
      //         headers: { "X-CSRFTOKEN": csrftoken },
      //         success:function(res){
      //             if(res.data != null){
      //                 console.log(res.data)
      //                 contentDetailOption = res.data
      //             }
  
      //         },
      //         error:function(){
  
      //         }
      //     })
      // })
  
      $elSubjects.append($elSubject);
    });
  
    this.elThis = $elSubjects;
  };
  