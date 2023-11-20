require("../css/cm.css");
import { ContentsManager } from "../../../static/js/pages/cm/contents-manager";

export function contentManagementOnReady(context){
    var optionsCM = {}
    optionsCM.body = document.querySelector('body')
    // optionsCM.context = JSON.parse(context)
    var landing = new ContentManagementLanding(optionsCM)
}

function ContentManagementLanding(options) {
    this.options = options
    this.container = options.body
    this.elThis = null

    this.init()
}

ContentManagementLanding.prototype.init = function() {
    this.elThis = document.createElement('div')
    this.elThis.classList.add('cm-landing')
    this.elThis.style.height ='100vh'
    this.elThis.style.padding = '10px'
    

    //일반 js 노드 생성
    this.elTitle = document.createElement('div')
    this.elTitle.innerText=`콘텐츠 관리`

    //jquery 사용 테스트
    this.elTab = $('<div>코스</div>')

    this.clContents = new ContentsManager()
    
    this.elThis.appendChild(this.elTitle)
    $(this.elThis).append(this.elTab)
    this.elThis.appendChild(this.clContents.elThis)

    this.container.appendChild(this.elThis)
}
