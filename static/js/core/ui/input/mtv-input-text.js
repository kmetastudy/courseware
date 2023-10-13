// Custom CSS Styles for Form Inputs and Textareas
// https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/

var mtvInputText = function(options) {
    this.id = 'id-mtv-input-text-' + mtvInputText.id++;
    this.elThis = null;
    this.elInput = null;

    this.elCompList = null;
    this.elsArray = ['elThis','elInput',null];
    this.elsObject = {};

    this.value = "";

    if(!options)
        this.options = {};
    else
        this.options = options;

    if(!this.options.placeholder)
        this.options.placeholder = '입력하세요';
    if(!this.options.value)
        this.options.value = '입력값';

    this.init();
}

mtvInputText.id = 0;

mtvInputText.staticBody = [
    // <div class="form__group field">
    //     <input type="input" class="form__field" placeholder="Name" name="name" id='name' required autocomplete="off" />
    //     <label for="name" class="form__label">Name</label>
    // </div>
    {'step':0, 'tag':'div','class':'class-mtv-input-text form__group field'},
        {'step':1, 'tag':'input','class':'form__field','id':'', 
            'attr' : {'type':'input','placeholder':'','autocomplete':'off','name':'',},
            'prop' : {'required' : true},
        },
        {
            'step':0, 'tag':'label','class':'form__label', 'text' : '',
                'attr' : {'for': '',},
        },
    // <label> 
    //     First Name:
    //     <input type="text" name="firstname" />
    // </label>

    // <label for="explicit-label-name">Last Name: </label>
    // <input type="text" id="explicit-label-name" name="lastname" />

];


mtvInputText.prototype.initEvents = function() {
        
}


mtvInputText.prototype.create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputText.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    this.initElements();

    console.log('mtvInputText > this.elsObject : ', this.elsObject);
}

mtvInputText.prototype.initElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
}


mtvInputText.prototype.prepare = function() {
    // id 설정
    mtvInputText.staticBody[1]['id'] = this.id;
    mtvInputText.staticBody[2]['attr']['for'] = this.id;
    mtvInputText.staticBody[1]['attr']['name'] = this.id;
    // placeholder
    mtvInputText.staticBody[1]['attr']['placeholder'] = this.options.placeholder;
    // value
    mtvInputText.staticBody[2]['text'] = this.options.value;
    
}

mtvInputText.prototype.init = function() {
    this.prepare();
    this.create();
    this.initEvents();
}


//////////////////////////////////////////////////////
mtvInputText.prototype.getValue = function() {

    return this.value;
}