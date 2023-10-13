// 이거 하는 일이 너무 없는 거 아냐?
export var mtmPlayerLessonTitle = function(options) {
    this.id = 'id-mtm-player-lesson-title-' + mtmPlayerLessonTitle.id++;

    this.elThis = null;
    this.elTitle = null;
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = "제목 없음";

    this._init();
}

mtmPlayerLessonTitle.id = 0;

// mtmPlayerLessonTitle.staticPlayArea = [
//     {'level':0, 'tag':'div','class':'row d-flex justify-content-center mb-2', 
//             'attr':{'style':'font-size:1.5rem;font-weight:900',},},
//         {'level':1,'tag':'span', 'text':'',},
// ];

mtmPlayerLessonTitle.prototype._renderLatex = function(el) {
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

mtmPlayerLessonTitle.prototype._init = function() {
    
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('id',this.id);
    this.elContainer = document.createElement('div');
    this.elContainer.classList.add('d-flex','justify-content-center','my-2');
    
    this.elTitle = document.createElement('div')
    
    this.elThis.appendChild(this.elContainer);
    this.elContainer.appendChild(this.elTitle);
    
    this.setTitle(this.options.title);
}

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// API ///////////////////////////////////////////

mtmPlayerLessonTitle.prototype.setTitle = function(title) {
    var icon = "<i class='fa-brands fa-youtube mx-2'></i>"
    this.elTitle.innerHTML = icon + title;
    this._renderLatex(this.elTitle);
    
}


