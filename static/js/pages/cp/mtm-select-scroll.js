//reference
// how to add vertical scrollbar to select box options list?
//https://stackoverflow.com/questions/48560072/how-to-add-vertical-scrollbar-to-select-box-options-list
require('../../../../css/core/view/component/mtm-select-scroll.css');

export const mtmSelectScroll = function(options) {
    this.options = options|| {};
    this.elValueArray = [];
    this._init();
}

mtmSelectScroll.prototype._init = function() {
    this._setOptions();
    this._create();
}

mtmSelectScroll.prototype._setOptions = function() {
    this.valueData = this.options.data || ['sample value1', 'sample value2'];
}

mtmSelectScroll.prototype._create = function() {
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('class', 'mtm-select-scroll-wrapper');
    
    this.elSelect = document.createElement('select');
    this.elSelect.setAttribute('class', 'mtm-select-scroll');
    this.elSelect.setAttribute('onfocus', 'this.size=5;');
    this.elSelect.setAttribute('onblur', 'this.size=1;');
    this.elSelect.setAttribute('onChange', 'this.size=1; this.blur()');
    this.elThis.appendChild(this.elSelect);

    this.initValues(this.elSelect, this.valueData);
    
}


// ===================================================================
// ============================= Handler =============================
// ===================================================================


// ===============================================================
// ============================= API =============================
// ===============================================================

//https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
/** 
 * reset old values and set new values
 * @param {Element} parent parent select node element
 * @param {Array} valueData [title1, title2, ...]
 */
mtmSelectScroll.prototype.initValues = function(parent, valueData) {
    // reset
    this.removeAllChildNodes(parent);
    // set
    valueData.forEach(title=> {
        this.setValue(parent, title);
    });
}

mtmSelectScroll.prototype.setValue = function(parent, title) {
    let valueEl = document.createElement('option');
    valueEl.setAttribute('value', "");
    valueEl.innerHTML = title;
    parent.appendChild(valueEl);
    this.elValueArray.push(valueEl);
}

mtmSelectScroll.prototype.removeAllChildNodes = function(parentNode) {
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
    }
}