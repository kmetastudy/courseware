// Easiest CSS for "red notification badge" with count
// https://stackoverflow.com/questions/5747863/easiest-css-for-red-notification-badge-with-count

// CodePen Home - Notification badge
// https://codepen.io/ykosinets/pen/eYYEMpR

// CSS ANIMATION - THE PULSE EFFECT
// https://www.florin-pop.com/blog/2019/03/css-pulse-effect/

// Element: animationend event
// https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event

// Element: transitionend event
// https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event

// CodePen Home - CSS animated notification badge
// https://codepen.io/sjmcpherson/pen/nodqoq

// Revised Rounded Buttons
// https://codepen.io/tylersticka/pen/XWrgxjw

// Version Badge
// https://codepen.io/avstorm/pen/LYmKaVM
require("../../../../css/core/ui/output/mtm-output-badge.css");
export var mtmOutputBadge = function (options) {
  this.id = "id-mtm-output-badge-" + mtmOutputBadge.id++;
  this.value = 0;
  this.options = {
    badgeClass: "mtm-output-badge",
    badgeCounterClass: "mtm-output-badge-counter",
    animationSpeed: 150,
  };

  if (options) {
    if (options.element) this.options.elParent = options.element;
    if (options.background) this.options.background = options.background;
    if (options.color) this.options.color = options.color;
  }
  // else
  // console.log('mtmOutputBadge : ', this.elParent);
  this._init();
};

mtmOutputBadge.id = 0;

// class Badge {
//     constructor(element, options) {
//       this.value = 0;
//       this.options = options || {
//         badgeClass: 'notification-badge',
//         badgeCounterClass: 'notification-counter',
//         animationSpeed: 150
//       }
//       if (!element) return;
//       this.element = element;
//       this.render();
//       this.badgeElement = element.querySelector('.' + this.options.badgeClass);
//       this.badgeCounterElement = element.querySelector('.' + this.options.badgeCounterClass);
//     }

//     render() {
//       let counter = document.createElement('SPAN');
//       counter.className = this.options.badgeClass;
//       counter.innerHTML = `<span class="${this.options.badgeCounterClass}">0</span>`;

//       this.element.appendChild(counter);
//     }

//     set(n) {
//       n = n || 0;
//       let newCounterElement = this.badgeCounterElement.cloneNode();

//       // If value is somehow become wrong, wrong type, less than 0, or NaN.
//       // Then hide everything and log an error.
//       if (typeof n != 'number' || n < 0 || isNaN(n)) {
//         console.error('Wrong type or n(' + n + ') is less then 0!');
//         this.badgeElement.classList.remove('notification-badge--active');
//         this.badgeCounterElement.innerHTML = '';

//         return false;
//       }

//       if (n === 0) {
//         this.badgeElement.classList.remove('notification-badge--active');
//         this.badgeCounterElement.innerHTML = '';

//         return false;
//       }

//       if (n > 99) {
//         this.badgeElement.classList.add('notification-badge--limit');
//       } else {
//         this.badgeElement.classList.remove('notification-badge--limit');
//       }

//       if (!this.badgeElement.classList.contains('notification-badge--active')) {
//         this.badgeElement.classList.add('notification-badge--active');
//       }

//       let timer;
//       let animate = new Promise((resolve, reject) => {
//         newCounterElement.innerHTML = n;
//         newCounterElement.classList.add('notification-counter--new');
//         this.badgeCounterElement.classList.add('notification-counter--old');
//         this.badgeCounterElement.after(newCounterElement);

//         if (timer) clearTimeout(timer);
//         timer = setTimeout(resolve, 0);
//       });

//       animate.then(() => {
//         newCounterElement.classList.remove('notification-counter--new');
//         setTimeout(() => {
//           this.badgeCounterElement.remove();
//           this.badgeCounterElement = newCounterElement
//         }, this.options.animationSpeed);
//       }, () => false);
//     }

//     get() {
//       let n = parseInt(this.element.querySelector('.' + this.options.badgeCounterClass).innerHTML) || 0;
//       return typeof n != 'number' ? this.value : n;
//     }

//     decrease(n) {
//       n = n || 1;
//       this.value = this.get() || 0;

//       if (this.value - n < 0) {
//         return false;
//       }

//       this.set(this.value - n);
//     }

//     increase(n) {
//       n = n || 1;
//       this.value = this.get() || 0;

//       if (this.value + n < 0) {
//         return false;
//       }

//       this.set(this.value + n);
//     }
//   }

//   // API usage example:
//   let notificationElement = document.querySelector('.notification');
//   let customNotification = new Badge(notificationElement);

//   document.querySelector('.increase').addEventListener('click', () => {
//     customNotification.increase()
//   });
//   document.querySelector('.decrease').addEventListener('click', () => {
//     customNotification.decrease()
//   });
//   document.querySelector('.set').addEventListener('click', () => {
//     customNotification.set(100)
//   });
//   document.querySelector('.hide').addEventListener('click', () => {
//     customNotification.set(0)
//   });
//   document.querySelector('.get').addEventListener('click', () => {
//     window.alert('Notifications count = ' + customNotification.get());
//   });

mtmOutputBadge.prototype._create = function () {
  this.elThis = document.createElement("span");
  this.elThis.setAttribute("id", this.id);
  this.elThis.classList.add(this.options.badgeClass);

  if (this.options.background) this.elThis.style.background = this.options.background;

  this.elCounter = document.createElement("span");
  this.elCounter.classList.add(this.options.badgeCounterClass);

  if (this.options.color) this.elCounter.style.color = this.options.color;
  this.CountValue = 0;
  this.elCounter.innerHTML = ""; // this.CountValue;
  this.elThis.append(this.elCounter);

  this.options.elParent.append(this.elThis);
};

mtmOutputBadge.prototype._init = function () {
  this._create();
};

/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API ////////////////////////////////////////
mtmOutputBadge.prototype.setValue = function (value) {
  this.CountValue = value;
  this.elCounter.innerHTML = this.CountValue;
  if (this.CountValue > 0) this.elThis.classList.add("active");
  else {
    this.elCounter.innerHTML = "";
    this.elThis.classList.remove("active");
  }
};
