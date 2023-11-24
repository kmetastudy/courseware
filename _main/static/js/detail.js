$(function () {
  init();
});

function init() {
  var clContent = new Content();
}

function Content() {
  this.options = {
    title: "중등 3-1 수학 개념과 유형",
    summary: `<p>쉬운 예제와 반복적인 테스트로 구성된 코스.</p>
                                <p>복잡한 일차방정식, 일차방정식의 활용 등을 제외하여</p>
                                <p>처음 학습하는 학생들도 부담이 덜 되고 성취감을 높일 수 있도록 제작된 기초 강좌!</p>`,
    year: 2023,
    grade: "중학교 3학년",
    semester: "1학기",
    subject: "중학교-수학",
    publisher: "메가코스",
    difficulty: "개념과 유형",
    producer: "메가코스",
    content: `<h3 style="margin-left:0px;"><strong>강의 주제 📖</strong></h3><ul><li>데이터 과학의 기본
                    이 되는 과학적 모델링을 이해하기 위한 기초적인 수학적 지식 학습을 할 수 있습니다.</li></ul><p>수학적 지식의 정확한 이해 및 코딩 능력 함양을 위한 
                    다양한 예제 및 연습문제를 통해 파이썬 실습을 해볼 수 있습니다.</p><p>&nbsp;</p><h3><strong>📚 기초대수학(Basic Algebra)</strong></h3><ul><li><strong>중고등학교 과정에서 배우는 수학 과목들의&nbsp;압축 강의</strong></li></ul><p>수학을 다루는 많은 학문에서, 중고등학교 수학은 이미 알고있다고  
                    가정하는 경우가 많습니다.<br>하지만 실제론 이 부분에 대해 부족함을 느끼는 분들이 많습니다.<br>본 강의는 그런 분들을 위해 하나의 강의에서 앞으로  
                    배우게 될 수학의 기초를 다지는&nbsp;<strong>기초대수학</strong>&nbsp;강의입니다.</p><p>&nbsp;</p><h3><strong>🐢 느리지만&nbsp;확실히</strong></h3><p>수학실력은 고민하는만큼 발전하고, 스스로 다룰 수 없는 수학도구는 자기만족으로 이어질 수 없습니다.<br>추후 다루는 수학과목들을 확실히 이해하기
                     위해, 많은 연습으로 수학의 기초를 확실히 다집니다.</p><p>&nbsp;</p><h3><strong>🤓 단 한가지 준비물:&nbsp;끈기</strong></h3><p>지금 당장 화려하고
                     실전적인 수학을 배우고 싶어하는 분들이 많습니다.<br>잠시만 조바심을 내려놓고 30시간만 기초실력을 다지길 강력히 추천합니다.</p><p>&nbsp;</p>`,
  };

  this.elThis = null;
  this.create();
}

Content.prototype.create = function () {
  var $elHeader = $(`<div class="w-[1200px] p-10">
                        <p class="text-2xl">${this.options.title}</p>
                        ${this.options.summary}
                    </div>`);

  $(".course_header").append($elHeader);

  var clDescription = new Description(this.options);
  var clChapter = new Chapter();
  var clCard = new Card();
};

function Card() {
  this.options = {
    img: "001",
    price: "55,000",
    difficulty: "보통",
    duration: "무제한",
    time: "",
  };
  this.create();
}

Card.prototype.create = function () {
  $elCard = $(`<div class="border rounded-md">
                    <img src="../../../../static/img/001.png">
                    <div class="p-2">
                        <div class="p-2 grid grid-cols-2 border-b">
                            <p class=text-sm "text-gray-400">난이도</p>
                            <p class="text-sm">보통</p>

                            <p class="text-sm text-gray-400">수강기간</p>
                            <p class="text-sm">무제한</p>

                            <p class="text-sm text-gray-400">총 강의 수</p>
                            <p class="text-sm">10강(12시간)</p>
                        </div>
                        <p class="p-2 text-2xl">무료</p>
                        <button class="p-2 w-full rounded-lg bg-gray-200">수강하기</button>
                    </div>
                </div>`);

  $(".container-right").append($elCard);
};

function Chapter() {
  this.options = null;
}

function Description(options) {
  this.options = options;
  this.create();
}

Description.prototype.create = function () {
  var $elCategory = $(`<div class="p-2 w-full flex border">
                        <p class="w-[100px]">코스 제목</p>
                        <p>${this.options.title}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">년도</p>
                        <p>${this.options.year}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">학년</p>
                        <p>${this.options.grade}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">학기</p>
                        <p>${this.options.semester}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">과목</p>
                        <p>${this.options.subject}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">출판사</p>
                        <p>${this.options.publisher}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">난이도</p>
                        <p>${this.options.difficulty}</p>
                    </div>
                    <div class="p-2 w-full flex border">
                        <p class="w-[100px]">제작자</p>
                        <p>${this.options.producer}</p>
                    </div>`);

  $(".desc_category").append($elCategory);

  var $elContent = $(`${this.options.content}
                            <img src="../../../../static/img/ex1.PNG">`);

  $(".desc_content").append($elContent);
};
