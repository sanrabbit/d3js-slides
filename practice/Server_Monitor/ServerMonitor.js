


var data = {
    "192.168.0.1": {
        "SeqID": "",
        "IP": "",
        "CreatedTime": "",
        "CPU": "",
        "Memory": "",
        "HardDisk": "",
        "NetWork": "",
        "Process": "",
        "Thread": ""
    },
    "192.168.0.2": {
        "SeqID": "",
        "IP": "",
        "CreatedTime": "",
        "CPU": "",
        "Memory": "",
        "HardDisk": "",
        "NetWork": "",
        "Process": "",
        "Thread": ""
    }
};


function View(param) {
    this.selection = param.selection;
    this.color = param.color;
    this.outerWidth = param.width;
    this.outerHeight = param.height;

    //this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
}

/*
* margin
*/
View.prototype.margin = { top: 20, right: 5, bottom: 20, left: 0 };
View.prototype.rectShapeRendering = 'crispEdges';

/*
* 初始化一些变量
*/
View.prototype.initParam = function () {
    // 宽高
    this.width = this.outerWidth - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top - this.margin.bottom;

    // x比例尺
    this.xScale = d3.scale.linear()
        .range([0, this.width])
        .domain([60, 1]);

    // y比例尺
    this.yScale = d3.scale.linear()
        .range([this.height, 0])
        .domain([0, 100]);

    // area函数，用于计算面积图的path
    this.area = d3.svg.area()
        .x(function (d, i, c) { return xScale(i); })
        .y0(this.height)
        .y1(function (d) { return yScale(d); });
};

/*
* 画SVG容器
*/
View.prototype.drawSVG = function () {
    // 主要容器
    this.svg = d3.select(this.selection)
        .attr('class', 'container')
      .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
};

/*
* 画文字
*/
View.prototype.drawText = function () {

    var text = this.svg.append("g")
    .attr("class", "y axis");

    text.append("text")
        .attr('class', 'grey1')
        //.attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", "-0.5em")
        //.style("text-anchor", "end")
        .text("% 利用率");

    text.append("text")
      .attr('class', 'grey1')
      //.attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", "-0.5em")
        .attr('x', this.width)
      .style("text-anchor", "end")
      .text("100%");

    text.append("text")
      .attr('class', 'grey1')
      //.attr("transform", "rotate(-90)")
      .attr("y", this.height)
      .attr("dy", "1.2em")
        .attr('x', 0)
      //.style("text-anchor", "end")
      .text("60秒");

    text.append("text")
      .attr('class', 'grey1')
      //.attr("transform", "rotate(-90)")
      .attr("y", this.height)
      .attr("dy", "1.2em")
        .attr('x', this.width)
      .style("text-anchor", "end")
      .text("0");
};

/*
* 画网格
*/
View.prototype.drawGrid = function () {

    var grid = this.svg.append('g');
    grid.selectAll('.gridline1').data([10, 20, 30, 40, 50, 60, 70, 80, 90])
        .enter()
        .append('line')
        .attr('class', 'gridline')
        .style('stroke', this.color.grid)
    .attr('x1', 0)
    .attr('y1', this.yScale)
    .attr('x2', this.width)
    .attr('y2', this.yScale)

    grid.selectAll('.gridline2').data(d3.range(3, 62, 3))
        .enter()
        .append('line')
        .attr('class', 'gridline')
                .style('stroke', this.color.grid)
    .attr('x1', this.xScale)
    .attr('y1', 0)
    .attr('x2', this.xScale)
    .attr('y2', this.height)
};

/*
* 画外框
*/
View.prototype.drawRect = function () {

    this.line = this.svg.append('g');

    // 矩形区域
    var rect = this.svg.append('g');


    // 外框
    rect.append('rect')
        .attr('class', 'rect')
        .style('stroke', this.color.rect)
        .style('shape-rendering', this.rectShapeRendering)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', this.width)
    .attr('height', this.height);

};

/*
* 总初始化
*/
View.prototype.init = function () {
    this.initParam();
    this.drawSVG();
    this.drawText();
    this.drawGrid();
    this.drawRect();

    return this;
};

View.prototype.redraw = function (cpu) {
    var xScale = this.xScale;
    //console.log(cpu);
    this.line.select('.line').remove();
    this.line.select('.area').remove();

    this.line.append('path').datum(cpu)
    .attr('class', 'line')
        .style('stroke', this.color.line)
    .attr('d', d3.svg.line()
            .x(function (d, i, c) { return xScale(cpu.length - i); })
            //.y0(height)
            .y(this.yScale)
    );

    this.line.append('path').datum(cpu)
        .attr('class', 'area')
        .style('fill', this.color.area)
        .attr('d', d3.svg.area()
                .x(function (d, i, c) { return xScale(cpu.length - i); })
                .y0(this.height)
                .y1(this.yScale)
        );
};


function ThumbView(param) {
    this.selection = param.selection;
    this.color = param.color;
    this.outerWidth = param.width;
    this.outerHeight = param.height;
}

ThumbView.prototype = new View({});
ThumbView.prototype.margin = { top: 0, right: 0, bottom: 0, left: 0 };
ThumbView.prototype.rectShapeRendering = 'initial';

ThumbView.prototype.init = function () {
    this.initParam();
    this.drawSVG();
    this.drawRect();

    return this;
};

var cpuView = new View({
    selection: '#cpu_view',
    width: 600,
    height: 300,
    color: {
        rect: 'rgb(17,125,187)', line: 'rgba(17,125,187, 1)', grid: 'rgb(217,234,244)', area: 'rgba(217,234,244, 0.4)'
    }
}).init();

var cpuThumbView = new ThumbView({
    selection: '#cpu_thumb_view',
    width: 60,
    height: 40,
    color: {
        rect: 'rgb(17,125,187)', line: 'rgba(17,125,187, 1)', grid: 'rgb(217,234,244)', area: 'rgba(217,234,244, 0.4)'
    }
}).init();

var memoryView = new View({
    selection: '#memory_view',
    width: 600,
    height: 300,
    color: {
        rect: 'rgb(139,18,174)', line: 'rgba(139,18,174, 1)', grid: 'rgb(236,222,240)', area: 'rgba(236,222,240, 0.4)'
    }
}).init();

var memoryThumbView = new ThumbView({
    selection: '#memory_thumb_view',
    width: 60,
    height: 40,
    color: {
        rect: 'rgb(139,18,174)', line: 'rgba(139,18,174, 1)', grid: 'rgb(236,222,240)', area: 'rgba(236,222,240, 0.4)'
    }
}).init();

var hdView = new View({
    selection: '#hd_view',
    width: 600,
    height: 300,
    color: {
        rect: 'rgb(77,166,12)', line: 'rgba(77,166,12, 1)', grid: 'rgb(219,237,206)', area: 'rgba(219,237,206, 0.4)'
    }
}).init();

var hdThumbView = new ThumbView({
    selection: '#hd_thumb_view',
    width: 60,
    height: 40,
    color: {
        rect: 'rgb(77,166,12)', line: 'rgba(77,166,12, 1)', grid: 'rgb(219,237,206)', area: 'rgba(219,237,206, 0.4)'
    }
}).init();

var networkView = new View({
    selection: '#network_view',
    width: 600,
    height: 300,
    color: {
        rect: 'rgb(167,79,1)', line: 'rgba(167,79,1, 1)', grid: 'rgb(238,222,207)', area: 'rgba(238,222,207, 0.4)'
    }
}).init();

var networkThumbView = new ThumbView({
    selection: '#network_thumb_view',
    width: 60,
    height: 40,
    color: {
        rect: 'rgb(167,79,1)', line: 'rgba(167,79,1, 1)', grid: 'rgb(238,222,207)', area: 'rgba(238,222,207, 0.4)'
    }
}).init();

var cpu = [0];
var memory = [0];
var hd = [0];
var network = [0];
var a = setInterval(tick, 1000);

function tick() {

    cpu.push(Math.floor(Math.random() * 100));
    if (cpu.length > 60) {
        cpu.shift();
    }

    memory.push(Math.floor(Math.random() * 100));
    if (memory.length > 60) {
        memory.shift();
    }

    hd.push(Math.floor(Math.random() * 100));
    if (hd.length > 60) {
        hd.shift();
    }

    network.push(Math.floor(Math.random() * 100));
    if (network.length > 60) {
        network.shift();
    }

    cpuView.redraw(cpu);
    cpuThumbView.redraw(cpu);
    memoryView.redraw(memory);
    memoryThumbView.redraw(memory);
    hdView.redraw(hd);
    hdThumbView.redraw(hd);
    networkView.redraw(network);
    networkThumbView.redraw(network);
}
