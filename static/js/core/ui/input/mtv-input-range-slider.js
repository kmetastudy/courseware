// rangeslider.js fiddle with label and index numbers
// https://codepen.io/nilsborg/pen/BdjedR

// Custom range input slider with labels
// https://codepen.io/trevanhetzel/pen/rOVrGK

// Range Slider With Custom Handles Labels Scales - rangeSlider.js
// https://www.jqueryscript.net/form/range-slider-handles-labels-scales.html

// Slider for Bootstrap
// https://seiyria.com/bootstrap-slider/

// Slim Custom Duration Slider In jQuery - Slider.js
// https://www.jqueryscript.net/form/slim-duration-slider.html

// rangeslider.js
// https://github.com/andreruffert/rangeslider.js

// <range-slider> element
// https://github.com/andreruffert/range-slider-element

export var mtvInputRangeSlider = function(options) {
    this.id = 'id-mtv-input-range-slider-' + mtvInputRangeSlider.id++;

    this.options = options;
    if(!this.options)
        this.options = {};
    if(!this.options.min)
        this.options.min = 0;
    if(!this.options.max)
        this.options.max = 100;
    if(!this.options.step)
        this.options.step = 1;
    
    this.slider = null;
    this.init();
}   

mtvInputRangeSlider.id = 0;

mtvInputRangeSlider.staticPlayground = [
// <input id="ex1" data-slider-id='ex1Slider' 
//          type="text" data-slider-min="0" 
//          data-slider-max="20" data-slider-step="1" data-slider-value="14"/>

];

mtvInputRangeSlider.prototype.create = function() {
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('id',this.id);
    this.elThis.setAttribute('style','width:80%');
    
    this.slider = new Slider({
        Duration: 600,

        // width/height of the duration slider
        width: '80%',
        height: '3px',
    
        // background color
        backgroundColor: 'lightgrey',
    
        // bar color
        barColor: 'deeppink',
    
        // shows drag handler
        hasBall: true,
    
        // handler color
        ballColor: '#29AFFF',
    
        // border radius of handler
        ballRadius: 20,//parseFloat(this.height)*1.5,
    
        // step size
        scale: 1.2,
    
        // always shows the handler
        alwayShowBall: true,
    
        // shows current/total duration
        formatProgress: true,
    
        // shows indicator
        hasIndicator: true,
    
        // background color of indicator
        indicatorColor: '#778899',
    
        // text color
        indicatorTextColor: 'black',
        
    });

    // this.elThis.classList.add('slider' ,'slider-horizontal');

    // this.elSlider = document.createElement('input');
    // this.elSlider.setAttribute('id',this.id + '-slider');
    // this.elSlider.setAttribute('data-slider-id',this.id);
    // this.elSlider.setAttribute('type','text');
    // this.elSlider.setAttribute('data-slider-min', this.options.min);
    // this.elSlider.setAttribute('data-slider-max', this.options.max);
    // this.elSlider.setAttribute('data-slider-step', this.options.step);
    // if(this.options.value)
    //     this.elSlider.setAttribute('data-slider-value', this.options.value);
    
    $(this.elThis).append(this.slider.getSlider());
}

mtvInputRangeSlider.prototype.init = function() {
    this.create();

    // this.slider = new Slider('#'+this.id,{});
    // $(this.elSlider).slider({});
}

/////////////////// API /////////////////////
mtvInputRangeSlider.prototype.setPercent = function(progress) {

    var percent = progress /100.0;
    if(percent < 0)
        percent = 0;
    if(percent > 1)
        percent = 1;
    this.slider.setCurrent(percent);
}