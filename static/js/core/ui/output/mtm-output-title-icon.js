export var mtmOutputTitleIcon = function(options) {
    this.id = 'id-mtm-output-title-icon-' + mtmOutputTitleIcon.id++;

    this.elThis = null;
    this.elTitle = null;
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = "제목 없음";

    this._init();
}

mtmOutputTitleIcon.id = 0;

mtmOutputTitleIcon.prototype._renderLatex = function(el) {
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

mtmOutputTitleIcon.prototype._init = function() {
    
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
mtmOutputTitleIcon.prototype.setTitle = function(title) {
    var icon = "<i class='fa-solid fa-eye mx-2'></i>"
    this.elTitle.innerHTML = icon + title;
    this._renderLatex(this.elTitle);
}
