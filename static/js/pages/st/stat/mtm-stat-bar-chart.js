// Scrollable Bar Graph
// https://bl.ocks.org/johnnygizmo/3b16c4aa235ea9c0588d1bb26afad79a

// Stacked Bar Chart
// https://bl.ocks.org/mbostock/3886208

// Bar Chart | animated | d3 v5
// https://bl.ocks.org/bytesbysophie/952a1003dd188410e9c6262b68a65f9a

// Basic animation on barplot in d3.js
// https://d3-graph-gallery.com/graph/barplot_animation_start.html

// Most basic stacked barplot in d3.js
// https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html

// Bar Chart Race, Explained
// https://observablehq.com/@d3/bar-chart-race-explained 

// Stacked Bar Chart
// https://observablehq.com/@d3/stacked-bar-chart
// https://observablehq.com/@d3/stacked-bar-chart?collection=@d3/charts

// Taylor Polynomials
// https://observablehq.com/@meetamit/taylor-polynomials

// Learn D3.js
// https://www.tutorialsteacher.com/d3js

// D3.js Tutorial
// https://www.tutorialspoint.com/d3js/index.htm

// Learn D3.js from the ground up
// https://www.d3indepth.com/

// D3.js Bar Chart Tutorial: Build Interactive JavaScript Charts and Graphs
// https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/

// Tutorial: Building a D3.js Calendar Heatmap (to visualize StackOverflow Usage Data)
// https://blog.risingstack.com/tutorial-d3-js-calendar-heatmap/

// C3 Scrollable Bar Chart
// https://jsfiddle.net/Nivaldo/fptec4kc/
// http://jsfiddle.net/u7nu1L2n/

// D3 Bar Chart: Horizontal Scroll Example
// https://codepen.io/ghiden/pen/ZEBNmr

// How we did a chart with a horizontal scroll on d3.js
// https://prog.world/how-we-did-a-chart-with-a-horizontal-scroll-on-d3-js/

// JavaScript Horizontal Scroll + Drag
// https://bl.ocks.org/mforando/90a60be1885c4882928776b46aa0c40a

// Zoomable Bar Chart
// https://observablehq.com/@d3/zoomable-bar-chart?collection=@d3/d3-zoom

// 일일 학습 성과를 표현 하기 위해서는 어떻게 해야 하나?
// 문제량/Lesson Video 량
// 맞힌 문제 수 / 틀린 문제 수

// 학습 시간/ 학습량 
export var mtmStatBarChart = function (options) {
    this.id = 'mtm-stat-bar-chart-' + mtmStatBarChart.id++;
    this.options = options;
    this.elThis = null;

    this.x = 0;
    this.y = 0; 
    this.gX = 0;
    this.gY = 0;
    this.xAxis = 0;
    this.yAxis = 0; 
    this.idList=1;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.mainData = null;
    this.line = null;
    this.settings = {
        targets:[],
        detail:{
            type:"line"
        }
    };

    this._init();
}

mtmStatBarChart.id = 0;

mtmStatBarChart.staticBody = [

];
mtmStatBarChart.prototype._minMax = function () {
    this.limits = {maxY:null, minY:null, maxX:null, minX:null};
    this.padding = {top:20,bottom:150,left:100,right:20};


    this.eMaxY = this.eMinY = this.eMaxX = this.eMinX = 0;

    if(this.limits.maxX == null)
        this.limits.maxX = this.eMaxX; 
    else if(this.eMaxX > this.limits.maxX) 
        this.limits.maxX = this.eMaxX;

    if(this.limits.minX == null)
        this.limits.minX = this.eMinX;
    else if(this.eMinX < this.limits.minX)
        this.limits.minX = this.eMinX;

    if(this.limits.maxY == null)
        this.limits.maxY = this.eMaxY;
    else if(this.eMaxY > this.limits.maxY)
        this.limits.maxY = this.eMaxY;

    if(this.limits.minY == null)
        this.limits.minY = this.eMinY;
    else if(this.eMinY < this.limits.minY)
        this.limits.minY = this.eMinY;
}

mtmStatBarChart.prototype._init = function () {
    // <div id=area>
    // <svg width="960" height="500"></svg><P>
    // </div>
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('id',this.id);
    
    this.elSvg = document.createElement('svg');
    this.elSvg.setAttribute('width',this.options.width);
    this.elSvg.setAttribute('height',this.options.height);
    
    
    this.elThis.appendChild(this.elSvg);

    this._minMax();
    var svg = d3.select("#"+this.id + " svg");
    var width = +svg.attr("width");
    var height = +svg.attr("height");

    var canvasHeight = height-this.padding.top-this.padding.bottom;
    var canvasWidth  = width-this.padding.left-this.padding.right;

    var canvas = svg.append("g")
                    .attr("id","canvas"+'-' + this.id)
                    .attr("width",canvasWidth)
                    .attr("height",canvasHeight)
                    .attr("transform","translate("+this.padding.left+","+this.padding.top+")")
                    ;

    this.x = d3.scaleTime()
            .domain([this.limits.minX,this.limits.maxX])
            .range([0,+canvas.attr("width")]);
    this.y = d3.scaleLinear()
            .domain([this.limits.maxY*1.1,this.limits.minY-(this.limits.minY*0.1)])
            .range([0,+canvas.attr("height")]);
    var self = this;
    
    // this.line = d3.line()
    //     .x(function(d) { return  self.x(new Date(d.DATA_DATE)); })
    //     .y(function(d) { return  self.y(+d.VALUE_NUMERIC); });
    // this.xAxis = d3.axisBottom(this.x);
    // this.yAxis = d3.axisLeft(this.y);

    var formatPercent = d3.format(".0%");
    this.xAxis = d3.axisBottom(this.x).tickSize([]).tickPadding(10);
    this.yAxis = d3.axisLeft(this.y).tickFormat(formatPercent);
    
}
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Ajax /////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Handler /////////////////////////////////////
mtmStatBarChart.prototype.zoomed = function{
    
    this.gX.call(this.xAxis.scale(d3.event.transform.rescaleX(x)));
    var new_x = d3.event.transform.rescaleX(x);

    if(this.settings.detail.type == "line"){
        line.x(function(d) { return  new_x(new Date(d.DATA_DATE)); })
        d3.select("#canvas").selectAll("path.line")
                        .data(mainData)
                        .attr("d",function(d){
                            return line(d.data);
                        }); 
    } else if(settings.detail.type == "bar"){
        barWidth = new_x(new Date("2016-01-02")) - new_x(new Date("2016-01-01"));
        d3.select("#canvas").selectAll("rect.bar")
                            .data(mainData[0].data)    
                            .attr("x",function(d){return new_x(new Date(d.DATA_DATE))-barWidth*0.5;})
                            .attr("width",barWidth);
    }
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API /////////////////////////////////////
