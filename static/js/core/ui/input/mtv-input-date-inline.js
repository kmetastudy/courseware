// <input type="date">
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

// input type date styling
// https://cssdeck.com/labs/oqpjrd0k

// Pikaday
// https://github.com/Pikaday/Pikaday
// https://pikaday.com/

// Browse 300.000+ SVG Vectors and Icons
// https://www.svgrepo.com/

// SVG in CSS backgrounds
// https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images

// Change Color of SVG on Hover
// https://css-tricks.com/change-color-of-svg-on-hover/
var mtvInputDateInline = function(options) {
    this.id = 'id-mtv-input-date-inline' + mtvInputDateInline.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elInputDate'];
    this.elsObject = {};

    this.value = "";

    if(!options)
        this.options = {};
    else
        this.options = options;

    // if(!this.options.placeholder)
    //     this.options.placeholder = '입력하세요';
    if(!this.options.title)
        this.options.title = '시작일';

    this.init();
}

mtvInputDateInline.id = 0;

mtvInputDateInline.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtv-input-date-inline','text':'',},
        // {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        {'step':1,'tag':'input', 'class':'class-mtv-input-date-inline-input',
            'attr' :{'type':'date', },
        },
];


mtvInputDateInline.prototype.initEvents = function() {
        
}

mtvInputDateInline.prototype.matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtvInputDateInline.prototype.create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputDateInline.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtvInputDateInline.prototype.prepare = function() {
    // console.log(' mtvInputDateInline : prepare : ', this.options.title);

    // mtvInputDateInline.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
}

mtvInputDateInline.prototype.init = function() {
    this.prepare();
    this.create();
    this.initEvents();
    this.matchElements();
}

//////////////////////////////////////////////////////
mtvInputDateInline.prototype.getValue = function() {
    return this.value;
}

mtvInputDateInline.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtvInputDateInline.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}

