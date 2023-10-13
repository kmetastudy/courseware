// require('../../../../css/mtv/core/output/mtm-circular-progress.css');
require('../../../../css/mtv/core/output/mtm-circular-progress-v2.css');

// How to make Circular Progress Bar in HTML CSS & JavaScript | Skills Bar
// https://www.youtube.com/watch?v=SKU2gExpkPI

export var mtoCircularProgress = {
    events: {},
    id : 0,
    create : function(value,unit,bAni)
    {
        var elMain = document.createElement('div');
        elMain.classList.add('mtm-circular-progress');

        var elProgressBar = document.createElement('div')
        elProgressBar.classList.add('progress-bar');
        elMain.appendChild(this.elProgressBar);

        var elProgressValue = document.createElement('span');
        elProgressValue.classList.add('progress-value');
        // this.elProgressValue.innerHTML = '0%';
        elProgressBar.appendChild(this.elProgressValue);

        if(!value)
            value = 0;
        if(!unit)
            unit = '';
        
        elProgressBar.style.background = 'conic-gradient(var(--theme-color-v2-c3-rgb) ' + value*3.6 + 'deg, rgba(0,0,0,0) 0deg)';
        elProgressValue.innerHTML = value + unit;

        return elMain;
    },
};
