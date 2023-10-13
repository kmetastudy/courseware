// <range-slider> element
// https://github.com/andreruffert/range-slider-element

// rangeslider.js
// https://github.com/andreruffert/rangeslider.js

// Single/range slider plugin - pure JS
// https://github.com/slawomir-zaziablo/range-slider
var mtvInputRangeSliderBubble = function(options) {
    this.id = 'id-mtv-input-range-slider-bubble-' + mtvInputRangeSliderBubble.id++;
    this.options = options; 

    this.elThis = null;

    this._ignoreChange = false;
    // this._isRTL = this.getAttribute('dir') === 'rtl';
    
    this.init();
    this._defaultValue = this._getValue();
    
}

mtvInputRangeSliderBubble.id = 0;
mtvInputRangeSliderBubble.UPDATE_EVENTS = ['input', 'change'];
mtvInputRangeSliderBubble.REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

mtvInputRangeSliderBubble.ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

mtvInputRangeSliderBubble.TEMPLATE = document.createElement('template');
mtvInputRangeSliderBubble.TEMPLATE.innerHTML = 
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

mtvInputRangeSliderBubble.prototype._getComputedValue = function() {
    var min = Number(this.min);
    var max = Number(this.max);
    return String(max < min ? min : min + (max - min) / 2);
}

mtvInputRangeSliderBubble.prototype._getMin = function() 
{ 
    return this.elThis.getAttribute('min') || '0'; 
}
mtvInputRangeSliderBubble.prototype._getMax = function() 
{ 
    return this.elThis.getAttribute('max') || '100'; 
}
mtvInputRangeSliderBubble.prototype._getStep = function() 
{ 
    return this.elThis.getAttribute('step') || '1'; 
}
mtvInputRangeSliderBubble.prototype._getValue = function() 
{ 
    return this.elThis.getAttribute('value') || this._getComputedValue(); 
}
mtvInputRangeSliderBubble.prototype._getDisabled = function() 
{ 
    return this.elThis.getAttribute('disabled') || false 
}
mtvInputRangeSliderBubble.prototype._getValuePrecision = function() 
{ 
    return this.elThis.getAttribute('value-precision') || ''; 
}
mtvInputRangeSliderBubble.prototype._getDefaultValue = function() 
{ 
    return this._defaultValue; 
}

mtvInputRangeSliderBubble.prototype._setMin = function(min) 
{ 
    this.elThis.setAttribute('min', min); 
}
mtvInputRangeSliderBubble.prototype._setMax = function(max) 
{ 
    this.elThis.setAttribute('max', max); 
}
mtvInputRangeSliderBubble.prototype._setStep = function(step) 
{ 
    this.elThis.setAttribute('step', step); 
}
mtvInputRangeSliderBubble.prototype._setValue = function(value) 
{ 
    this.elThis.setAttribute('value', value); 
}
mtvInputRangeSliderBubble.prototype._setDisabled = function(disabled) 
{ 
    this.elThis.setAttribute('disabled', disabled); 
}
mtvInputRangeSliderBubble.prototype._setValuePrecision = function(precision) 
{ 
    this.elThis.setAttribute('value-precision', precision); 
}
mtvInputRangeSliderBubble.prototype._setDefaultValue = function(value) 
{ 
    this._defaultValue = value; 
}

// web browser 가 tag 를 로딩할 때...
// mtvInputRangeSlider2.prototype.connectedCallback = function() 
mtvInputRangeSliderBubble.prototype.postInit = function() 
{
    // if (!this.firstChild) {
    //   this.append(TEMPLATE.content.cloneNode(true));
    // }

    this.elSlider.addEventListener('pointerdown', this._startHandler.bind(this), false);
    this.elSlider.addEventListener('pointerup', this._endHandler.bind(this), false);
    this.elSlider.addEventListener('keydown', this._keyCodeHandler.bind(this), false);
    this._update();

    // Aria attributes
    this.elThis.setAttribute('tabindex', '0');
    this.elThis.setAttribute('role', 'slider');
    // setAriaAttribute(this, 'value', this.value);
    // setAriaAttribute(this, 'min', this.min);
    // setAriaAttribute(this, 'max', this.max);
}

mtvInputRangeSliderBubble.prototype.disconnectedCallback = function() 
{
    this.elSlider.removeEventListener('pointerdown', this._startHandler.bind(this), false);
    this.elSlider.removeEventListener('pointerup', this._endHandler.bind(this), false);
    this.elSlider.removeEventListener('keydown', this._keyCodeHandler.bind(this), false);
}

mtvInputRangeSliderBubble.prototype.attributeChangedCallback = function(name, oldValue, newValue) 
{
    if (oldValue === newValue || this._ignoreChange) return;
    this._update();
    // this.elThis.setAriaAttribute(name, newValue);
}

mtvInputRangeSliderBubble.prototype._startHandler = function(e){

    console.log('mtvInputRangeSliderBubble : _startHandler');
    
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

mtvInputRangeSliderBubble.prototype._moveHandler = function(e)
{
    this._reflectValue(e);
}

mtvInputRangeSliderBubble.prototype._endHandler = function(e)
{
    console.log('mtvInputRangeSliderBubble : _endHandler');
    // this.elThis.classList.remove('touch-active');
    this.elSlider.classList.remove('touch-active');
    
    this.elSlider.releasePointerCapture(e.pointerId);
    // 기가 막힐 노릇이다.
    this.elSlider.removeEventListener('pointermove', this._moveHanlderCall, false);
    
    // TODO: check if value changed
    this.elSlider.dispatchEvent(new Event('change', { bubbles: true }));
}

mtvInputRangeSliderBubble.prototype._keyCodeHandler = function(e)
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

mtvInputRangeSliderBubble.prototype._reflectValue = function(e)
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

mtvInputRangeSliderBubble.prototype._constrainValue = function(value) 
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

mtvInputRangeSliderBubble.prototype._update = function() 
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

mtvInputRangeSliderBubble.prototype.stepUp = function(amount) 
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

mtvInputRangeSliderBubble.prototype.stepDown = function(amount) 
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

mtvInputRangeSliderBubble.prototype.getPrescision = function(value) {
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

mtvInputRangeSliderBubble.prototype.init = function()
{
    this.elThis = document.createElement('div');
    
    this.min = Number(this._getMin());
    this.max = Number(this._getMax());
    this.step = this._getStep();
    this.valuePrecision = this._getValuePrecision();

    this.elThis.setAttribute('min',this._getMin());
    this.elThis.setAttribute('max',this._getMax());
    this.elThis.setAttribute('value',this._getValue());
        
    this.elSlider = document.createElement('div');
    this.elSlider.classList.add('cl-mtv-range-slider-bubble');

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
    this.elOutput.classList.add('cl-mtv-range-slider-output');


    this.elThis.appendChild(this.elSlider);
    this.elThis.appendChild(this.elOutput);
    
    this.postInit();
} 

//////////////////// API /////////////////////
mtvInputRangeSliderBubble.prototype.setPos = function()
{
    // background: linear-gradient(#6221ea, #6221ea) 0/ 0% 100% no-repeat #c6afe5;
}