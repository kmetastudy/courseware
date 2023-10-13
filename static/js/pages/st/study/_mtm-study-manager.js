// Todo. StudyManager 가 StudyContainer 와 StudyBuilder 를 통제할 수 있도록
// 구성
export var mtmStudyManager = function(options) {
    this.id = 'id-mtm-study-manager-' + mtmStudyManager.id++;
    this.elThis = null;

    this._init();
}

mtmStudyManager.id = 0;

mtmStudyManager.prototype._init = function() {
    
}