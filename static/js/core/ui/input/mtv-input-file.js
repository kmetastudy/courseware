// Custom CSS Styles for Form Inputs and Textareas
// https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/

// 9 Custom Open Source File Upload Field Snippets
// https://speckyboy.com/custom-file-upload-fields/
// 9. Multi-Upload Fields

// input type="file" 커스터마이징 하는 방법
// https://helloinyong.tistory.com/275

// input[type="file"] 커스터마이징
// https://velog.io/@sklove96/inputtypefile-커스텀하기

// Using files from web applications
// https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications

// Pure CSS File Upload Field
// https://codepen.io/adamlaki/pen/VYpewx

import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtvInputFile = function(options) {
    this.index = mtvInputFile.id++;
    this.id = 'id-mtv-input-file-' + this.index;
    this.elThis = null;
    this.elInput = null;
    this.elFileName = null;
    // for element matching
    this.elCompList = null;
    // this.elsArray = ['elThis',null,null,null,null,null,'elInput'];
    this.elsArray = ['elThis',null,'elInput','elFileName'];
    this.elsObject = {};

    this.value = "";

    if(!options)
        this.options = {};
    else
        this.options = options;

    if(!this.options.placeholder)
        this.options.placeholder = '입력하세요';
    if(!this.options.title)
        this.options.title = '입력값';

    this.init();
}

mtvInputFile.id = 0;
mtvInputFile.defaultName = '선택된 파일 없음';

// http://file.increk-tlink.com/tlink_user/
// http://file.increk-tlink.com/downloads/tlink-server.txt
mtvInputFile.staticBody = [
    // <div class="form-group">
    //     <div class="input-group">
    //         <input type="text" class="form-control" readonly>
    //         <div class="input-group-btn">
    //             <span class="mtv-input-file btn btn-success">
    //                 <span class="upl" id="upload">Upload single file</span>
    //                 <input type="file" class="upload up" id="up" onchange="readURL(this);" />
    //             </span><!-- btn-orange -->
    //         </div><!-- btn -->
    //     </div><!-- group -->
    // </div><!-- form-group -->

    // {'step':0, 'tag':'div', 'class' :'class-mtv-input-file form-group',},
    //     {'step':1, 'tag':'div','class' :'input-group',},
    //         {'step':1, 'tag':'div', 'class' :'input-group-btn', 'attr' : {'type':'text',}, 'prop':{'readonly':true,},},
    //             {'step':1, 'tag':'span','class' :'mtv-input-file btn btn-sucess',},
    //                 {'step':1, 'tag':'span','class' :'upl', 'text' : 'Upload single file'},
    //                 {'step':0, 'tag':'input','class' :'upload up', 'text' : 'Upload single file','attr' : {'type':'file',},},
                    
    //         {'step':-2, 'tag':'input', 'class' :'form-control', 'attr' : {'type':'text',}, 'prop':{'readonly':true,},},

    // [CSS] input type=file CSS적용하기
    // https://gahyun-web-diary.tistory.com/83

    // <div class="class-mtv-input-file"> 
    //     <label for="file">업로드</label> 
    //     <input type="file" id="file"> 
        
    //     <input class="upload-name" value="파일선택">
    // </div>
    { 'step': 0 , 'tag':'div', 'class' : 'class-mtv-input-file',},
        { 'step' : 1 ,'tag':'label','text':'<i class="fa fa-file-text-o"> </i> 업로드','attr' :{'for':'',},},
        { 'step' : 0 ,'tag':'input', 'id':'', 'attr' :{'type':'file',},},
        { 'step' : 0 ,'tag':'input', 'class':'class-mtv-input-file-name', 
            'attr' :{'type':'text', 'value':mtvInputFile.defaultName,'spellcheck':'false' },
            'prop' : {'readonly':true,},    
        },
        
        
    // <div class="form-group">
    //     <div class="input-group">
    //         <input type="text" class="form-control" readonly>
    //         <div class="input-group-btn">
    //             <span class="mtv-input-file btn btn-info">
    //                 <span class="upl" id="upload">Upload multiple file</span>
    //                 <input type="file" class="upload up" id="up" onchange="readURL(this);" multiple/>
    //             </span><!-- btn-orange -->
    //         </div><!-- btn -->
    //     </div><!-- group -->
    // </div><!-- form-group -->
];

mtvInputFile.prototype.changeFileHandler = function() {
    if(!this.elsObject.elInput.value)
    this.value = this.elsObject.elFileName.value = mtvInputFile.defaultName;
    else
        this.value = this.elsObject.elFileName.value = this.elsObject.elInput.value;
    console.log('mtvInputFile : value ', this.value);
}

mtvInputFile.prototype.initEvents = function() {
    this.elsObject.elInput.addEventListener('change',this.changeFileHandler.bind(this));

}

mtvInputFile.prototype.matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtvInputFile.prototype.create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputFile.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;

}


mtvInputFile.prototype.prepare = function() {
    mtvInputFile.staticBody[1]['attr']['for'] = 'id-mtv-input-file-input-' + this.index;
    mtvInputFile.staticBody[2]['id'] = 'id-mtv-input-file-input-' + this.index;
    // mtvInputFile.staticBody[3]['attr']['value'] = mtvInputFile.defaultName;   
}

mtvInputFile.prototype.init = function() {
    this.prepare();
    this.create();
    this.matchElements();
    this.initEvents();
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API //////////////////////////////////////
mtvInputFile.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtvInputFile.prototype.getValue = function() {

    return this.value;
}