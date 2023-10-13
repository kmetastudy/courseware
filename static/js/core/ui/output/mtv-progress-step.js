// const progressBar = document.getElementById("progress-bar");
// const progressNext = document.getElementById("progress-next");
// const progressPrev = document.getElementById("progress-prev");
// const steps = document.querySelectorAll(".step");
// let active = 1;

// progressNext.addEventListener("click", () => {
//   active++;
//   if (active > steps.length) {
//     active = steps.length;
//   }
//   updateProgress();
// });

// progressPrev.addEventListener("click", () => {
//   active--;
//   if (active < 1) {
//     active = 1;
//   }
//   updateProgress();
// });

// const updateProgress = () => {
//   steps.forEach((step, i) => {
//     if (i < active) {
//       step.classList.add("active");
//     } else {
//       step.classList.remove("active");
//     }
//   });
//   progressBar.style.width = ((active - 1) / (steps.length - 1)) * 100 + "%";
//   if (active === 1) {
//     progressPrev.disabled = true;
//   } else if (active === steps.length) {
//     progressNext.disabled = true;
//   } else {
//     progressPrev.disabled = false;
//     progressNext.disabled = false;
//   }
// };

// Progress Steps javascript, HTML & CSS | codewithrandom
// https://www.codewithrandom.com/2021/10/progress-steps-using-html-css.html

// Code a responsive step progress bar with HTML, CSS, & JavaScript
// https://w3collective.com/responsive-step-progress-bar/
var mtvProgressStep = function(options) {
    this.id = 'id-mtv-progress-step-' + mtvProgressStep.id++;

    this.elThis = null;
    this.options = options;

    this.steps = [];
    this.activeIndex = -1;
    this.init();

}

mtvProgressStep.id = 0;

mtvProgressStep.staticPlayArea = [

];

// <div id="progress">
//    <div id="progress-bar"></div>
//    <ul id="progress-num">
//        <li class="step active">1</li>
//        <li class="step">2</li>
//        <li class="step">3</li>
//        <li class="step">4</li>
//    </ul>
// </div>
// <button id="progress-prev" class="btn" disabled>Prev</button>
// <button id="progress-next" class="btn">Next</button>

mtvProgressStep.prototype.init = function() {
    this.elThis = document.createElement('div');
}


