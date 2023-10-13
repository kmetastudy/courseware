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
// require('../../../../css/mtv/core/input/mtm-input-file.css');
require('./mtm-input-file.css');

export var mtmInputFile = function(options) {
    this.index = mtmInputFile.id++;
    this.id = 'id-mtm-input-file-' + this.index;
    this.elThis = null;
    this.elInput = null;
    this.elFileName = null;
    // for element matching
    this.elCompList = null;
    // this.elsArray = ['elThis',null,null,null,null,null,'elInput'];
    this.elsArray = ['elThis','elInput','elFileName','elUpload'];
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

    this._init();
}

mtmInputFile.id = 0;
mtmInputFile.defaultName = '선택된 파일 없음';

// http://file.increk-tlink.com/tlink_user/
// http://file.increk-tlink.com/downloads/tlink-server.txt
mtmInputFile.staticBody = [
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
    { 'step': 0 , 'tag':'div', 'class' : 'class-mtm-input-file',},
        { 'step' : 1 ,'tag':'input', 'id':'', 'attr' :{'type':'file',},},
        { 'step' : 0 ,'tag':'label', 'class':'class-mtm-input-file-name', 
            // 'attr' :{'type':'text', 'value':mtmInputFile.defaultName,'spellcheck':'false' },
            // 'prop' : {'readonly':true,},    
            'text':mtmInputFile.defaultName,
            'attr' :{'for':'',},
        },
        { 'step' : 0 ,'tag':'label','class' : 'class-mtm-upload-btn' , 
            'text':'<i class="fa fa-file-text-o"> </i> 업로드','attr' :{'for':'',},
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

mtmInputFile.prototype._initEvents = function() {
    this.elsObject.elInput.addEventListener('change',this.onChangeFileHandler.bind(this));
    this.elsObject.elUpload.addEventListener('click',this.onUploadFileHandler.bind(this));
}

mtmInputFile.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    this.elsObject.elUpload.classList.add('inactive');
    this.elsObject.elFileName.innerHTML = this.options.placeholder;
    // console.log('mtmInputFile > this.elsObject : ', this.elsObject);
}

mtmInputFile.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputFile.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    if(this.options && this.options.classList)
    {
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    }
    // 옵션 스타일 적용
    // options for style
    if(this.options && this.options.width)
        this.elThis.style.width = this.options.width;

}


mtmInputFile.prototype._prepare = function() {
    mtmInputFile.staticBody[2]['attr']['for'] = 'id-mtm-input-file-input-' + this.index;
    mtmInputFile.staticBody[1]['id'] = 'id-mtm-input-file-input-' + this.index;
    // mtmInputFile.staticBody[3]['attr']['value'] = mtmInputFile.defaultName;   
}

mtmInputFile.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler ///////////////////////////////////
mtmInputFile.prototype.onChangeFileHandler = function() {
    var value = '';
    if(!this.elsObject.elInput.value)
    {
        // this.value = this.elsObject.elFileName.innerHTML = mtmInputFile.defaultName;
        this.value = ''; 
        value = this.options.placeholder;
    }
    else
    {
        // this.value = this.elsObject.elFileName.innerHTML = this.elsObject.elInput.value;
        this.value = this.elsObject.elInput.value;
        value = this.elsObject.elInput.value;
    }

    value = value.replace(/.*(\/|\\)/, '');

    if(this.elsObject.elInput.value)
    {
        this.value = value;
        // this.elsObject.elUpload.disabled = false;
        this.elsObject.elUpload.classList.remove('inactive');
    
    }
    else
    {
        this.elsObject.elUpload.classList.add('inactive');
    }

    this.elsObject.elFileName.innerHTML = value;
    console.log('mtmInputFile : value ', value);
}

mtmInputFile.prototype.onUploadFileHandler = function() {
    if(this.elsObject.elUpload.classList.contains('inactive'))
        return;
    this.elsObject.elUpload.classList.add('inactive');
    // console.log('mtmInputFile > onUploadFileHandler : ', this.value);
    if(this.options && this.options.eventUpload)
        this.options.eventUpload(this.elsObject.elInput.files);
}
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API //////////////////////////////////////
mtmInputFile.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputFile.prototype.clearValue = function() {
    this.value = '';
    this.elsObject.elInput.value = '';
    this.elsObject.elFileName.innerHTML = this.options.placeholder;
}

mtmInputFile.prototype.getValue = function() {
    return this.value;
}

mtmInputFile.prototype.setLabelEnable = function(bEnable) {
    // return this.value;
    if(bEnable)
    {
        this.elsObject.elFileName.classList.remove('inactive');
        // this.elsObject.elUpload.classList.remove('inactive');
    }    
    else
    {
        this.elsObject.elFileName.classList.add('inactive');
        // this.elsObject.elUpload.classList.add('inactive');
    }
        
}

mtmInputFile.prototype.setButtonEnable = function(bEnable) {
    // return this.value;
    if(bEnable)
    {
        // this.elsObject.elFileName.classList.remove('inactive');
        this.elsObject.elUpload.classList.remove('inactive');
    }    
    else
    {
        // this.elsObject.elFileName.classList.add('inactive');
        this.elsObject.elUpload.classList.add('inactive');
    }
    
}

mtmInputFile.prototype.setButtonTitle = function(title) {
    this.elsObject.elUpload.innerHTML = title;
}

mtmInputFile.prototype.resetButtonTitle = function() {
    this.elsObject.elUpload.innerHTML = '<i class="fa fa-file-text-o"> </i> 업로드';
}
