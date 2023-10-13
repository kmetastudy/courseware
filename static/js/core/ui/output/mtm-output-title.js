import {mtoElementBuilder} from '../utils/mto-element-builder.js';

export var mtmOutputTitle = function(options) {
    this.id = 'id-mtv-player-testum-title-' + mtmOutputTitle.id++;

    this.elThis = null;
    this.elTitle = null;
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = "제목 없음";

    this._init();
}

mtmOutputTitle.id = 0;

mtmOutputTitle.staticPlayArea = [
    {'level':0, 'tag':'div','class':'row d-flex justify-content-center', 
            'attr':{'style':'font-size:1.5rem;font-weight:900',},},
        // {'level':1,'tag':'i', 'text':'',},
        {'level':1,'tag':'span', 'text':'',},
];

mtmOutputTitle.prototype._renderLatex = function(el) {
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

mtmOutputTitle.prototype._init = function() {
    this.elThis = mtoElementBuilder.createComponent(mtmOutputTitle.staticPlayArea);
    if(this.options && this.options.marginClass)
    {
        for(var i=0;i<this.options.marginClass.length;i++)
            this.elThis.calssList.add(this.options.marginClass[i]);
    }
        
    this.elTitle = this.elThis.children[0];
    if(this.options && this.options.align)
        this.elThis.style.textAlign = this.options.align;
    if(this.options && this.options.size)
        this.elThis.style.fontSize = this.options.size;
    if(this.options && this.options.weight)
        this.elThis.style.fontWeight = this.options.weight;
    this.setTitle(this.options.title);
}


//////////////////// API ////////////////////////////

mtmOutputTitle.prototype.setTitle = function(title) {
    this.elTitle.innerHTML = title;
    this._renderLatex(this.elTitle);
}
