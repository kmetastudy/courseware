import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtvInputTitleText = function(options) {
    this.id = 'id-mtv-input-title-text-' + mtvInputTitleText.id++;
    this.elThis = null;
    this.elInput = null;

    // for elements matching
    this.elCompList = null;
    this.elsArray = ['elThis',null,null,'elTitle',null,null,'elLabel','elInput'];
    this.elsObject = {};

    this.value = "";

    if(!options)
        this.options = {};
    else
        this.options = options;

    if(!this.options.placeholder)
        this.options.placeholder = '제목을 입력하세요';
    if(!this.options.title)
        this.options.title = '제목';
    // if(!this.options.value)
    if(this.options.value=='undefined' || this.options.value==null)
        this.options.value = '제목 없음';
    if(this.options.latex =='undefined' || this.options.latex==null)
        this.options.latex = true;
    this.init();
}

mtvInputTitleText.id = 0;

mtvInputTitleText.staticBody = [
    // <div class="mtv-input-text-form-group">
    //     <span>https://</span>
    //     <input class="mtv-input-text-form-field" type="text" placeholder="domain.tld">
    // </div>

    // <div class="form-group">
    //     <input class="form-field" type="email" placeholder="Email">
    //     <span>@gmail.com</span>
    // </div>

    // {'step':0, 'tag':'div','class':'mtv-input-text-form-group'},
    //     {
    //         'step':1, 'tag':'span', 'text':''
    //     },
    //     {
    //         'step':0, 'tag':'input','class':'mtv-input-text-form-field',
    //             'attr' : {'type':'text','placeholder':'','autocomplete':'off',},
    //     },

    // 제목 폼 영역
    {'step' : 0, 'tag':'div','class':'form-group mb-0',},
        {'step':1,'tag':'div','class':'input-group input-group-sm',},
            {'step':1 , 'tag':'div', 'class':'input-group-prepend',},
                {'step' : 1, 'tag':'span','class':'input-group-text text-primary pr-2 mb-0',},
                    {'step' : 1, 'tag':'i','class':'fa fa-bookmark-o mr-2',},
                    {'step' : 0, 'text':'제목 ',},
            {'step' : -2, 'tag':'label','class':'form-control', },
            {'step' : 0, 'tag':'input','class':'form-control', 
                'attr' :{ 'type':'text' , 'spellcheck' : 'false', 'placeholder' : '제목 없음','autocomplete':'off',},},
];


mtvInputTitleText.prototype.initEvents = function() {
        
}

// [Javascript] input 입력값 가져와서 출력하기
// 출처: https://hianna.tistory.com/411 [어제 오늘 내일:티스토리]
mtvInputTitleText.prototype.onBlurHandler = function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    this.elsObject.elInput.style.display = 'none';
    this.elsObject.elLabel.style.display = '';
    
    return false;
}

mtvInputTitleText.prototype.onKeyUpHandler = function(e) {
    if(this.options && this.options.eventHandler)
    {
        var value = this.elsObject.elInput.value; //('value');
        // console.log('mtvInputTitleText > onKeyUpHandler :', value);
        this.elsObject.elLabel.setAttribute('data-value',value);
        this.elsObject.elLabel.innerHTML = value;
        this._renderLatex(this.elsObject.elLabel);

        if(this.options.value != value)
            this.options.eventHandler(value);
    }
    else
    {
        var value = this.elsObject.elInput.value; //('value');
        // console.log('mtvInputTitleText > onKeyUpHandler :', value);
        this.elsObject.elLabel.setAttribute('data-value',value);
        this.elsObject.elLabel.innerHTML = value;
        this._renderLatex(this.elsObject.elLabel);
    }

    if ( e.keyCode == 27 || e.which == 27 ) {
        e.stopPropagation();
        e.preventDefault();
        
        this.elsObject.elInput.style.display = 'none';
        this.elsObject.elLabel.style.display = '';
        
        return false;
    }
    else if(e.keyCode == 13 || e.which == 13) {
        e.stopPropagation();
        e.preventDefault();
        this.elsObject.elInput.style.display = 'none';

        var value = this.elsObject.elInput.value; // getAttribute('value');
        this.elsObject.elLabel.setAttribute('data-value',value);
        this.elsObject.elLabel.innerHTML = value;
        this._renderLatex(this.elsObject.elLabel);
        this.elsObject.elLabel.style.display = '';
        
        return false;
    }

}
// Mod-Exam. Jstar : Exam or More
mtvInputTitleText.prototype.onChangeHandler = function(e) {
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(e);
}

mtvInputTitleText.prototype.create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputTitleText.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;

}

mtvInputTitleText.prototype.matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
    // console.log('mtvInputTextForm > this.elsObject : ', this.elsObject);
}


mtvInputTitleText.prototype.prepare = function() {
    // id 설정
    
    // size 
    // icon
    mtvInputTitleText.staticBody[4]['class'] = this.options.icon;
    // placeholder
    mtvInputTitleText.staticBody[7]['attr']['placeholder'] = this.options.placeholder;
    // title
    mtvInputTitleText.staticBody[5]['text'] = this.options.title;
    
}

mtvInputTitleText.prototype._renderLatex = function(el) {
    renderMathInElement(el,
        {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
        ],
        throwOnError : false
        } 
        );
}

mtvInputTitleText.prototype.onClickHandler = function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.elsObject.elLabel.style.display = 'none';
    this.elsObject.elInput.style.display = '';
    this.elsObject.elInput.setAttribute('placeholder',this.options.placeholder);
    this.elsObject.elInput.setAttribute('value', this.elsObject.elLabel.getAttribute('data-value'));
    this.elsObject.elInput.focus();
}


mtvInputTitleText.prototype.init = function() {
    this.prepare();
    this.create();
    this.matchElements();

    this.initEvents();

    this.elsObject.elLabel.setAttribute('data-value',this.options.value);
    this.elsObject.elLabel.innerHTML = this.options.value;
    if(this.options.latex)
        this._renderLatex(this.elsObject.elLabel);

    if(!this.options.bReadOnly)
    {
        this.elsObject.elLabel.addEventListener('click',this.onClickHandler.bind(this));
    }

    if(this.options.titleWidth)
    {
        this.elsObject.elTitle.style.width =  this.options.titleWidth;
    }
    this.elsObject.elInput.setAttribute('value',this.options.value);
    this.elThis = this.elsObject.elThis;

    this.elsObject.elInput.addEventListener('keyup',this.onKeyUpHandler.bind(this));
    this.elsObject.elInput.addEventListener('blur',this.onBlurHandler.bind(this));
    // Mod-Exam. Jstar : Exam or More
    this.elsObject.elInput.addEventListener('change',this.onChangeHandler.bind(this));

    this.elsObject.elInput.style.display = 'none';
    // this.elsObject.elInput.addEventListener('keydown',this.onKeyUpHandler.bind(this));
    
}


//////////////////////////////////////////////////////
mtvInputTitleText.prototype.getValue = function() {
    return this.elsObject.elInput.value;
    // return this.elsObject.elLabel.getAttribute('data-value');
}

mtvInputTitleText.prototype.setValue = function(value) {
    // return this.value;
    this.elsObject.elLabel.setAttribute('data-value',value);
    this.elsObject.elLabel.innerHTML = value;
    this.elsObject.elInput.value = value;
    this.elsObject.elInput.setAttribute('value',value);
    this._renderLatex(this.elsObject.elLabel);
}

mtvInputTitleText.prototype.setPlaceholder = function(value) {
    // return this.value;
    
    this.elsObject.elInput.setAttribute('placeholder',value);
}

mtvInputTitleText.prototype.readOnly = function(bReadOnly) {
    if(bReadOnly)
        this.elsObject.elInput.readOnly = true;
    else
        this.elsObject.elInput.readOnly = false;
}


