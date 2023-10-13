// Custom CSS Styles for Form Inputs and Textareas
// https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/

// Input group :focus-within
// https://codepen.io/aaroniker/pen/dybMVMB
// 위에서 사용하는 BackgroudColor 가 좋다.

// Todo. title 왼쪽/오른쪽 선택  
// Todo. 크기 적용하는 기능
var mtvInputTextForm = function(options) {
    this.id = 'id-mtv-input-text-form' + mtvInputTextForm.id++;
    this.elThis = null;
    this.elInput = null;

    // for elements matching
    this.elCompList = null;
    this.elsArray = ['elThis',null,'elInput'];
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

mtvInputTextForm.id = 0;

mtvInputTextForm.staticBody = [
    // <div class="mtv-input-text-form-group">
    //     <span>https://</span>
    //     <input class="mtv-input-text-form-field" type="text" placeholder="domain.tld">
    // </div>

    // <div class="form-group">
    //     <input class="form-field" type="email" placeholder="Email">
    //     <span>@gmail.com</span>
    // </div>

    {'step':0, 'tag':'div','class':'mtv-input-text-form-group'},
        {
            'step':1, 'tag':'span', 'text':''
        },
        {
            'step':0, 'tag':'input','class':'mtv-input-text-form-field',
                'attr' : {'type':'text','placeholder':'','autocomplete':'off',},
        },
];


mtvInputTextForm.prototype.initEvents = function() {
        
}


mtvInputTextForm.prototype.create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputTextForm.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;

    
    
}

mtvInputTextForm.prototype.matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
    // console.log('mtvInputTextForm > this.elsObject : ', this.elsObject);
}


mtvInputTextForm.prototype.prepare = function() {
    // id 설정
    
    // size 
    // placeholder
    mtvInputTextForm.staticBody[2]['attr']['placeholder'] = this.options.placeholder;
    // title
    mtvInputTextForm.staticBody[1]['text'] = this.options.title;
    
}

mtvInputTextForm.prototype.init = function() {
    this.prepare();
    this.create();
    this.matchElements();

    this.initEvents();
}


//////////////////////////////////////////////////////
mtvInputTextForm.prototype.getValue = function() {

    return this.value;
}