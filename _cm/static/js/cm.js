require("../css/cm.css");
import { ContentsManager } from "../../../static/js/pages/cm/contents-manager";
import { Accordion } from "../../../static/js/pages/cm/accordion";
import Course from "../../../static/js/pages/cm/container/course/Course";

export function BaseOnReady(context, csrf_token) {
    const defaultAxiosConfig = {
        headers: { "X-CSRFTOKEN": csrf_token },
    };
    
    axios.defaults.headers = defaultAxiosConfig.headers;

    var navOptions = [
        {title:'메인', url:'banner/', icon:'ri-dashboard-fill', submenu:false},
        {title:'랜딩', icon:'ri-home-3-fill', submenu:true, subMenuItems:[{title:'코스12 관리', url:'banner/',},{title:'학교 관리'}]}, //학교추가, 로고, 배너, 공지, 추천코스
        {title:'콘텐츠', icon:'ri-user-2-fill', submenu:true, subMenuItems:[{title:'코스 업로드', url:'/course/'}]},
        // {title:'콘텐츠 구매자', icon:'ri-user-fill', submenu:true, subMenuItems:[{title:'구매자 관리'},{title:'포인트 관리'},{title:'주문 관리'}]},
        {title:'설정', icon:'ri-equalizer-fill', submenu:true, subMenuItems:[{title:'카테고리 관리'},{title:'태그 관리'}]},
    ]   
    const clNav = new Accordion(navOptions)
    $('.nav').append(clNav.elThis)

    const $content = document.querySelector('.content')
    console.log($content)
    new Course($content)
}

// old
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
