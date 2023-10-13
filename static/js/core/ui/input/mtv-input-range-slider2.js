// <range-slider> element
// https://github.com/andreruffert/range-slider-element

// rangeslider.js
// https://github.com/andreruffert/rangeslider.js
var mtvInputRangeSlider2 = function(options) {
    this.id = 'id-mtv-input-range-slider2-' + mtvInputRangeSlider2.id++;
    this.options = options; 

    this.elThis = null;

    this._ignoreChange = false;
    // this._isRTL = this.getAttribute('dir') === 'rtl';
    this._defaultValue = this._getValue();
    
    this.init();
}

mtvInputRangeSlider2.id = 0;
mtvInputRangeSlider2.UPDATE_EVENTS = ['input', 'change'];
mtvInputRangeSlider2.REFLECTED_ATTRIBUTES = ['min', 'max', 'step', 'value', 'disabled', 'value-precision'];

mtvInputRangeSlider2.ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

mtvInputRangeSlider2.TEMPLATE = document.createElement('template');
mtvInputRangeSlider2.TEMPLATE.innerHTML = 
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

mtvInputRangeSlider2.prototype._getComputedValue = function() {
    const min = Number(this.min);
    const max = Number(this.max);
    return String(max < min ? min : min + (max - min) / 2);
}

mtvInputRangeSlider2.prototype._getMin = function() 
{ 
    return this.elThis.getAttribute('min') || '0'; 
}
mtvInputRangeSlider2.prototype._getMax = function() 
{ 
    return this.elThis.getAttribute('max') || '100'; 
}
mtvInputRangeSlider2.prototype._getStep = function() 
{ 
    return this.elThis.getAttribute('step') || '1'; 
}
mtvInputRangeSlider2.prototype._getValue = function() 
{ 
    return this.elThis.getAttribute('value') || this._getComputedValue(); 
}
mtvInputRangeSlider2.prototype._getDisabled = function() 
{ 
    return this.elThis.getAttribute('disabled') || false 
}
mtvInputRangeSlider2.prototype._getValuePrecision = function() 
{ 
    return this.elThis.getAttribute('value-precision') || ''; 
}
mtvInputRangeSlider2.prototype._getDefaultValue = function() 
{ 
    return this._defaultValue; 
}

mtvInputRangeSlider2.prototype._setMin = function(min) 
{ 
    this.elThis.setAttribute('min', min); 
}
mtvInputRangeSlider2.prototype._setMax = function(max) 
{ 
    this.elThis.setAttribute('max', max); 
}
mtvInputRangeSlider2.prototype._setStep = function(step) 
{ 
    this.elThis.setAttribute('step', step); 
}
mtvInputRangeSlider2.prototype._setValue = function(value) 
{ 
    this.elThis.setAttribute('value', value); 
}
mtvInputRangeSlider2.prototype._setDisabled = function(disabled) 
{ 
    this.elThis.setAttribute('disabled', disabled); 
}
mtvInputRangeSlider2.prototype._setValuePrecision = function(precision) 
{ 
    this.elThis.setAttribute('value-precision', precision); 
}
mtvInputRangeSlider2.prototype._setDefaultValue = function(value) 
{ 
    this._defaultValue = value; 
}

// web browser 가 tag 를 로딩할 때...
// mtvInputRangeSlider2.prototype.connectedCallback = function() 
mtvInputRangeSlider2.prototype.postInit = function() 
{
    // if (!this.firstChild) {
    //   this.append(TEMPLATE.content.cloneNode(true));
    // }

    this.elThis.addEventListener('pointerdown', this._startHandler, false);
    this.elThis.addEventListener('pointerup', this._endHandler, false);
    this.elThis.addEventListener('keydown', this._keyCodeHandler, false);
    this._update();

    // Aria attributes
    this.elThis.setAttribute('tabindex', '0');
    this.elThis.setAttribute('role', 'slider');
    // setAriaAttribute(this, 'value', this.value);
    // setAriaAttribute(this, 'min', this.min);
    // setAriaAttribute(this, 'max', this.max);
}

mtvInputRangeSlider2.prototype.disconnectedCallback = function() 
{
    this.elThis.removeEventListener('pointerdown', this._startHandler.bind(this), false);
    this.elThis.removeEventListener('pointerup', this._endHandler.bind(this), false);
    this.elThis.removeEventListener('keydown', this._keyCodeHandler.bind(this), false);
}

mtvInputRangeSlider2.prototype.attributeChangedCallback = function(name, oldValue, newValue) 
{
    if (oldValue === newValue || this._ignoreChange) return;
    this._update();
    // this.elThis.setAriaAttribute(name, newValue);
}

mtvInputRangeSlider2.prototype._startHandler = function(e){
    this.elThis.focus();
    this.elThis.classList.add('touch-active');

    // Click and drag
    this.elThis.setPointerCapture(e.pointerId);
    this.elThis.addEventListener('pointermove', this._moveHandler.bind(this), false);

    // Click jump
    this._reflectValue(e);
  }

mtvInputRangeSlider2.prototype._moveHandler = function(e)
{
    this._reflectValue(e);
}

mtvInputRangeSlider2.prototype._endHandler = function(e)
{
    this.elThis.classList.remove('touch-active');
    this.elThis.releasePointerCapture(e.pointerId);
    this.elThis.removeEventListener('pointermove', this._moveHandler.bind(this), false);

    // TODO: check if value changed
    this.elThis.dispatchEvent(new Event('change', { bubbles: true }));
}

mtvInputRangeSlider2.prototype._keyCodeHandler = function(e)
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

mtvInputRangeSlider2.prototype._reflectValue = function(e)
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

    if (oldValue !== newValue) {
        this.value = newValue;
        this.elThis.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

mtvInputRangeSlider2.prototype._constrainValue = function(value) 
{
    var min = Number(this.min);
    var max = Number(this.max);
    var step = Number(this.step);
    var valuePrecision = Number(this.valuePrecision) || getPrescision(this.step) || 0;

    // min, max constrain
    var saveValue = Math.min(Math.max(value, min), max);

    // Rounding in steps
    var nearestValue = Math.round(saveValue / step) * step;

    // Value precision
    var newValue = valuePrecision ? nearestValue.toFixed(valuePrecision) : Math.round(nearestValue).toString();

    return newValue;
}

mtvInputRangeSlider2.prototype._update = function() 
{
    var isRTL = Boolean(this._isRTL);
    var min = Number(this.min);
    var max = Number(this.max);
    var value = Number(this.value);
    var percent = (100 * (value - min)) / (max - min);
    var percentComplete = isRTL ? 100 - percent : percent;
    this.elThis.style.setProperty('--value-percent', percentComplete + '%');
}

mtvInputRangeSlider2.prototype.stepUp = function(amount) 
{
    if(!amount)
        amount = this.step;
    var oldValue = Number(this.value);
    var newValue = this._constrainValue(oldValue + Number(amount));
    if (oldValue !== newValue) 
    {
        this.value = newValue;
        this.elThis.dispatchEvent(new Event('input', { bubbles: true }));
        this.elThis.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

mtvInputRangeSlider2.prototype.stepDown = function(amount) 
{
    if(!amount)
        amount = this.step;
    var oldValue = Number(this.value);
    var newValue = this._constrainValue(oldValue - Number(amount));
    if (oldValue !== newValue) 
    {
        this.value = newValue;
        this.elThis.dispatchEvent(new Event('input', { bubbles: true }));
        this.elThis.dispatchEvent(new Event('change', { bubbles: true }));
    }
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

mtvInputRangeSlider2.prototype.init = function()
{
    this.elThis = document.createElement('div');
    this.elThis.classList.add('mtv-range-slider2');

    this.elThumbWrapper = document.creatElement('div');
    this.elThumbWrapper.classList.add('thumb-wrapper');

    this.elThumb = document.creatElement('div');
    this.elThumb.classList.add('thumb');
    
    this.elValueDisplay = document.creatElement('div');
    this.elValueDisplay.classList.add('value-display');
    
    this.elThumb.appendChild(this.elValueDisplay);
    this.elThumbWrapper.appendChild(this.elThumb);
    this.elThis.appendChild(this.elThumbWrapper);

    this.postInit();
} 