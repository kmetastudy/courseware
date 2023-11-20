import { ContentDetail } from "./content-detail" 
export function ContentsManager() {
    this.options = null
    this.elThis = null
    this.tabledata=[]

    this.init()
}

ContentsManager.prototype.init = async function() {
    this.elThis = document.createElement('div')
    //코스 테이블
    // this.tabledata = [
    //     {id:1, title:"Course1", icon:`<i class="fa-solid fa-pencil" style="color: #000000;"></i>`}
    // ]
    await this.getCourseBook()
    this.elTable = document.createElement('div')
    this.tabulator = new Tabulator(this.elTable, {
        data:this.tabledata,
        layout:"fitColumns",
        columns:[
            {title:"코스 id", field:"id", visible:false},
            {title:"코스이름", field:"title"},
            {title:"수정", field:"icon"}
        ]
    })

    this.tabulator.on("rowClick", async function(e, row){ 
        // alert("Row " + row.getData().title + " Clicked!!!!");
        // alert("Row " + row.getData().id + " Clicked!!!!");
        var title = row.getData().title
        var courseId = row.getData().id
        console.log(courseId)

        var contentDetailOption = {courseId:courseId, courseTitle:title}

        $.ajax({
            url:'getDetail/',
            type: 'POST',
            data: { courseId : courseId },
            headers: { "X-CSRFTOKEN": csrftoken },
            success:function(res){
                if(res.data != null){
                    console.log(res.data)
                    contentDetailOption = res.data
                }
                
                var clDetail = new ContentDetail(contentDetailOption)
            },
            error:function(){
                
            }
        })

        
    });

    this.elThis.appendChild(this.elTable)
}

// ContentsManager.prototype.getContentDetail = async function(id) {
//     await axios.post('getDetail/', {
//         data: {
//             id: id
//         },
//         headers: { "X-CSRFTOKEN": csrftoken }
//     }).then((res) => {
//         console.log(res)
//     }). catch ((err) => {
//         console.log('error')
//     })
// }

ContentsManager.prototype.getCourseBook = async function() {
    try {
        const result = await axios.get('getCourseBook/')
        console.log(result.data.book)
        var books = result.data.book
        books.forEach(book => {
            this.tabledata.push(book)
        });
    } catch {
        console.log('error')
    }
}