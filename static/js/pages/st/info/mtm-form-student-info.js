import {mtoEvents} from '../../core/utils/mto-events.js';

export var mtmFormStudentInfo = function (options) {
    this.id = 'id-mtm-form-student-info-' + mtmFormStudentInfo.id++;

    this.options = options;
    this.elThis = null;

    this._init();

}

mtmFormStudentInfo.id = 0;
mtmFormStudentInfo.prototype._initEvents = function() {
    
}

mtmFormStudentInfo.prototype._create = function() {
    
}

mtmFormStudentInfo.prototype._init = function() {
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('class','py-2');
    this.elThis.setAttribute('id',this.id);

    this._create();
}

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// URL //////////////////////////////////////
// mtmFormStudentInfo.prototype._aurlDeleteStudent = function(result) {
// }

// mtmFormStudentInfo.prototype._urlDeleteStudent = function(eData) {
//     var self = this;
//     var formData = new FormData();
    
//     formData.append('csrfmiddlewaretoken', csrftoken);
//     formData.append('id',eData.id);
    
//     var url = "";
//     if(this.options && this.options.url)
//         url += this.options.url;

//     url += "/deletestudent/";
//     $.ajax({
//         url: url,
//         data: formData,
//         processData: false,
//         contentType: false,
//         method: 'POST',
//         type: 'POST',
//         cache : false,
//         success: function(res){
//             self._aurlDeleteStudent.call(self,res.result);
//         },
//         error : function() {
//             window.location.href = '/';
//         }
//     }); // end of ajax
// }
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Handler ///////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// API /////////////////////////////////////
mtmFormStudentInfo.prototype.postInit = function () {
    if(this.bPostInit)
        return;
    this.bPostInit = true;
    
}

mtmFormStudentInfo.prototype.show = function (bShow) {
    if(bShow)
    {
        this.elThis.style.display = '';
        // this.clStudentTableBuilder.redraw();
    }
    else
        this.elThis.style.display = 'none';
}
