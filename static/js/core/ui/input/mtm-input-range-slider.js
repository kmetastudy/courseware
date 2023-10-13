// <range-slider> element
// https://github.com/andreruffert/range-slider-element

// rangeslider.js
// https://github.com/andreruffert/rangeslider.js

// Single/range slider plugin - pure JS
// https://github.com/slawomir-zaziablo/range-slider

// onchange vs. oninput for Range Sliders
// https://www.impressivewebs.com/onchange-vs-oninput-for-range-sliders/
// require('../../../../css/mtv/core/input/mtm-input-range-slider-bubble.css');
require('./mtm-input-range-slider.css');

export var mtmInputRangeSlider = function(options) {
    this.id = 'id-mtm-input-range-slider-' + mtmInputRangeSlider.id++;
    this.options = options; 

    this.elThis = null;

    this._ignoreChange = false;
    // this._isRTL = this.getAttribute('dir') === 'rtl';
    
    this._init();
    this._defaultValue = this._getValue();
    
}

mtmInputRangeSlider.id = 0;
mtmInputRangeSlider.UPDATE_EVENTS = ['input', 'change'];
mtmInputRangeSlider.REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

mtmInputRangeSlider.ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

mtmInputRangeSlider.TEMPLATE = document.createElement('template');
mtmInputRangeSlider.TEMPLATE.innerHTML = 
  '<div class="thumb-wrapper">' + 
    '<div class="thumb"></div>' +
  '</div>';

{/* <range-slider>
      <div class="thumb-wrapper">
        <div class="thumb"></div>
        <div class="value-display"></div>
      </div>
</range-slider> */}

// class RangeSliderElement extends HTMLElement {
//   constructor() {
//     super();
//     this._ignoreChange = false;
//     this._isRTL = this.getAttribute('dir') === 'rtl';
//     this._defaultValue = this.value;
//   }

//   static get observedAttributes() {
//     return REFLECTED_ATTRIBUTES;
//   }

mtmInputRangeSlider.prototype._getComputedValue = function() {
    var min = Number(this.min);
    var max = Number(this.max);
    return String(max < min ? min : min + (max - min) / 2);
}

mtmInputRangeSlider.prototype._getMin = function() 
{ 
    return this.elThis.getAttribute('min') || '0'; 
}
mtmInputRangeSlider.prototype._getMax = function() 
{ 
    return this.elThis.getAttribute('max') || '100'; 
}
mtmInputRangeSlider.prototype._getStep = function() 
{ 
    return this.elThis.getAttribute('step') || '1'; 
}
mtmInputRangeSlider.prototype._getValue = function() 
{ 
    return this.elThis.getAttribute('value') || this._getComputedValue(); 
}
mtmInputRangeSlider.prototype._getDisabled = function() 
{ 
    return this.elThis.getAttribute('disabled') || false 
}
mtmInputRangeSlider.prototype._getValuePrecision = function() 
{ 
    return this.elThis.getAttribute('value-precision') || ''; 
}
mtmInputRangeSlider.prototype._getDefaultValue = function() 
{ 
    return this._defaultValue; 
}

mtmInputRangeSlider.prototype._setMin = function(min) 
{ 
    this.elThis.setAttribute('min', min); 
}
mtmInputRangeSlider.prototype._setMax = function(max) 
{ 
    this.elThis.setAttribute('max', max); 
}
mtmInputRangeSlider.prototype._setStep = function(step) 
{ 
    this.elThis.setAttribute('step', step); 
}
mtmInputRangeSlider.prototype._setValue = function(value) 
{ 
    this.elThis.setAttribute('value', value); 
}
mtmInputRangeSlider.prototype._setDisabled = function(disabled) 
{ 
    this.elThis.setAttribute('disabled', disabled); 
}
mtmInputRangeSlider.prototype._setValuePrecision = function(precision) 
{ 
    this.elThis.setAttribute('value-precision', precision); 
}
mtmInputRangeSlider.prototype._setDefaultValue = function(value) 
{ 
    this._defaultValue = value; 
}

// web browser 가 tag 를 로딩할 때...
// mtvInputRangeSlider2.prototype.connectedCallback = function() 
mtmInputRangeSlider.prototype.postInit = function() 
{
    // if (!this.firstChild) {
    //   this.append(TEMPLATE.content.cloneNode(true));
    // }
    this._startHandler =  this._startHandler.bind(this);
    this.elSlider.addEventListener('pointerdown',this._startHandler, false);
    this._endHandler = this._endHandler.bind(this);
    this.elSlider.addEventListener('pointerup',this._endHandler , false);
    this._keyCodeHandler = this._keyCodeHandler.bind(this)
    this.elSlider.addEventListener('keydown',this._keyCodeHandler , false);
    this._update();

    // Aria attributes
    this.elThis.setAttribute('tabindex', '0');
    this.elThis.setAttribute('role', 'slider');
    // setAriaAttribute(this, 'value', this.value);
    // setAriaAttribute(this, 'min', this.min);
    // setAriaAttribute(this, 'max', this.max);
}

mtmInputRangeSlider.prototype.disconnectedCallback = function() 
{
    if(this._startHandler)
        this.elSlider.removeEventListener('pointerdown', this._startHandler, false);
    if(this._endHandler)
        this.elSlider.removeEventListener('pointerup', this._endHandler, false);
    if(this._keyCodeHandler)
        this.elSlider.removeEventListener('keydown', this._keyCodeHandler, false);

    this._startHandler = null;
    this._endHandler = null;
    this._keyCodeHandler = null;
    
}

mtmInputRangeSlider.prototype.attributeChangedCallback = function(name, oldValue, newValue) 
{
    if (oldValue === newValue || this._ignoreChange) return;
    this._update();
    // this.elThis.setAriaAttribute(name, newValue);
}

mtmInputRangeSlider.prototype._startHandler = function(e){

    console.log('mtmInputRangeSlider : _startHandler');
    
    // this.elThis.focus();
    // this.elSlider.focus();
    // this.elThis.classList.add('touch-active');
    this.elSlider.classList.add('touch-active');

    // Click and drag
    this.elSlider.setPointerCapture(e.pointerId);
    // _moveHanlderCall
    this._moveHanlderCall = this._moveHandler.bind(this);
    this.elSlider.addEventListener('pointermove', this._moveHanlderCall, false);

    // Click jump
    this._reflectValue(e);
  }

mtmInputRangeSlider.prototype._moveHandler = function(e)
{
    this._reflectValue(e);
}

mtmInputRangeSlider.prototype._endHandler = function(e)
{
    console.log('mtmInputRangeSlider : _endHandler');
    // this.elThis.classList.remove('touch-active');
    this.elSlider.classList.remove('touch-active');
    
    this.elSlider.releasePointerCapture(e.pointerId);
    // 기가 막힐 노릇이다.
    this.elSlider.removeEventListener('pointermove', this._moveHanlderCall, false);
    
    // TODO: check if value changed
    this.elSlider.dispatchEvent(new Event('change', { bubbles: true }));
}

mtmInputRangeSlider.prototype._keyCodeHandler = function(e)
{
    var code = e.code;
    var up = ['ArrowUp', 'ArrowRight'].includes(code);
    var down = ['ArrowDown', 'ArrowLeft'].includes(code);

    if (up) {
      e.preventDefault();
      this.stepUp();
    }
    else if (down) {
      e.preventDefault();
      this.stepDown();
    }
}

mtmInputRangeSlider.prototype._reflectValue = function(e)
{
    var isRTL = Boolean(this._isRTL);
    var min = Number(this.min);
    var max = Number(this.max);
    var oldValue = this.value;
    var fullWidth = e.target.offsetWidth;
    var offsetX = Math.min(Math.max(e.offsetX, 0), fullWidth);
    var percent = offsetX / fullWidth;
    var percentComplete = isRTL ? 1 - percent : percent;

    // Fit the percentage complete between the range [min,max]
    // by remapping from [0, 1] to [min, min+(max-min)].
    var computedValue = min + percentComplete * (max - min);

    // Constrain value
    var newValue = this._constrainValue(computedValue);
    // console.log('percentComplete : ', newValue);
    
    if (oldValue !== newValue) {
        this.value = newValue;
        // this.elThis.dispatchEvent(new Event('input', { bubbles: true }));
        // this.elThumb.style.left = percentComplete*100 + '%';
        this._update();
    }
}

mtmInputRangeSlider.prototype._constrainValue = function(value) 
{
    var min = Number(this.min);
    var max = Number(this.max);
    var step = Number(this.step);
    var valuePrecision = Number(this.valuePrecision) || this.getPrescision(this.step) || 0;

    // min, max constrain
    var saveValue = Math.min(Math.max(value, min), max);

    // Rounding in steps
    var nearestValue = Math.round(saveValue / step) * step;

    // Value precision
    var newValue = valuePrecision ? nearestValue.toFixed(valuePrecision) : Math.round(nearestValue).toString();

    return newValue;
}

mtmInputRangeSlider.prototype._update = function() 
{
    var isRTL = Boolean(this._isRTL);
    var min = Number(this.min);
    var max = Number(this.max);
    var value = Number(this.value);
    var percent = (100 * (value - min)) / (max - min);
    var percentComplete = isRTL ? 100 - percent : percent;

    this.elThumb.style.left = percentComplete + '%';
    this.elValueDisplay.style.left = percentComplete + '%';
    this.elValueDisplay.innerHTML = value;
    // this.elSlider.style.background = 'linear-gradient(#6221ea, #6221ea) 0/ ' + percentComplete + '%' + ' 100% no-repeat #c6afe5';
}

mtmInputRangeSlider.prototype.stepUp = function(amount) 
{
    if(!amount)
        amount = this.step;
    var oldValue = Number(this.value);
    var newValue = this._constrainValue(oldValue + Number(amount));
    if (oldValue !== newValue) 
    {
        this.value = newValue;
        this.elSlider.dispatchEvent(new Event('input', { bubbles: true }));
        this.elSlider.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

mtmInputRangeSlider.prototype.stepDown = function(amount) 
{
    if(!amount)
        amount = this.step;
    var oldValue = Number(this.value);
    var newValue = this._constrainValue(oldValue - Number(amount));
    if (oldValue !== newValue) 
    {
        this.value = newValue;
        this.elSlider.dispatchEvent(new Event('input', { bubbles: true }));
        this.elSlider.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

mtmInputRangeSlider.prototype.getPrescision = function(value) {
    if(!value)
        value = '';
    var afterDecimal = value.split('.')[1];
    return afterDecimal ? afterDecimal.length : 0;
  }

// }

// function getPrescision(value = '') {
//   const afterDecimal = value.split('.')[1];
//   return afterDecimal ? afterDecimal.length : 0;
// }

// function setAriaAttribute(element, name, value) {
//   const attributeName = ARIA_ATTRIBUTES[name];
//   if (!attributeName) return;
//   element.setAttribute(`aria-${attributeName}`, value);
// }

// export default RangeSliderElement;

mtmInputRangeSlider.prototype._init = function()
{
    this.elThis = document.createElement('div');
    
    this.min = Number(this._getMin());
    this.max = Number(this._getMax());
    this.step = this._getStep();

    if(this.options && this.options.value)
        this.value = this.options.value;
        
    this.valuePrecision = this._getValuePrecision();

    this.elThis.setAttribute('min',this._getMin());
    this.elThis.setAttribute('max',this._getMax());
    this.elThis.setAttribute('value',this._getValue());
        
    this.elSlider = document.createElement('div');
    this.elSlider.classList.add('cl-mtm-range-slider-bubble');

    this.elThumbWrapper = document.createElement('div');
    this.elThumbWrapper.classList.add('thumb-wrapper');

    this.elThumb = document.createElement('div');
    this.elThumb.classList.add('thumb');
    
    this.elValueDisplay = document.createElement('div');
    this.elValueDisplay.classList.add('value-display');
    
    this.elThumbWrapper.appendChild(this.elThumb);
    this.elThumbWrapper.appendChild(this.elValueDisplay);
    
    this.elSlider.appendChild(this.elThumbWrapper);

    this.elOutput = document.createElement('div');
    this.elOutput.classList.add('cl-mtm-range-slider-output');


    this.elThis.appendChild(this.elSlider);
    this.elThis.appendChild(this.elOutput);
    
    this.postInit();
} 

//////////////////// API /////////////////////
mtmInputRangeSlider.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputRangeSlider.prototype.setPos = function()
{
    // background: linear-gradient(#6221ea, #6221ea) 0/ 0% 100% no-repeat #c6afe5;
}

mtmInputRangeSlider.prototype.setValue = function(value)
{
    this.value = value;
    this._update();
}
