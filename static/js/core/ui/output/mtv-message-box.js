import {mtvElementBuilder} from '../utils/mtv-element-builder.js';
import {mtvFileUploader} from '../mtv-file-uploader.js';

export var mtvMessageBox = function(options)
{
    this.id = "mtv-message-box-" + mtvMessageBox.id++;
    this.options = options;
    if(!this.options)
        this.options = {};

    if(!this.options.title)
        this.options.title = "엑셀파일을 통한 XXX 만들기";
    if(!this.options.submit_title)
        this.options.submit_title = "생성";
    if(!this.options.id)
        this.options.id = "file-form";
    // if(!this.options.url)
    //     this.options.url = '/course/bookwithexcel';
    // if(!this.options.event)
    //     this.options.event = 'OnImportNewBook';

    this.elThis = null;
    // this.elSubmitBtn = null;
    this.init();
}

mtvMessageBox.id = 0;

mtvMessageBox.staticSubmitBtn = [
    {'level' : 0, 'tag':'button', 'class' : 'btn btn-outline-primary', 'id':'course-excel-upload','text':'코스 생성', 'attr' : {'type':'button',}, },
] ;

mtvMessageBox.staticBody = [
    {'level' : 0, 'tag':'div', 'class' : 'card col-12 mb-2 px-0', },
        {'level' : 1, 'tag':'div', 'class' : 'card-header text-primary', },
            {'level' : 2, 'tag':'div', 'class' : 'fa fa-file-excel-o', },
            {'level' : 2, 'text' : ' 엑셀파일을 통한 Course 만들기!', },
        {'level' : 1, 'tag':'div', 'class' : 'card-body', },
            {'level' : 2, 'tag':'div', 'class' : 'row mt-4', },
                {'level' : 3, 'tag':'div', 'class' : 'col-1', },
                {'level' : 3, 'tag':'div', 'class' : 'col-7', },
                    {'level' : 4, 'tag':'form', 'class' : 'md-form', 'attr':{'method':'post',}, },
                        {'level' : 5, 'tag':'div', 'class' : 'file-field', },
                            {'level' : 6, 'tag':'a', 'class' : 'btn-floating purple-gradient mt-0 float-left', },
                                {'level' : 7, 'tag':'i', 'class' : 'fa fa-cloud-upload mr-2', },
                                {'level' : 7, 'tag':'input', 'id' : 'file-form', 'attr' :{'type':'file',}, },
                {'level' : 3, 'tag':'div', 'class' : 'col-3', },
                    {'level':4, 'comp':'submit-btn',}
                            
];


mtvMessageBox.prototype.onSubmit = function()
{
    // console.log('mtvFileUploader : onSubmit');
    var files= []; 
    
    files = $('#'+this.options.id).get(0).files;
    if(!files[0])
    {
        console.log('no files');
        return false;
    }

    // console.log('filename:'+files[0].name);
    var formData = new FormData();
    formData.append('file',files[0]);
    // csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    formData.append('csrfmiddlewaretoken', csrftoken);

    var url = this.options.url;

    var event = this.options.event;
    
    if(this.options && this.options.ajax)
    {
        var keyValues = Object.keys(this.options.ajax);
        for(var i=0;i<keyValues.length;i++)
        {
            formData.append(keyValues[i],this.options.ajax[keyValues[i]]);
        }
    }

    $.ajax({
        url: url,
        data: formData,
        // enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        method: 'POST',
        type: 'POST',
        success: function(res){
            // displayLoading("N"); // 로딩 off
            // if(!res.ok)
            //     return false;
            mtvEvents.emit(event,res);
            // alert(res.message);
            
        }
    }); // end of ajax
}

mtvMessageBox.prototype.create = function(tagList)
{
    var topElement = document.createElement('div');
    
    // topElement.setAttribute('class','mtv-top-element');

    var componentList = [];
    var level = 0;
    var element = null;

    componentList.push(topElement);

    if(tagList)
    {
        for(var i=0; i<tagList.length;i++)
        {

            if(tagList[i]["comp"])
            {
                if(tagList[i]["comp"] == 'submit-btn')
                {
                    element = this.elSubmitBtn = mtvElementBuilder.createComponent(mtvFileUploader.staticSubmitBtn);
                    this.elSubmitBtn.addEventListener('click',this.onSubmit.bind(this));

                }
            }
            else
            {
                element = mtvElementBuilder.createElement(tagList[i]);
            }

            level = tagList[i]["level"];
            
            componentList[level].appendChild(element);
            componentList[level+1] = element;
            
        }
    }

    return topElement;
}

mtvMessageBox.prototype.prepare = function()
{
    mtvMessageBox.staticBody[3]["text"] = this.options.title;
    mtvMessageBox.staticBody[12]["id"] = this.options.id;
    
    // mtvMessageBox.staticSubmitBtn[0]["text"] = this.options.submit_title;
    
}

mtvMessageBox.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = 'block';
    else
        this.elThis.style.display = 'none';
}


mtvMessageBox.prototype.init = function()
{
    this.elThis = document.createElement('div');
    
    this.prepare();

    var element = this.create(mtvMessageBox.staticBody);
    this.elThis.appendChild(element);

}
