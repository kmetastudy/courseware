// dependency - d3.js
// <script src="https://d3js.org/d3.v7.min.js"></script> 

// Create a Pie or Doughnut Chart using D3.js
// https://medium.com/javarevisited/create-a-pie-or-doughnut-chart-using-d3-js-7d4a1d590420

// D3.js Step by Step: Step 2 - A Basic Donut Chart
// https://embed.plnkr.co/plunk/Zfv7x6

// Web Charts with D3.JS
// http://www.bscalable.com/blog-galapagos/2015/6/27/web-charts-with-d3js
export var mtvD3ProgressCircle = {

    _calcPercent : function(percent) {
      return [percent, 100-percent];
    },

    _calcPercent2 : function(percent) {
        return [100-percent, percent];
    },

    draw : function(element, percent, width, height, text_y, kind) {
        width = typeof width !== 'undefined' ? width : 22;
        height = typeof height !== 'undefined' ? height : 22;
        text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
        var duration   = 500;
        var transition = 200;

        var dataset = {};
            dataset.lower = this._calcPercent(0);
            dataset.upper = this._calcPercent(percent);
        
        
        var radius = Math.min(width, height) / 2;
        var pie = d3.layout.pie().sort(null);
        var pie2 = d3.layout.pie().sort(null);
        var format = d3.format(".0%");
        
            

        var arc = d3.svg.arc()
            .innerRadius(radius - 2)
            .outerRadius(radius);

        var svg = d3.select(element).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", function(d, i) { return "color" + i })
                .attr("d", arc)
                .each(function(d) { 
                    this._current = d; 
                    // console.log('1) this._current : ', this._current);
                }); // store the initial values

        var text = svg.append("text")
                .attr("class","color")
                .attr("text-anchor", "middle")
                .attr("dy", text_y);

        
        if (typeof(percent) === "string") {
                text.text(percent);
        }
        else {
            var progress = 0;
            var timeout = setTimeout(function () {
            clearTimeout(timeout);
            path = path.data(pie(dataset.upper)); // update the data
            path.transition().duration(duration).attrTween("d", function (a) {
                // Store the displayed angles in _current.
                // Then, interpolate from _current to the new angles.
                // During the transition, _current is updated in-place by d3.interpolate.
                var i  = d3.interpolate(this._current, a);
                var i2 = d3.interpolate(progress, percent);
                this._current = i(0);
                return function(t) {
                    if(kind == 1)
                        text.text( format(i2(t) / 100) );
                    else if(kind == 0)
                        text.text(parseInt(i2(t)));
                    // else
                    //     text.text('');
                // console.log('arc(i(t))', arc(i(t)));
                // console.log('_current : ', this._current , ',a : ', a);
                // console.log('t :' , t, ', i(t) :', i(t), ', arc(i(t)) : ', arc(i(t)) , );

                return arc(i(t));
                };
            }); // redraw the arcs
            }, 200);
        }
    },

    doubledraw : function(element, percent0,  size0, percent1, size1, text_y, kind) {
        size_0 = typeof size0 !== 'undefined' ? size0 : 22;
        size_1 = typeof size1 !== 'undefined' ? size1 : 22;
        text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
        var duration   = 500;
        var transition = 200;

        var dataset = {};
        dataset.lower = this._calcPercent(0);
        dataset.upper = this._calcPercent(percent0);
        dataset.inlower = this._calcPercent(0);
        dataset.inupper = this._calcPercent(percent1);

        // dataset.lower = this._calcPercent(0);
        // dataset.upper = this._calcPercent(percent0);
        // dataset.inlower = this._calcPercent(0);
        // dataset.inupper = this._calcPercent(percent1);
        
        
        var radius0 = Math.min(size_0, size_0) / 2;
        var radius1 = Math.min(size_1, size_1) / 2;
        var pie = d3.layout.pie().sort(null);
        var pie2 = d3.layout.pie().sort(null);
        var format = d3.format(".0%");
        
            

        var arc = d3.svg.arc()
            .innerRadius(radius0 - 2)
            .outerRadius(radius0);
        var arc1 = d3.svg.arc()
            .innerRadius(radius0 - 2)
            .outerRadius(radius0);

        var inarc = d3.svg.arc()
            .innerRadius(radius1 - 2)
            .outerRadius(radius1);

            var inarc1 = d3.svg.arc()
            .innerRadius(radius1 - 2)
            .outerRadius(radius1);

        var svg = d3.select(element).append("svg")
            .attr("width", size_0)
            .attr("height", size_0)
            .append("g")
            .attr("transform", "translate(" + size_0 / 2 + "," + size_0 / 2 + ")");

        var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", "color3")
                .attr("d", arc);
                
        var path1 = svg.append("path").
                data(pie(dataset.upper))
                .attr("class", "color0")
                .attr("d", arc1);

                // svg.append("path").
                // data(pie(dataset.lower))
                // .attr("class", "color1")
                // .attr("d", inarc);

                svg.append("path").
                data(pie2([0,100]))
                .attr("class", "color4")
                .attr("d", inarc);

                svg.append("path").
                data(pie2([100, 0]))
                .attr("class", "color4")
                .attr("d", inarc);

                svg.append("path").
                data(pie2(dataset.inupper))
                .attr("class", "color2")
                .attr("d", inarc1);
                
        var text = svg.append("text")
                .attr("class","color")
                .attr("text-anchor", "middle")
                .attr("dy", text_y);

        
        // if (typeof(percent) === "string") {
                text.text(percent1.toString());
        // }
        // else {
        //     var progress = 0;
        //     var timeout = setTimeout(function () {
        //     clearTimeout(timeout);
        //     path = path.data(pie(dataset.upper)); // update the data
        //     path.transition().duration(duration).attrTween("d", function (a) {
        //         // Store the displayed angles in _current.
        //         // Then, interpolate from _current to the new angles.
        //         // During the transition, _current is updated in-place by d3.interpolate.
        //         var i  = d3.interpolate(this._current, a);
        //         var i2 = d3.interpolate(progress, percent);
        //         this._current = i(0);
        //         return function(t) {
        //             if(kind == 1)
        //                 text.text( format(i2(t) / 100) );
        //             else if(kind == 0)
        //                 text.text(parseInt(i2(t)));
        //             // else
        //             //     text.text('');
        //         // console.log('arc(i(t))', arc(i(t)));
        //         // console.log('_current : ', this._current , ',a : ', a);
        //         // console.log('t :' , t, ', i(t) :', i(t), ', arc(i(t)) : ', arc(i(t)) , );

        //         return arc(i(t));
        //         };
        //     }); // redraw the arcs
        //     }, 200);
        // }
    },

    doubledraw2 : function(element, percent0,  size0, percent1, size1, text_y, kind) {
        size_0 = typeof size0 !== 'undefined' ? size0 : 22;
        size_1 = typeof size1 !== 'undefined' ? size1 : 22;
        text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
        var duration   = 500;
        var transition = 200;

        var dataset = {};

        dataset.lower =  this._calcPercent(0);
        dataset.upper = this._calcPercent(percent0);
        dataset.inlower = this._calcPercent(0);
        dataset.inupper = this._calcPercent(percent1);
        
        var radius0 = Math.min(size_0, size_0) / 2;
        var radius1 = Math.min(size_1, size_1) / 2;
        var pie = d3.layout.pie().sort(null);
        var pie2 = d3.layout.pie().sort(null);
        var format = d3.format(".0%");
        
            

        var arc = d3.svg.arc()
            .innerRadius(radius0 - 2)
            .outerRadius(radius0);
        var arc1 = d3.svg.arc()
            .innerRadius(radius0 - 2)
            .outerRadius(radius0);

        var inarc = d3.svg.arc()
            .innerRadius(radius1 - 2)
            .outerRadius(radius1);

            var inarc1 = d3.svg.arc()
            .innerRadius(radius1 - 2)
            .outerRadius(radius1);

        var svg = d3.select(element).append("svg")
            .attr("width", size_0)
            .attr("height", size_0)
            .append("g")
            .attr("transform", "translate(" + size_0 / 2 + "," + size_0 / 2 + ")");

        var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", "color1")
                .attr("d", arc);
                
        var path1 = svg.append("path").
                data(pie(dataset.upper))
                .attr("class", "color0")
                .attr("d", arc1);

                // svg.append("path").
                // data(pie2([0,100]))
                // .attr("class", "color4")
                // .attr("d", inarc);

                // svg.append("path").
                // data(pie2([100, 0]))
                // .attr("class", "color4")
                // .attr("d", inarc);

                // svg.append("path").
                // data(pie2(dataset.inupper))
                // .attr("class", "color2")
                // .attr("d", inarc1);
                
        var text = svg.append("text")
                .attr("class","color")
                .attr("text-anchor", "middle")
                .attr("dy", text_y);

        
                text.text(percent1.toString());
        
    },

    // var data = [10, 50, 80];
    _calcPercent3 : function(percent) {
        return [percent, 100-percent];
    },

    draw2 : function(element, percent, width, height, text_y, kind) {
        width = typeof width !== 'undefined' ? width : 22;
        height = typeof height !== 'undefined' ? height : 22;
        text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
        var duration   = 500;
        var transition = 200;

        var dataset = {};
            dataset.upper = this._calcPercent3(percent);
        
        var radius = Math.min(width, height) / 2;
        var pie = d3.layout.pie().sort(null);
        var pie2 = d3.layout.pie().sort(null);
        var format = d3.format(".0%");
        
            

        var arc = d3.svg.arc()
            .innerRadius(radius - 2)
            .outerRadius(radius);

        var svg = d3.select(element).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // var d3.select(element);
        // console.log('svg',svg);
        // var svg = $(element).append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .append("g")
        //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
                .data(pie(dataset.upper))
                .enter().append("path")
                .attr("class", function(d, i) { return "color" + i })
                .attr("d", arc)
                .each(function(d) { 
                    this._current = d; 
                    console.log('1) this._current : ', this._current);
                }); // store the initial values

        var text = svg.append("text")
                .attr("class","color")
                .attr("text-anchor", "middle")
                .attr("dy", text_y);

        // path = path.data(pie(dataset.upper)); 
        // var i  = d3.interpolate(this._current, a);
        // var path2 = path.selectAll("path")
        //         .data(pie(dataset.lower))
        //         .enter().append("path")
        //         .attr("class", function(d, i) { return "color" + 0 })
        //         .attr("d", arc)
        //         .each(function(d) { 
        //             this._current = d; 
        //             console.log('2) this._current : ', this._current);
        //         }); // store the initial values
        if(kind == 1)
            text.text(percent+'%');
        else
            text.text(percent);

        // if (typeof(percent) === "string") {
        //         text.text(percent);
        // }
        // else {
        //     var progress = 0;
        //     var timeout = setTimeout(function () {
        //     clearTimeout(timeout);
        //     path = path.data(pie(dataset.upper)); // update the data
        //     path.transition().duration(duration).attrTween("d", function (a) {
        //         // Store the displayed angles in _current.
        //         // Then, interpolate from _current to the new angles.
        //         // During the transition, _current is updated in-place by d3.interpolate.
        //         var i  = d3.interpolate(this._current, a);
        //         var i2 = d3.interpolate(progress, percent);
        //         this._current = i(0);
        //         return function(t) {
        //             if(kind == 1)
        //                 text.text( format(i2(t) / 100) );
        //             else
        //                 text.text(parseInt(i2(t)));
                
        //         // console.log('arc(i(t))', arc(i(t)));
        //         console.log('_current : ', this._current , ',a : ', a);
        //         console.log('t :' , t, ', i(t) :', i(t), ', arc(i(t)) : ', arc(i(t)) , );

        //         return arc(i(t));
        //         };
        //     }); // redraw the arcs
        //     }, 200);
        // }
    },


    print : function(element, percent, width, height, text_y, kind) {
        width = typeof width !== 'undefined' ? width : 22;
        height = typeof height !== 'undefined' ? height : 22;
        text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
        var duration   = 500;
        var transition = 200;

        var dataset = {};

            dataset.upper = this._calcPercent3(percent);
        
        var radius = Math.min(width, height) / 2;
        var pie = d3.layout.pie().sort(null);
        var pie2 = d3.layout.pie().sort(null);
        var format = d3.format(".0%");
        
            

        var arc = d3.svg.arc()
            .innerRadius(radius - 2)
            .outerRadius(radius);

        var svg = d3.select(element).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // var d3.select(element);
        // console.log('svg',svg);
        // var svg = $(element).append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .append("g")
        //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
                .data(pie(dataset.upper))
                .enter().append("path")
                .attr("class", function(d, i) { return "color" + i })
                .attr("d", arc)
                .each(function(d) { 
                    this._current = d; 
                    console.log('1) this._current : ', this._current);
                }); // store the initial values

        var text = svg.append("text")
                .attr("class","color")
                .attr("text-anchor", "middle")
                .attr("dy", text_y);

        // path = path.data(pie(dataset.upper)); 
        // var i  = d3.interpolate(this._current, a);
        // var path2 = path.selectAll("path")
        //         .data(pie(dataset.lower))
        //         .enter().append("path")
        //         .attr("class", function(d, i) { return "color" + 0 })
        //         .attr("d", arc)
        //         .each(function(d) { 
        //             this._current = d; 
        //             console.log('2) this._current : ', this._current);
        //         }); // store the initial values
        if(kind == 1)
            text.text(percent+'%');
        else
            text.text(percent);

        // if (typeof(percent) === "string") {
        //         text.text(percent);
        // }
        // else {
        //     var progress = 0;
        //     var timeout = setTimeout(function () {
        //     clearTimeout(timeout);
        //     path = path.data(pie(dataset.upper)); // update the data
        //     path.transition().duration(duration).attrTween("d", function (a) {
        //         // Store the displayed angles in _current.
        //         // Then, interpolate from _current to the new angles.
        //         // During the transition, _current is updated in-place by d3.interpolate.
        //         var i  = d3.interpolate(this._current, a);
        //         var i2 = d3.interpolate(progress, percent);
        //         this._current = i(0);
        //         return function(t) {
        //             if(kind == 1)
        //                 text.text( format(i2(t) / 100) );
        //             else
        //                 text.text(parseInt(i2(t)));
                
        //         // console.log('arc(i(t))', arc(i(t)));
        //         console.log('_current : ', this._current , ',a : ', a);
        //         console.log('t :' , t, ', i(t) :', i(t), ', arc(i(t)) : ', arc(i(t)) , );

        //         return arc(i(t));
        //         };
        //     }); // redraw the arcs
        //     }, 200);
        // }
    },

    

    print2 : function(element, percent, width, height, text_y, kind) {
        width = typeof width !== 'undefined' ? width : 22;
        height = typeof height !== 'undefined' ? height : 22;
        text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";
        var duration   = 0;
        var transition = 0;

        var dataset = {};

            dataset.lower = this._calcPercent(0);
            dataset.upper = this._calcPercent(percent);
        
        var radius = Math.min(width, height) / 2;
        var pie = d3.layout.pie().sort(null);
        var format = d3.format(".0%");
        
            

        var arc = d3.svg.arc()
            .innerRadius(radius - 2)
            .outerRadius(radius);

        var svg = d3.select(element).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // var d3.select(element);
        // console.log('svg',svg);
        // var svg = $(element).append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .append("g")
        //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", function(d, i) { return "color" + i })
                .attr("d", arc)
                .each(function(d) { this._current = d; }); // store the initial values

        var text = svg.append("text")
                .attr("class","color")
                .attr("text-anchor", "middle")
                .attr("dy", text_y);

        // if (typeof(percent) === "string") {
        //         text.text(percent);
        // }
        // else {
        //     // var progress = 0;
        //     // var i  = d3.interpolate(this._current, a);
        //     // var i2 = d3.interpolate(progress, percent)

            if(kind == 1)
                text.text(percent+'%');
            else
                text.text(percent);
            
        //     // path = path.data(pie(dataset.upper));
            // arc();
            path = svg.selectAll("path")
                .data(pie(dataset.upper))
                .enter().append("path")
                .attr("class", function(d, i) { return "color" + i })
                .attr("d", arc)
                .each(function(d) { this._current = 0; }); // store the initial values
            // arc(1);
            
            

        //     // var timeout = setTimeout(function () {
        //     // clearTimeout(timeout);
        //     // path = path.data(pie(dataset.upper)); // update the data
        //     // path.transition().duration(duration).attrTween("d", function (a) {
        //     //     // Store the displayed angles in _current.
        //     //     // Then, interpolate from _current to the new angles.
        //     //     // During the transition, _current is updated in-place by d3.interpolate.
        //     //     var i  = d3.interpolate(this._current, a);
        //     //     var i2 = d3.interpolate(progress, percent)
        //     //     this._current = i(0);
        //     //     return function(t) {
        //     //         if(kind == 1)
        //     //             text.text( format(i2(t) / 100) );
        //     //         else
        //     //             text.text(parseInt(i2(t)));
        //     //     return arc(i(t));
        //     //     };
        //     // }); // redraw the arcs
        //     // }, 200);
        // if (typeof(percent) === "string") {
        //     text.text(percent);
        // }
        // else {
        //     var progress = percent;
        // }
    },

    // return {
    //     draw : draw,
    //     doubledraw : doubledraw,
    //     doubledraw2 : doubledraw2,
    //     draw2 : draw2,
        
    //     // draw(element,data,22,22,".35rem",0);
    //     print : print,
    // }

};