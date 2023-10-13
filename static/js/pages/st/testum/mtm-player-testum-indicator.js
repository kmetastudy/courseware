// slidr.js
// http://bchanx.com/slidr

// Animated Image Slider Carousel With JavaScript
// https://www.cssscript.com/animated-image-slider/

// Javascript Animated Frame Slideshow
// https://diyifang.medium.com/javascript-animated-frame-slideshow-6baa3c479554

// CodePen Home :Pure JavaScript slider with animations
// https://codepen.io/butlerx/pen/xgGaWr

// slick : the last carousel you'll ever need
// https://kenwheeler.github.io/slick/

// Getting Started With Swiper
// https://swiperjs.com/get-started

//
// import {mtvComponentBuilder} from '../../core/utils/mtv-component-builder.js';
import { mtoElementBuilder } from "../../../core/utils/mto-element-builder";

// require('../../../../css/mtv/st/mtm-player-indicator.css');
require("./mtm-player-testum-indicator.css");

export var mtmPlayerTestumIndicator = function (options) {
  this.id = "id-mtm-player-testum-indicator-" + mtmPlayerTestumIndicator.id++;

  this.elThis = null;
  this.options = options;

  this.slides = [];
  this.activeIndex = -1;
  this._init();
};

mtmPlayerTestumIndicator.id = 0;

mtmPlayerTestumIndicator.staticSlide = [{ level: 0, tag: "div", class: "swiper-slide" }];

mtmPlayerTestumIndicator.staticItem = [
  {
    level: 0,
    tag: "div",
    class: "mtm-player-testum-thumb",
    text: "",
    attr: { "data-id": "", "data-index": "" },
    // 'attr':{'style' : 'width:30px;height:30px;color:#fff;background:#01353c;border-radius:100%',
    //         'data-id':'','data-index':'' },
  },
];

mtmPlayerTestumIndicator.staticPlayArea = [];

mtmPlayerTestumIndicator.prototype.clickIndicatorHandler = function (e) {
  // console.log('mtmPlayerTestumIndicator : clickIndicatorHandler > innerHTML ', e.target.innerHTML);
  // console.log('mtmPlayerTestumIndicator : clickIndicatorHandler > data-id ', e.target.getAttribute('data-id'));

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
};

mtmPlayerTestumIndicator.prototype.create = function (tagList) {};

mtmPlayerTestumIndicator.prototype.prepare = function () {};

mtmPlayerTestumIndicator.prototype._clearSwiper = function () {
  for (var i = 0; i < this.slides.length; i++) {
    var slide = this.slides[i];
    // this.Swiper.removeSlide(slide);
  }
  this.Swiper.removeAllSlides();
  this.Swiper.update();

  this.slides = [];
  this.indexes = [];
  this.options.items = [];
};

mtmPlayerTestumIndicator.prototype._addSwiper = function () {
  // console.log('mtmPlayerTestumIndicator > _addSwiper : ', this.options.items);

  for (var i = 0; i < this.options.items.length; i++) {
    var slide = mtoElementBuilder.createComponent(mtmPlayerTestumIndicator.staticSlide);

    var el = mtoElementBuilder.createComponent(mtmPlayerTestumIndicator.staticItem);
    // console.log(el);
    el.innerHTML = this.options.items[i].index;
    if (this.options.items[i].active) {
      el.classList.add("active");
      this.activeIndex = i;
    }

    el.setAttribute("data-id", this.options.items[i].id);
    el.addEventListener("click", this.clickIndicatorHandler.bind(this));

    slide.appendChild(el);
    // this.elWrapper.appendChild(slide);
    this.Swiper.appendSlide(slide);
    this.slides.push(slide);
  }

  this.Swiper.update();
};

mtmPlayerTestumIndicator.prototype._initSwiper = function () {
  this.Swiper = new Swiper(this.elSwiper, {
    autoHeight: true,
    slidesPerView: 4,
    // slidesPerView: 1,
    centeredSlides: true,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 4,
        //   spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 6,
        //   spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 8,
        //   spaceBetween: 40
      },
    },
    // spaceBetween: 30,
  });

  // // console.log(this.elThis);

  // for(var i=0;i<this.options.items.length;i++)
  // {
  //     this._addSwiper(this.options.items[i]);
  // }
  // this.Swiper.update(true);
  // // this.Swiper.resizeFix();
  // this.Swiper.updateSize();
  // this.Swiper.updateSlides();
};

mtmPlayerTestumIndicator.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);
  this.elThis.classList.add("mtm-player-testum-indicator");

  this.elFlex = document.createElement("div");
  this.elFlex.setAttribute("class", "d-flex justify-content-center my-2");

  this.elSwiper = document.createElement("div");

  this.elSwiper.setAttribute("class", "justify-content-center swiper-container");
  // Todo. 폭 조정
  this.elSwiper.style.width = "100%";
  this.elSwiper.style.overflowX = "hidden";
  this.elSwiper.style.height = "30px"; // 이걸 없애니 높이가 없어지네...
  // this.elSwiper.style.margin = "auto 10px";
  this.elSwiper.style.borderRadius = "20px";
  // this.elSwiper.style.backgroundColor = 'rgb(243,174,34)';

  this.elWrapper = document.createElement("div");
  this.elWrapper.setAttribute("class", "swiper-wrapper");
  this.elSwiper.appendChild(this.elWrapper);

  this.elFlex.appendChild(this.elSwiper);
  this.elThis.appendChild(this.elFlex);

  // this.elThis.style.backgroundColor = "rgb(0,125,135)";
  // console.log(this.elThis);
  // this.addThis();
  // for(var i=0;i<this.options.items.length;i++)
  // {
  //     this.addThis(this.options.items[i]);
  // }
  this._initSwiper();
  this._addSwiper();
};

// mtvComponentBuilder.register('mtv-player-testum-indicator',mtmPlayerTestumIndicator);
/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler /////////////////////////////////////
// 아직 쓰고 있지는 않는다.
mtmPlayerTestumIndicator.prototype.onResizeWindowHandler = function (e) {
  if (window.innerWidth < 768) {
    // this.Swiper.set
  } else {
  }
};

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API ///////////////////////////////////////
mtmPlayerTestumIndicator.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

// mtmPlayerTestumIndicator.prototype.refresh = function() {
//     for(var i=0;i<this.slides.length;i++)
//     {
//         var slide = this.slides[i];
//         // this.Swiper.removeSlide(slide);
//     }
//     this.Swiper.removeAllSlides();
//     this.Swiper.update();

//     this.slides = [];
//     this.indexes = [];
//     this.options.items = [];
//     this._addSwiper();
// }

mtmPlayerTestumIndicator.prototype.setIndex = function (idx) {
  this.Swiper.slideTo(idx);
  if (this.activeIndex >= 0 && this.slides.length > this.activeIndex) {
    var slide = this.slides[this.activeIndex];
    var el = slide.children[0];
    el.classList.remove("active");
  }

  var index = idx;

  if (index >= 0 && this.slides.length > index) {
    this.activeIndex = index;
    var slide = this.slides[this.activeIndex];
    var el = slide.children[0];
    el.classList.add("active");
  }
};

mtmPlayerTestumIndicator.prototype.setIndicatorContent = function (items) {
  this._clearSwiper();
  this.options.items = items;
  this._addSwiper();
};

// mtmPlayerTestumIndicator.prototype.addThis = function(item) {
//     var slide = mtoElementBuilder.createComponent(mtmPlayerTestumIndicator.staticSlide);

//     var el = mtoElementBuilder.createComponent(mtmPlayerTestumIndicator.staticItem);
//     // console.log(el);
//     el.innerHTML = item.index;
//     if(item.active)
//         el.classList.add('active');

//     el.setAttribute('data-id',item.id);
//     el.addEventListener('click',this.clickIndicatorHandler.bind(this));

//     slide.appendChild(el);
//     this.elWrapper.appendChild(slide);

// }

// Todo. setAnswered
mtmPlayerTestumIndicator.prototype.setAnswered = function (index, bAnswered) {
  if (this.slides.lenghth > index) {
    if (bAnswered) this.slides[index].classList.add("answered");
    else this.slides[index].classList.remove("answered");
  }
};
