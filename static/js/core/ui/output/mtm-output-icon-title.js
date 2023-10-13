import {mtvComponentBuilder} from '../utils/mtv-component-builder.js';
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtmOutputIconTitle = function(options) {
    this.id = 'id-mtm-out-icon-title-' + mtmOutputIconTitle.id++;

    this.elThis = null;
    this.elTitle = null;
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = "제목 없음";

    this._init();
}

mtmOutputIconTitle.id = 0;

mtmOutputIconTitle.staticPlayArea = [
    {'level':0, 'tag':'div','class':'row d-flex justify-content-center mb-2', 
            'attr':{'style':'font-size:1.5rem;font-weight:900',},},
        // {'level':1,'tag':'i', 'text':'',},
        {'level':1,'tag':'span', 'text':'',},
];

mtmOutputIconTitle.prototype._renderLatex = function(el) {
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

mtmOutputIconTitle.prototype._init = function() {
    this.elThis = mtvElementBuilder.createComponent(mtmOutputIconTitle.staticPlayArea);
    this.elTitle = this.elThis.children[0];
    if(this.options && this.options.align)
        this.elThis.style.textAlign = this.options.align;
    if(this.options && this.options.size)
        this.elThis.style.fontSize = this.options.size;
    if(this.options && this.options.weight)
        this.elThis.style.fontWeight = this.options.weight;
    this.setTitle(this.options.title);
}

// mtvComponentBuilder.register('mtv-player-testum-title',mtmOutputIconTitle);
// mtvComponentBuilder.register('mtv-stat-study-course-title',mtmOutputIconTitle);
// mtvComponentBuilder.register('mtv-stat-course-title',mtmOutputIconTitle);

//////////////////// API ////////////////////////////

mtmOutputIconTitle.prototype.setTitle = function(title) {
    this.elTitle.innerHTML = title;
    this._renderLatex(this.elTitle);
}
