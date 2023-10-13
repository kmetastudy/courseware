// Create a Custom Select Menu
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select

// [UI] 커스텀 셀렉트박스(custom selectbox)
// https://recordboy.github.io/2019/10/02/ui-custom-selectbox/

// Select CSS Customizing 
// https://wazacs.tistory.com/34

// Custom select menu - CSS only
// https://www.youtube.com/watch?v=bB14uo0Tu5A

// <!--surround the select box with a "custom-select" DIV element. Remember to set the width:-->
// <div class="custom-select" style="width:200px;">
//   <select>
//     <option value="0">Select car:</option>
//     <option value="1">Audi</option>
//     <option value="2">BMW</option>
//     <option value="3">Citroen</option>
//     <option value="4">Ford</option>
//     <option value="5">Honda</option>
//     <option value="6">Jaguar</option>
//     <option value="7">Land Rover</option>
//     <option value="8">Mercedes</option>
//     <option value="9">Mini</option>
//     <option value="10">Nissan</option>
//     <option value="11">Toyota</option>
//     <option value="12">Volvo</option>
//   </select>
// </div>

// Bootstrap Multiselect
// https://davidstutz.github.io/bootstrap-multiselect/

// select 태그 커스텀 하기, 혹은 직접 만들기 (feat. javascript)
// https://wazacs.tistory.com/34

// 31 CSS Select Boxes
// https://freefrontend.com/css-select-boxes/


var tempOption = [ "Audi","BMW","Citroen","Ford","Honda","Jaguar","Land Rover",
    "Mercedes","Mini","Nissan","Toyota","Volvo"];

var divOptionListHead = [
    "안전보건처",
    // "상임감사위원","기획관리본부","기술안전본부",
    // "신사업본부","발전회사협력본부","사업소",
    ];

var divOptionListBody = ["산업안전총괄부","재난관리부","현장안전부","감사실","기획처","경영관리처",
    "디지털전략처","홍보윤리실","발전처","건설처","환경품질처","그린뉴딜사업처",
    // "해외사업처","조달계약처","출자관리실","기업성장응답센터","영흥발전본부"
    ];

var divOptionListTail = [
    // 감사실
    "전략감사부","성과감사부","청렴감사부",
    ];


var termOptionListYear = [
    "2018년","2019년","2020년","2021년","2022년",
];

var termOptionListQuarter = [
    "1분기","2분기","3분기","4분기",
];

var termOptionListMonth = [
    "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월",
];

var costOptionListCategoryLarge = [
    "예방 비용","평가 비용","내부 실패비용","외부 실패비용"
];
var costOptionListCategoryMedium = [
    // 예방비용
    "경영시스템인증유지비",
    "경영시스템 개선관리비",
    "설비개선관리비",
    "품질개선활동비",
    "안전관리활동비",
    "연구과제비",
    "기술지원비",
    "교육훈련비",
    "도서인쇄비",
    "보험비",
    "협회비",
    "사회공헌활동비",
    // 평가 비용
    // "검사비",
    // "조사분석비",
    // "협력업체 심사비",
    // "기술진단비",
    // "측정/시험장비비",
    // // 내부 실패비용
    // "부적합 처리비",
    // "경상정비비",
    // "설비고장 조치비",
    // "운전손실비",
    // "체선료",
    // // 외부 실패비용
    // "보상비",
    // "부담금",
    // "충당금",
    // "소송비",
];
var costOptionListCategorySamll = [
    // // 경영시스템인증유지비
    // "ISO 9001(품질경영시스템) 인증유지비",
    // "ISO 14001(환경경영시스템) 인증유지비",
    // "ISO 45001(안전경영시스템) 인증유지비",
    // "ISO 22301(사업연속성경영시스템) 인증유지비",
    // "ISO 27001(정보보호경영시스템) 인증유지비",
    // "ISO 27701(개인정보보호) 인증유지비",
    // "ISO 30301(기록경영시스템) 인증유지비",
    // "ISO 37001(부패방지경영시스템) 인증유지비",
    // "ISO 50001(에너지경영시스템) 인증유지비",
    // "ISO 55001(자산관리경영시스템) 인증유지비",
    // "ISO 9001(품질경영시스템) 내부심사비",
    // // 경영시스템 개선관리비
    // "ISO 14001(환경경영시스템) 내부심사비",
    // "ISO 45001(안전경영시스템) 내부심사비",
    // "ISO 22301(사업연속성경영시스템) 내부심사비",
    // "ISO 27001(정보보호경영시스템) 내부심사비",
    // "ISO 27701(개인정보보호) 내부심사비",
    // "ISO 30301(기록경영시스템) 내부심사비",
    // "ISO 37001(부패방지경영시스템) 내부심사비",
    // "ISO 50001(에너지경영시스템) 내부심사비",
    // "ISO 55001(자산관리경영시스템) 내부심사비",
    // // 설비개선관리비
    // "설비개선비",
    // "계획예방정비비",
    // // 품질개선활동비
    // "개선활동시상금",
    // "개선활동 지원비",
    // "업무개선 자문비",
    // // 안전관리활동비
    // "소모성안전장구비",
    // "소화기소모품비",
    // // 연구과제비
    // "주력연구과제",
    // "현장기술개발과제",
    // "중소기업연구개발",
    // "상생협력지원",
    // "발전부산물재활용기술개발",
    // // 기술지원비
    // "기술지원비",
    // // 교육훈련비
    // "현장교육비",
    // "일반교육비",
    // "비상교육훈련비",
    // "안전교육훈련비",
    // "국내위탁교육비",
    // "해외위탁교육비",
    // "인력양성비",
    // // 도서인쇄비
    // "도서구입비",
    // "매거진 구독료",
    // "발간인쇄비",
    // // 보험비
    // "산재보험비",
    // "건물화재보험료",
    // // 협회비
    // "협회비",
    // // 사회공헌활동비
    // "기부금",
    // "지역주민협력비",
    // "민원대책비",
    // // 검사비
    // "경상점검비",
    // "경상점검비 (환경설비)",
    // "기자재 공장검사비",
    // "현장공정 검사비",
    // "법정검사비",
    // "비피괴검사비",
    // "성능진단비",
    // "감리비용",
    // "설계검토비",
    // // 조사분석비
    // "수질연료분석비",
    // "환경측정비",
    // "기타조사분석비",
    // // 협력업체 심사비
    // "정비적격업체 심사비",
    // "기자재유자격업체 심사비",
    // // 기술진단비
    // "수화력기술용역비",
    // "환경영향용역비(환경영향평가비)",
    // "일반기술용역비",
    // "작업환경측정수수료",
    // // 측정/시험장비비
    // "공기구 및 측정장비 관리비",
    // // 부적합 처리비
    // "부적합 사항 재검사비",
    // // 경상정비비
    // "경상정비비",
    // "경상정비비(환경설비)",
    // // 설비고장 조치비
    // "설비고장수리비",
    // "기동비",
    // "지장전력비",
    // "순수비",
    // // 운전손실비
    // "불시정지 손실비",
    // "급전지시 출력미달 손실비",
    // "급전지시 출력초과 손실비",
    // "병해지연 손실비용",
    // "초과운전 손실비",
    // "병입지연 손실비",
    // // 체선료
    // "체선료 A",
    // "체선료 B",
    // 보상비
    "환경피해보상비",
    "기타보상비",
    // 부담금
    "공해배출부과금",
    "교통유발부담금",
    "환경개선부담금",
    "폐기물처분부담금",
    // 충당금
    "배출권",
    "탄소배출권충당금전입액",
    "RPS충당금전입액",
    // 소송비
    "소송비",
];

import {mtvEvents} from '../utils/mtv-events.js';

export var mtvInputSelectMenu = function(options)
{
    // this.id = id;
    // if(!id)
    this.id = 'id-mtv-input-select-menu-' + mtvInputSelectMenu.id++;
    this.elThis = null;
    this.elSelect = null;
    this.elSelectSelected = null;
    this.elSelectItems = null;
    this.options = options;

    this.title = null;
    // this.optionList = [];
    this.placeHolder = null;


    if(this.options && this.options.title)
        this.title = this.options.title;

    // if(!!id && !!optionList)
    //     this.init(id,optionList);
    this.init();    
    // if the user clicks anywhere outside the select box,
    // then close all select boxes:
    document.addEventListener("click", this.closeAllSelect.bind(this));
}

mtvInputSelectMenu.id = 0;

mtvInputSelectMenu.prototype.init = function()
{
    // this.id = id;
    this.elThis = document.getElementById(this.id);
    if(!this.elThis)
    {
        this.elThis = document.createElement('div');
        this.elThis.setAttribute('class','mtv-select');
        this.elThis.setAttribute('id',this.id);
    }

    this.elSelect = document.createElement("SELECT");
    this.elThis.appendChild(this.elSelect);
    
    var option = this.addPlaceHolder(this.title);
    this.elSelect.appendChild(option);

    // this.elSelect = document.getElementsByTagName("select")
    this.elSelectSelected = document.createElement("DIV");
    this.elSelectSelected.setAttribute("class", "select-selected");
    this.elSelectSelected.innerHTML = option.innerHTML;
    this.elThis.appendChild(this.elSelectSelected);
    /*for each element, create a new DIV that will contain the option list:*/
    this.elSelectItems = document.createElement("DIV");
    this.elSelectItems.setAttribute("class", "select-items select-hide");
    this.elThis.appendChild(this.elSelectItems);

    this.elSelectSelected.addEventListener('click',this.selectSelectedClickHandler.bind(this));

    if(this.options && this.options.list)
        this.setOptionList(this.options.list);
}

mtvInputSelectMenu.prototype.addPlaceHolder = function(placeHolder)
{
    var option = document.createElement("OPTION");
    option.setAttribute("value","0");
    if(!!placeHolder)
        option.innerHTML = placeHolder;
    else
        option.innerHTML = "선택";
    
    return option;
}

mtvInputSelectMenu.prototype.reset = function()
{
    this.elSelectSelected.innerHTML = this.title;
    console.log('reset : ', this.title);
    var elPrevSelected = this.elSelectItems.getElementsByClassName("same-as-selected");
    for(var i=0;i<elPrevSelected.length;i++)
        elPrevSelected[i].removeAttribute("class");
    // this.elSelect.removeChild(this.elSelect.first)
}

// 실패한 함수 : setOptionList 함수를 통해서 선택한다.
 
mtvInputSelectMenu.prototype.set = function(code)
{   
    
    // var divs = this.elSelectItems.getElementsByTagName("DIV");

    // console.log('divs length: ', divs.length);
    // console.log('divs: ', divs);
    
    // for(var i=0;i < $(this.elSelectItems).children().length+1;i++)
    // {
    //     // console.log('children[i].getAttribute("value")',this.elSelectItems.children[i].getAttribute('value'));

    //     if(this.elSelectItems.children[i].getAttribute('value') == code)
    //     {
    //         this.elSelectSelected.innerHTML = this.elSelectItems.children[i].innerHTML;
    //         this.elSelectItems.children[i].setAttribute('class','same-as-selected');
    //     }
    //     else
    //         this.elSelectItems.children[i].removeAttribute("class");
    // }

}

mtvInputSelectMenu.prototype.create = function(optionList)
{
    // 아지 정하지 못함.
}

mtvInputSelectMenu.prototype.disable = function()
{
    if(!this.elSelectSelected.classList.contains('disabled'))
        this.elSelectSelected.classList.add('disabled');
}

mtvInputSelectMenu.prototype.enable = function()
{
    if(this.elSelectSelected.classList.contains('disabled'))
        this.elSelectSelected.classList.remove('disabled');
}

mtvInputSelectMenu.prototype.toggleEnable = function()
{
    this.elSelectSelected.classList.toggle('disabled');
}

mtvInputSelectMenu.prototype.setOptionList = function(optionList,bSelectLast)
{
    // console.log('setOptionList');
    // clear <select>
    // var options = this.elSelect.getElementsByTagName("OPTION");
    // var len = options.length;
    
    while(this.elSelect.firstChild)
        this.elSelect.removeChild(this.elSelect.firstChild);

    // clear <div class="select-items">
    var divs = this.elSelectItems.getElementsByTagName("DIV");
    for(var i=0;i<divs.length;i++)
    {
        divs[i].removeEventListener('click',this.itemClickHandler);
    }

    while(this.elSelectItems.firstChild)
        this.elSelectItems.removeChild(this.elSelectItems.firstChild);

    // add option
    // var option = document.createElement("OPTION");
    // option.setAttribute("value","0");
    // option.innerHTML = "Not Selected";
    var option = this.addPlaceHolder(this.title);

    this.elSelect.appendChild(option);
    
    for(var i=0;i<optionList.length;i++)
    {
        // options[i].remove();
        var el = document.createElement("OPTION");
        if(!!optionList[i].code)
            el.setAttribute("value", optionList[i].code);
        else
            el.setAttribute("value",i+1);

        if(!!optionList[i].name)
            el.innerHTML = optionList[i].name;
        else
            el.innerHTML = optionList[i];

        this.elSelect.appendChild(el);
    }

    // add items
    for(var i=0;i<optionList.length;i++)
    {
        // options[i].remove();
        var el = document.createElement("DIV");
        if(!!optionList[i].code)
            el.setAttribute("value", optionList[i].code);
        else
            el.setAttribute("value",i+1);

        if(!!optionList[i].name)
            el.innerHTML = optionList[i].name;
        else
            el.innerHTML = optionList[i];

        el.addEventListener("click",this.itemClickHandler.bind(this));
        if(bSelectLast && (i==optionList.length-1))
        {
            this.elSelectSelected.innerHTML =  optionList[i].name;
            el.setAttribute('class','same-as-selected');
        }
        this.elSelectItems.appendChild(el);
    }

    // this.elSelectSelected.innerHTML = this.elSelectItems.children[i].innerHTML;
}

mtvInputSelectMenu.prototype.selectSelectedClickHandler = function(e)
{
    // when the select box is clicked, close any other select boxes,
    // and open/close the current select box:
    e.stopPropagation();

    if(this.elSelectSelected.classList.contains('disabled'))
        return false;

    this.closeAllSelect(this.elSelectSelected);
    this.elSelectSelected.nextSibling.classList.toggle("select-hide");
    this.elSelectSelected.classList.toggle("select-arrow-active");
}

mtvInputSelectMenu.prototype.itemClickHandler = function(e)
{
    // when an item is clicked, update the original select box,
    // and the selected item:
    var y, i, k, s, h, sl, yl;
    // s = this.parentNode.parentNode.getElementsByTagName("select")[0];

    // sl = s.length;
    // h = this.parentNode.previousSibling;
    var elPrevSelected = this.elSelectItems.getElementsByClassName("same-as-selected");
    for(var i=0;i<elPrevSelected.length;i++)
        elPrevSelected[i].removeAttribute("class");
    // console.log(' elPrevSelected : ', elPrevSelected);
    // if(!!elPrevSelected.length)
    //     elPrevSelected.removeAttribute("class");
    
    this.elSelectSelected.innerHTML = e.target.innerHTML;

    e.target.setAttribute("class", "same-as-selected");

    if(!!mtvEvents)
    {
        var eData = {id:this.id,code:e.target.getAttribute("value")}
        // console.log('OnSelectMenuSelect : ', eData);

        if(this.options && this.options.eventHandler)
            this.options.eventHandler(eData);
        else
            mtvEvents.emit('OnSelectMenuSelect',eData);
    }
    // console.log(e.target.getAttribute("value"));

    // for (i = 0; i < sl; i++) {
    //     if (s.options[i].innerHTML == this.innerHTML) {
    //             s.selectedIndex = i;
    //             h.innerHTML = this.innerHTML;
    //             y = this.parentNode.getElementsByClassName("same-as-selected");
    //             yl = y.length;
    //             for (k = 0; k < yl; k++) {
    //                 y[k].removeAttribute("class");
    //             }
    //         e.target.setAttribute("class", "same-as-selected");
    //         break;
    //     }
    // }

    this.elSelectSelected.click();
}

mtvInputSelectMenu.prototype.closeAllSelect = function(elmnt)
{
    // a function that will close all select boxes in the document,
    // except the current select box:
    var arrNo = [];
    
    if (elmnt == this.elSelectSelected) {
        arrNo.push(0)
    } else {
        this.elSelectSelected.classList.remove("select-arrow-active");
    }
    
    if (arrNo.indexOf(0)) {
        this.elSelectItems.classList.add("select-hide");
    }
    
}
import {mtvComponentBuilder} from '../utils/mtv-component-builder.js';

// mtv/core/utils/mtvComponentBuilder 에 등록
mtvComponentBuilder.register('mtv-input-select-menu',mtvInputSelectMenu);
