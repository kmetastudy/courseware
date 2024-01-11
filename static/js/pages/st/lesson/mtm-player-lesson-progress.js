import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";

require("./mtm-player-lesson-progress.css");

export class mtmPlayerLessonProgress {
  constructor(options) {
    this.id = "id-mtm-player-lesson-progress-" + mtmPlayerLessonProgress.id++;

    this.elThis = null;
    this.elProgressBar = null;
    this.elProgressNumber = null;

    this.options = options;

    this.elSteps = [];
    this.elBars = [];
    this.elBar0s = [];
    this.elBar1s = [];

    this.activeIndex = -1;

    // slider indicator
    this.slides = [];
    // this.activeIndex = -1;
    this._init();
  }

  _initSwiper() {
    this.Swiper = new Swiper(this.elSwiper, {
      autoHeight: true,
      slidesPerView: "auto",
      // slidesPerView: 20,
      // slidesPerView: 1,
      centeredSlides: true,
      // breakpoints: {
      //     // when window width is >= 320px
      //     320: {
      //       slidesPerView: 3,
      //     //   spaceBetween: 20
      //     },
      //     // when window width is >= 480px
      //     480: {
      //       slidesPerView: 5,
      //     //   spaceBetween: 30
      //     },
      //     // when window width is >= 640px
      //     640: {
      //       slidesPerView: 8,
      //     //   spaceBetween: 40
      //     }
      //   }
      // 중복되게 한다.
      spaceBetween: -4,
    });
  }

  _create() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);
    this.elThis.classList.add("mtm-player-lesson-progress");

    this.elFlex = document.createElement("div");
    this.elFlex.setAttribute("class", "mtm-player-lesson-progress-flexbox");

    this.elSwiper = document.createElement("div");

    this.elSwiper.setAttribute("class", "swiper-container");
    // Todo. 폭 조정
    this.elSwiper.style.width = "100%";
    this.elSwiper.style.overflowX = "hidden";

    // Todo. 높낮이 조정
    this.elSwiper.style.height = "30px";
    // this.elSwiper.style.padding = '5px';
    this.elSwiper.style.borderRadius = "20px";

    this.elWrapper = document.createElement("div");
    this.elWrapper.setAttribute("class", "swiper-wrapper");

    this.elSwiper.appendChild(this.elWrapper);

    this.elFlex.appendChild(this.elSwiper);
    this.elThis.appendChild(this.elFlex);
  }

  _update() {
    // if(this.activeIndex >= 0)
    //     this.elProgressBar.style.width = ((this.activeIndex) / (this.elSteps.length - 1)) * 100 + "%";
  }

  _init() {
    this._create();

    for (var i = 0; i < this.options.items.length; i++) {
      this.addStep(i, -1);
    }
    // this.setActive(2);
    this._initSwiper();
    this.addSwiper();
  }
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////// Handler /////////////////////////////
  onClickIndicatorHandler(e) {
    if (this.activeIndex >= 0) {
      var slide = this.slides[this.activeIndex];
      var el = slide.children[0];
      el.classList.remove("active");
    }

    var index = parseInt(e.target.getAttribute("data-id")) - 1;

    if (index >= 0) {
      this.activeIndex = index;
      var slide = this.slides[this.activeIndex];
      var el = slide.children[0];
      el.classList.add("active");
    }

    if (this.options && this.options.eventClickHandler) this.options.eventClickHandler(this.activeIndex);
  }
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////// API /////////////////////////////////
  show(bShow) {
    if (bShow) this.elThis.style.display = "";
    else this.elThis.style.display = "none";
  }
  clearStep() {
    for (var i = 0; i < this.elSteps.length; i++) {
      // this.elProgressNumber.removeChild(this.elSteps[i]);
      this.elProgress.removeChild(this.elSteps[i]);
    }

    this.elSteps = [];
  }
  addStep(index, data_kind) {
    // <li class="step active">1</li>
    var el = document.createElement("div");
    el.classList.add("mtm-player-lesson-progress-step");

    // 데이터 종류 : -1 : testum, 0 : video , 1 : 문제
    el.setAttribute("data-kind", data_kind);

    el.innerHTML = index;
    this.elSteps.push(el);
    // this.elProgressNumber.appendChild(el);
    // this.elProgress.appendChild(el);
    return el;
  }
  addBar(index, data_kind) {
    // <li class="step active">1</li>
    var el = document.createElement("div");

    el.classList.add("mtm-player-lesson-progress-bar");
    var bar0 = document.createElement("div");
    bar0.classList.add("mtm-player-lesson-progress-bar-0");
    var bar1 = document.createElement("div");
    bar1.classList.add("mtm-player-lesson-progress-bar-1");

    // 데이터 종류 : -1 : testum, 0 : video , 1 : 문제
    // el.setAttribute('data-kind',data_kind);
    // el.innerHTML = index;
    el.appendChild(bar0);
    el.appendChild(bar1);

    this.elBars.push(el);
    this.elBar0s.push(bar0);
    this.elBar1s.push(bar1);

    // this.elProgressNumber.appendChild(el);
    // this.elProgress.appendChild(el);
    return el;
  }
  setActive(index) {
    if (index < 0)
      // return;
      index = 0;
    if (index > this.elSteps.length - 1) index = this.elSteps.length - 1;
    // return;
    for (var i = 0; i < this.elSteps.length; i++) {
      var el = this.elSteps[i];

      if (i <= index) {
        el.classList.add("active");
        var kind = parseInt(el.getAttribute("data-kind"));

        if (kind == -1);
        else if (kind == 0);
        else if (kind == 1); // el.style.color = 'black';
      } else {
        el.classList.remove("active");
        el.style.color = "";
      }

      // var bar = null;
      if (i > 0) {
        var bar = this.elBar1s[i - 1];
        if (i <= index) bar.style.width = "100%";
        else bar.style.width = "0%";
      }
    }
    this.activeIndex = index;
    this._update();
    // if(this.activeIndex > 0)
    this.Swiper.slideTo(this.activeIndex * 2);
  }
  stepDown(index) {
    console.log("Step Down");
    this.activeIndex--;
    if (this.activeIndex < 0) this.activeIndex = 0;

    this.setActive(this.activeIndex);
  }
  stepUp(index) {
    console.log("Step Up");
    this.activeIndex++;
    if (this.activeIndex > this.elSteps.length - 1) this.activeIndex = this.elSteps.length - 1;

    this.setActive(this.activeIndex);
  }
  stepSet(index) {
    // console.log('Step Set');
    this.activeIndex = index;
    if (this.activeIndex > this.elSteps.length - 1) this.activeIndex = this.elSteps.length - 1;

    if (this.activeIndex < 0) this.activeIndex = 0;

    this.setActive(this.activeIndex);
  }
  setProgressContent(items, kind) {
    // kind == 0 이면, 숫자...
    // kind == 1 , 2 이면,
    var detail = [
      // Lesson Player 에서
      [
        // 영상
        '<i class="fa-brands fa-youtube" ></i>',
        // 문제
        '<i class="fa-solid fa-pen-to-square"></i>',
      ],
      // Testum Player 에서
      [
        // 첫번째 테스텀
        '<i class="fa-solid fa-user"></i>',
        // 오답하기
        '<i class="fa-solid fa-file-circle-question"></i>',
        // 두번째 테스텀
        '<i class="fa-solid fa-user-group"></i>',
        // 오답하기
        '<i class="fa-solid fa-file-circle-question"></i>',
        // 세번째 테스텀
        '<i class="fa-solid fa-users"></i>',
        // 오답하기
        '<i class="fa-solid fa-file-circle-question"></i>',
      ],
    ];
    // this.clearStep();
    this.clearSwiper();
    this.options.items = items;
    this.options.kind = kind;

    for (var i = 0; i < this.options.items.length; i++) {
      var slide = mtoElementBuilder.createComponent(mtmPlayerLessonProgress.staticSlide);
      slide.style.zIndex = "0";
      slide.style.width = "30px";

      if (this.options.kind == 1) {
        // lesson 이면 여기로...
        var data = detail[0][this.options.items[i]];
        var elStep = this.addStep(data, this.options.items[i]);

        slide.appendChild(elStep);
        this.Swiper.appendSlide(slide);
        this.slides.push(slide);
        if (i < this.options.items.length - 1) {
          var subSlide = mtoElementBuilder.createComponent(mtmPlayerLessonProgress.staticSlide);
          subSlide.style.zIndex = "-1";
          subSlide.style.width = "60px";
          var elBar = this.addBar(data, this.options.items[i]);
          subSlide.appendChild(elBar);

          this.Swiper.appendSlide(subSlide);
          this.slides.push(subSlide);
        }
      } else if (this.options.kind == 2) {
        // lesson 이면 여기로...
        var data = detail[1][this.options.items[i]];
        var elStep = this.addStep(data, -1); //this.options.items[i]);

        slide.appendChild(elStep);
        this.Swiper.appendSlide(slide);
        this.slides.push(slide);
        if (i < this.options.items.length - 1) {
          var subSlide = mtoElementBuilder.createComponent(mtmPlayerLessonProgress.staticSlide);
          subSlide.style.zIndex = "-1";
          subSlide.style.width = "60px";
          var elBar = this.addBar(data, this.options.items[i]);
          subSlide.appendChild(elBar);

          this.Swiper.appendSlide(subSlide);
          this.slides.push(subSlide);
        }
      }
    }

    this.Swiper.update();

    this.setActive(0);
  }
  clearSwiper() {
    for (var i = 0; i < this.slides.length; i++) {
      var slide = this.slides[i];
      this.Swiper.removeSlide(slide);
    }
    this.Swiper.removeAllSlides();
    this.Swiper.update();

    this.elSteps = [];
    this.elBars = [];
    this.elBar0s = [];
    this.elBar1s = [];

    this.slides = [];
    this.indexes = [];
    this.options.items = [];
  }
  // mtmPlayerLessonProgress.prototype.refresh = function() {
  //     for(var i=0;i<this.slides.length;i++)
  //     {
  //         var slide = this.slides[i];
  //         this.Swiper.removeSlide(slide);
  //     }
  //     this.Swiper.removeAllSlides();
  //     this.Swiper.update();
  //     this.slides = [];
  //     this.indexes = [];
  //     this.options.items = [];
  //     this.addSwiper();
  // }
  setIndex(idx) {
    this.Swiper.slideTo(idx);
    if (this.activeIndex >= 0) {
      var slide = this.slides[this.activeIndex];
      var el = slide.children[0];
      el.classList.remove("active");
    }

    var index = idx;

    if (index >= 0) {
      this.activeIndex = index;
      var slide = this.slides[this.activeIndex];
      var el = slide.children[0];
      el.classList.add("active");
    }
  }
  setIndicatorContent(items) {
    this.clearSwiper();
    this.options.items = items;
    this.addSwiper();
  }
  addSwiper() {
    // console.log('mtmPlayerLessonProgress > addSwiper : ', this.options.items);
    for (var i = 0; i < this.options.items.length; i++) {
      var slide = mtoElementBuilder.createComponent(mtmPlayerLessonProgress.staticSlide);

      var el = mtoElementBuilder.createComponent(mtmPlayerLessonProgress.staticItem);
      // console.log(el);
      el.innerHTML = this.options.items[i].index;
      if (this.options.items[i].active) {
        el.classList.add("active");
        this.activeIndex = i;
      }

      el.setAttribute("data-id", this.options.items[i].id);
      el.addEventListener("click", this.onClickIndicatorHandler.bind(this));

      slide.appendChild(el);
      // this.elWrapper.appendChild(slide);
      this.Swiper.appendSlide(slide);
      this.slides.push(slide);
    }

    this.Swiper.update();
  }
}

mtmPlayerLessonProgress.id = 0;

mtmPlayerLessonProgress.staticSlide = [{ level: 0, tag: "div", class: "swiper-slide" }];

mtmPlayerLessonProgress.staticItem = [
  {
    level: 0,
    tag: "div",
    class: "mtm-player-indicator",
    text: "",
    attr: { "data-id": "", "data-index": "" },
    // 'attr':{'style' : 'width:30px;height:30px;color:#fff;background:#01353c;border-radius:100%',
    //         'data-id':'','data-index':'' },
  },
];
