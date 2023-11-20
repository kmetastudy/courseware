import { Editor } from "./editor"
import { Button } from "./button"

export function ContentDetail(options){
    this.options = options
    this.elThis = null

    this.year = null
    this.school = null
    this.grade = null
    this.semester = null
    this.subject = null
    this.publisher = null
    this.difficulty = null

    this.courseId = null
    this.courseTitle = null
    this.courseSummary = null
    this.desc = null

    this.init()
}

ContentDetail.prototype.init = function() {
    this.create()
    this.checkDetail()

    $('#close-modal').on("click",() => {
        $('#modal').remove()
    })

}

ContentDetail.prototype.create = function() {
    this.elCategory = $(`<div id="modal">
                            <form id="formEl" class="modal-content" name="myform" method="post">
                                <div class="flex justify-between">
                                    <h2>세부 정보</h2>
                                    <div id="close-modal" class="cursor-pointer">x</div>
                                </div>    
                                <div class="flex">
                                    <div>
                                        <div class="flex">
                                            <p>학년도</p>
                                            <select name="year">
                                                <option value="2023">2023</option>
                                            </select>
                                        </div>
                                        <div class="flex">
                                            <p>학교</p>
                                            <label><input type="radio" name="school" value="element"/>초등학교</label>
                                            <label><input type="radio" name="school" value="middle"/>중학교</label>
                                            <label><input type="radio" name="school" value="high"/>고등학교</label>
                                        </div>
                                        <div class="flex">
                                            <p>학년</p>
                                            <label><input type="radio" name="grade" value="1"/>1학년</label>
                                            <label><input type="radio" name="grade" value="2"/>2학년</label>
                                            <label><input type="radio" name="grade" value="3"/>3학년</label>
                                        </div>
                                        <div class="flex">
                                            <p>학기</p>
                                            <label><input type="radio" name="semester" value="0"/>전학기</label>
                                            <label><input type="radio" name="semester" value="1"/>1학기</label>
                                            <label><input type="radio" name="semester" value="2"/>2학기</label>
                                        </div>
                                        <div class="flex">
                                            <p>과목</p>
                                            <label><input type="radio" name="subject" value="kor"/>국어</label>
                                            <label><input type="radio" name="subject" value="eng"/>영어</label>
                                            <label><input type="radio" name="subject" value="math"/>수학</label>
                                            <label><input type="radio" name="subject" value="sci"/>과학</label>
                                            <label><input type="radio" name="subject" value="info"/>정보</label>
                                            <label><input type="radio" name="subject" value="etc"/>기타</label>
                                        </div>
                                        <div class="flex">
                                            <p>출판사</p>
                                            <select name="publisher">
                                                <option value="null">없음</option>    
                                                <option value="visang">비상</option>
                                            </select>
                                        </div>
                                        <div class="flex">
                                            <p>난이도</p>
                                            <label><input type="radio" name="difficulty" value="3"/>상</label>
                                            <label><input type="radio" name="difficulty" value="2"/>중</label>
                                            <label><input type="radio" name="difficulty" value="1"/>하</label>
                                        </div>
                                        <div class="flex">
                                            <p>수강기간</p>
                                            <input type="text" name="duration" class="border"/>
                                            <p>일</p>
                                        </div>
                                        <div class="flex">
                                            <p>금액</p>
                                            <input type="text" name="cost" class="border"/>
                                            <p>원</p>
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex">
                                            <div>
                                                <div class="flex">
                                                    <p>코스 ID</p>
                                                    <input type="text" name="courseId" class="border" value="${this.options.courseId}"/>
                                                </div>
                                                <div class="flex">
                                                    <p>코스 제목</p>
                                                    <input type="text" name="courseTitle" class="border" value="${this.options.courseTitle}"/>
                                                </div>
                                                <div class="flex">
                                                    <p>요약</p>
                                                    <input type="text" name="courseSummary" class="border"/>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="flex">
                                                    <p>썸네일</p>
                                                    <div>이미지</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col items-stretch">
                                            <p>상세 설명</p>
                                            <div id="editor" class="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>`)

    this.initEditor()


    // 저장 버튼
    const saveOption = {
        onButtonClick: this.handleSaveButtonClick.bind(this),
    };
    this.saveButton = new Button("save", saveOption);
    this.elSaveButton = this.saveButton.getRootElement();
    this.elCategory.children('form').append(this.elSaveButton);

    // console.log(this.elCategory)
    

    $('.cm-landing').append(this.elCategory)

}

ContentDetail.prototype.initEditor = function() {
    const editorOption = {
        onEditorDataChange: this.handleEditorDataChange.bind(this),
    };
    this.clEditor = new Editor(editorOption)
    this.elEditor = this.clEditor.getRootElement()
    this.elCategory.find('#editor').append(this.elEditor)
}

ContentDetail.prototype.checkDetail = function() {

    var $node = this.elCategory
    // console.log($node)
    // console.log($node===this.elCategory)

    var optionKeys = Object.entries(this.options)

    optionKeys.forEach(function(optionKey) {
        // console.log(optionKey)
        // this.elCategory.find('input[name="school"][value="mid"]').attr('checked', true)
        var inputNode = $node.find(`[name="${optionKey[0]}"]`)

        // 라디오 버튼 체크
        if (inputNode.first().attr('type') == 'radio'){
            $node.find(`input[name="${optionKey[0]}"][value="${optionKey[1]}"]`).attr('checked', true)
        } else if(inputNode.first().attr('type') == 'text') {
            // console.log(inputNode)
            $node.find(`[name="${optionKey[0]}"]`).attr('value', optionKey[1])
        } else {

        }
    })

}


// ------------------------ handler ----------------------------------------

ContentDetail.prototype.handleEditorDataChange = function(data) {
    this.desc = data
}

ContentDetail.prototype.handleSaveButtonClick = function() {

    var formData = new FormData(formEl)
    // formData.append('year',myform.year.value)
    // formData.append('school',myform.school.value)
    // formData.append('grade',myform.grade.value)
    // formData.append('semester',myform.semester.value)
    // formData.append('subject',myform.subject.value)
    // formData.append('publisher',myform.publisher.value)
    // formData.append('difficulty',myform.difficulty.value)
    // formData.append('duration',myform.duration.value)
    // formData.append('cost',myform.cost.value)

    // formData.append('courseId',myform.courseId.value)
    // formData.append('courseTitle',myform.courseTitle.value)
    // formData.append('courseSummary',myform.courseSummary.value)
    formData.append('content',this.desc)

    axios.post('setDetail/',formData, {headers: { "X-CSRFTOKEN": csrftoken }}).then((res) => {
        console.log(res)
    }). catch ((err) => {
        console.log('error')
    })
}




