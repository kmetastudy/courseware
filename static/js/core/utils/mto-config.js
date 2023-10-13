export var mtoConfig = {
    widthOnePanel : 1280,
    demoMode : false,
    getDPI : function() {
        var div = document.createElement( "div");
        div.style.height = "1in";
        div.style.width = "1in";
        div.style.top = "-100%";
        div.style.left = "-100%";
        div.style.position = "absolute";
    
        document.body.appendChild(div);
    
        var width = screen.width;
        var height = screen.height;
        var availWidth = screen.availWidth;
        var availHeight = screen.availHeight;
        var wdpi =  div.offsetWidth;
        var hdpi = div.offsetHeight;
        var dpr = window.devicePixelRatio;
    
        document.body.removeChild( div );

        var result = {
            width : width,
            height : height,
            availWidth : availWidth,
            availHeight : availHeight,
            wdpi : wdpi,
            hdpi : hdpi,
            dpr : dpr,
        }
        return result;
    },

    getOne : function() {
        var d = getDPI();

        var w = d.width / d.wdpi;
        var h = d.height / d.hdpi;

        if(d.availWidth <= 480)
            return true;
        if(w <= 4) // 4 inch
            return true;
        
        return false;
    },

    getSize : function(id)
    {
        var el = document.getElementById(id);
        // if(el)
        // {
        //     el.
        // }
    },

    // Full height of a html element (div) including border, padding and margin?
    // https://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
    getHeight : function(elm)
    {
        // function Dimension(elmID) {
            var elmHeight, elmMargin; 
            // = document.getElementById(elmID);
            // if(document.all) {// IE
            //     elmHeight = elm.currentStyle.height;
            //     // elmHeight = elm.currentStyle.height;
            //     elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
            // } else 
            {// Mozilla
                elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
                elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
            }
            return (elmHeight+elmMargin);
        // }
    }
    // return {
    //     getDPI : getDPI,
    //     getOne : getOne,
    //     getSize : getSize,
    // }
};