/*! g3 - v0.0.1 - 2015-10-01 - justinkheisler */
'use strict';
;(function (window) {

function defineg3() {
	var g3 = {};
	return g3;
}
if(typeof(g3) === 'undefined') {
	window.g3 = defineg3();
}

const DEBUG = false;

function createAxis(scale, innerTickSize, orient, ticks){
	return d3.svg.axis()
		.scale(scale)
		.innerTickSize(innerTickSize)
		.outerTickSize(3)
		.tickPadding(5)
		.orient(orient)
		.ticks(ticks);
}

// Attach canvas creation function to g3
g3.canvas = function(plot, data){
  return new canvas(plot, data);
}

// Constructor
// Only set variables that are set by items passed in, otherwise set using prototype
var canvas = function canvas(plot, data){
	if(!data || !$.isArray(data)){ return 'Param: data is missing, An array required'; }
	if(!plot){ return 'Param: plot is missing, a div to attach the svg is required'; }
  this._data = data;
  this._plot = plot;
  this._canvas = d3.select(this._plot.elem)
		.append('canvas')
    .attr('width', this._data.length)
    .attr('height', this._data[0].length)
    .style('width', this._plot.width +  'px')
    .style('height', this._plot.height + 'px')
    .style('opacity', 0.95)
    .style('top', this._plot.margin.top + 'px')
    .style('left', this._plot.margin.left + 'px');
  return this;
};

canvas.prototype.style = {};

canvas.prototype.style.opacity = function(opacity){
	this._style._opacity = opacity;
	this._canvas.style('opacity', opacity);
	return this;
};

canvas.prototype.gain = function(gain){
	this._gain = gain;
	return this;
};

canvas.prototype.colorScale = function(colorScale){
	this._colorScale = colorScale;
	return this;
};

canvas.prototype.draw = function(){
	this._context = this._canvas.node().getContext('2d');
	this.drawImage();
	return this;
};

canvas.prototype.reDraw = function(data){
	this._context.clearRect(0, 0, this._data.length, this._data[0].length);
	this._canvas
    .attr('width', data.length)
    .attr('height', data[0].length);
  this._data = data;
  this.drawImage();
  return this;
};

canvas.prototype.drawImage = function(){
	var x = this._data.length,
			y = this._data[0].length;
	this._image = this._context.createImageData(x,y);
	
	for(var i = 0, p = -1; i < y; ++ i){
		for(var j = 0; j < x; ++j){
			var c = d3.rgb(this._colorScale(this._data[j][i] * this._gain));
			this._image.data[++p] = c.r;
			this._image.data[++p] = c.g;
			this._image.data[++p] = c.b;
			this._image.data[++p] = 255;
		}
	}
	this._context.putImageData(this._image, 0, 0);

	return this;
};
// Attach horizon creation function to g3
g3.horizon = function(plot, data){
  return new horizon(plot, data);
};

// Constructor
// Only set variables that are set by items passed in, otherwise set using prototype
var horizon = function horizon(plot, data){
	if(!data || !$.isArray(data)){ return 'Param: data is missing, An array required'; }
	if(!plot){ return 'Param: plot is missing, a div to attach the svg is required'; }
  this._data = data;
  this._plot = plot;
  this._xMin = plot.xDomain[0];
  this._yMin = plot.yDomain[0];
  return this;
};

// Set remaining variables
horizon.prototype._xInt = 1;
horizon.prototype._yInt = 1;
horizon.prototype._duration = 500;
horizon.prototype._gain = 1;
horizon.prototype._interpolate = 'basis';
horizon.prototype._color = 'green';
horizon.prototype._strokeWidth = 1.5;

// Horizon Setting functions
horizon.prototype.interpolate = function(interpolate){
	this._interpolate = interpolate;
	return this;
};

horizon.prototype.xMin = function(xMin){
	this._xMin = xMin;
	return this;
};

horizon.prototype.yMin = function(yMin){
	this._yMin = yMin;
	return this;
};

horizon.prototype.xInt = function(xInt){
	this._xInt = xInt;
	return this;
};

horizon.prototype.yInt = function(yInt){
	this._yInt = yInt;
	return this;
};

horizon.prototype.duration = function(duration){
	this._duration = duration;
	return this;
};

horizon.prototype.gain = function(gain){
	this._gain = gain;
	return this;
};

horizon.prototype.color = function(color){
	this._color = color;
	return this;
};

horizon.prototype.strokeWidth = function(strokeWidth){
	this._strokeWidth = strokeWidth;
	return this;
};

horizon.prototype.lineFunc = function(){
	var plot = this._plot,
			xMin = this._xMin,
			gain = this._gain,
			interpolate = this._interpolate;

	var lineFunc = d3.svg.line()
		.x(function (d, i){
			return plot.xScale(i + xMin);
		})
		.y( function (d) {
			return plot.yScale(d * gain);
		})
		.interpolate(interpolate);

	return lineFunc;
};

// Horizon Drawing functions
horizon.prototype.draw = function() {
	var lineFunc = this.lineFunc();
	this._svg = this._plot.svg.append('path')
		.attr('d', lineFunc(this._data))
		.attr('stroke', this._color)
		.attr('stroke-width', this._strokeWidth)
		.attr('fill', 'none');

	return this;
};

horizon.prototype.reDraw = function(data){
	var lineFunc = this.lineFunc();
	
	this._svg.transition()
		.duration(this._duration)
		.attr('d', lineFunc(data));
	return this;
};

// Attach canvas creation function to g3
g3.log = function(plot, data){
  return new log(plot, data);
};

// Constructor
// Only set variables that are set by items passed in, otherwise set using prototype
var log = function log(plot, data){
	if(!data || !$.isArray(data)){ return 'Param: data is missing, An array required'; }
	if(!plot){ return 'Param: plot is missing, a div to attach the svg is required'; }
  this._data = data;
  this._plot = plot;
  this._xMin = plot.xDomain[0];
  this._yMin = plot.yDomain[0];
  return this;
};

// Set remaining variables
log.prototype._xInt = 1;
log.prototype._yInt = 1;
log.prototype._color = "blue";
log.prototype._duration = 5;
log.prototype._strokeWidth = 0.25;

// Setters 
log.prototype.duration = function(duration){
	this._duration = duration;
	return this;
};

log.prototype.xMin = function(xMin){
	this._xMin = xMin;
	return this;
};

log.prototype.xInt = function(xInt){
	this._xInt = xInt;
	return this;
};

log.prototype.yMin = function(yMin){
	this._yMin = yMin;
	return this;
};

log.prototype.yInt = function(yInt){
	this._yInt = yInt;
	return this;
};

log.prototype.color = function(color){
	this._color = color;
	return this;
};

log.prototype.strokeWidth = function(strokeWidth){
	this._strokeWidth = strokeWidth;
	return this;
};

log.prototype.draw = function(){
	var lineFunc = this.lineFunc();
	this._svg = this._plot.svg.append('path')
		.datum(this._data)
		.attr('d', lineFunc)
		.attr('stroke', this._color)
		.attr('stroke-width', this._strokeWidth)
		.attr('fill', 'none');
	return this;
};

log.prototype.reDraw = function(data){
	var lineFunc = this.lineFunc();
	this._svg.transition()
		.duration(this._duration)
		.attr('d', lineFunc(data))
		.ease('linear');
	return this;
};

log.prototype.lineFunc = function(){
	var plot = this._plot,
			yInt = this._yInt,
			yMin = this._yMin,
			interpolate = this._interpolate;

	return d3.svg.line()
		.x(function (d) {
			return plot.xScale(d);
		})
		.y(function (d, i){
			return plot.yScale(i * yInt + yMin);
		})
		.interpolate(interpolate);
};

// var sorted = data.sort(function(a, b) {
//   return a - b;
// });

// var focus = plot.svg.append("g")
//     .attr("class", "focus")
//     .style("display", "none");

// focus.append("circle")
//     .attr("r", 4.5);

// focus.append("text")
//     .attr("x", 9)
//     .attr("dy", ".35em");
//     var bisectDate = d3.bisector(function(d) { return d; }).left;
// plot.svg.append("rect")
//     .attr("class", "overlay")
//     .attr("width", plot.width)
//     .attr("height", plot.height)
//     .on("mouseover", function() { focus.style("display", null); })
//     .on("mouseout", function() { focus.style("display", "none"); })
//     .on("mousemove", mousemove);

// function mousemove() {
//   var x0 = plot.xScale.invert(d3.mouse(this)[0]),
//       i = bisectDate(data, x0, 1),
//       d0 = data[i - 1],
//       d1 = data[i],
//       d = x0 - d0 > d1 - x0 ? d1 : d0;
//   focus.attr("transform", "translate(" + plot.xScale(d) + "," + plot.yScale(d) + ")");
//   focus.select("text").text(d);
// };

g3.plot = function(elem){
  
  if(!elem){ return 'Param: elem is missing. A div to attach to is required'; }

	var plot = {};
	plot.margin = {top: 50, right: 0, bottom: 30, left: 0};
	plot.width = $(elem).width() - plot.margin.left;
	plot.height = 800;
	plot.xDomain = [0,0];
	plot.yDomain = [0,0];
	plot.elem = elem;
	plot.xAxisVisible = true;
	plot.yAxisVisible = true;
	plot.x2AxisVisible = false;
	plot.y2AxisVisible = false;
	plot.xOrient = 'top';
	plot.x2Orient = 'bottom';
	plot.yOrient = 'left';
	plot.y2Orient = 'right';
  plot.duration = 500;

  plot.setDuration = function(duration){
    this.duration = duration;
    return this;
  };

  plot.setMargin = function(top, right, bottom, left){
  	this.margin = {top: top, right: right, bottom: bottom, left: left};
  	return this;
  };

  plot.setWidth = function(width){
  	this.width = width;
  	return this;
  };

  plot.setHeight = function(height){
  	this.height = height;
  	return this;
  };

  plot.setXDomain = function(domain){
  	this.xDomain = domain;
  	return this;
  };

  plot.setYDomain = function(domain){
  	this.yDomain = domain;
  	return this;
  };

  plot.setX2Domain = function(domain){
  	this.x2Domain = domain;
  	return this;
  };

  plot.setY2Domain = function(domain){
  	this.y2Domain = domain;
  	return this;
  };

  plot.toggleXAxis = function(bool){
  	this.xAxisVisible = bool;
  	return this;
  };

  plot.toggleX2Axis = function(bool){
  	this.x2AxisVisible = bool;
  	return this;
  };

  plot.toggleYAxis = function(bool){
  	this.yAxisVisible = bool;
  	return this;
  };

  plot.toggleY2Axis = function(bool){
  	this.y2AxisVisible = bool;
  	return this;
  };

  plot.setXTicks = function(ticks){
  	this.xTicks = ticks;
  	return this;
  };

  plot.setYTicks = function(ticks){
  	this.yTicks = ticks;
  	return this;
  };

  plot.setX2Ticks = function(ticks){
  	this.x2Ticks = ticks;
  	return this;
  };

  plot.setY2Ticks = function(ticks){
  	this.y2Ticks = ticks;
  	return this;
  };

  plot.setYTitle = function(title){
  	this.yTitle = title;
  	return this;
  };

  plot.setXTitle = function(title){
  	this.xTitle = title;
  	return this;
  };

  plot.setY2Title = function(title){
  	this.y2Title = title;
  	return this;
  };

  plot.setX2Title = function(title){
  	this.x2Title = title;
  	return this;
  };

  plot.setXOrient = function(orient){
  	this.xOrient = orient;
  	return this;
  };

  plot.setX2Orient = function(orient){
  	this.x2Orient = orient;
  	return this;
  };

  plot.setYOrient = function(orient){
  	this.yOrient = orient;
  	return this;
  };

  plot.sety2Orient = function(orient){
  	this.y2Orient = orient;
  	return this;
  };

  plot.setXTickFormat = function(format){
  	this.xTickFormat = format;
  	return this;
  };
  
  plot.setYTickFormat = function(format){
  	this.yTickFormat = format;
  	return this;
  };
  
  plot.setX2TickFormat = function(format){
  	this.x2TickFormat = format;
  	return this;
  };

  plot.setY2TickFormat = function(format){
  	this.y2TickFormat = format;
  	return this;
  };

  plot.draw = function() {
	  this.xScale = d3.scale.linear()
    	.domain(this.xDomain)
    	.range([0, this.width]);
    this.yScale = d3.scale.linear()
    	.domain(this.yDomain)
    	.range([0, this.height]);

    var innerWidth = this.width - this.margin.left - this.margin.right,
    innerHeight = this.height - this.margin.top - this.margin.bottom;

	  // Append svg object to dom element
	  this.svg = d3.select(elem).append('svg')
	    .attr('class', 'log_plot')
	    .attr('width', this.width + this.margin.right + this.margin.left)
	    .attr('height', this.height + this.margin.bottom + this.margin.top) 
	    .append('g')
	    .attr('height', this.height)
	    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

	  // Set axis
	  if(this.xAxisVisible){
	  	this.xAxis = createAxis(this.xScale, -this.height, this.xOrient, this.xTicks);
	  	this.xAxis.tickFormat(this.xTickFormat);
	  	this.svg.append('g')
	    	.attr('class', 'x axis')
	    	.call(this.xAxis);
	  }
	  if(this.yAxisVisible){
	  	this.yAxis = createAxis(this.yScale, -this.width, this.yOrient, this.yTicks);
	  	this.yAxis.tickFormat(this.yTickFormat);
	  	this.svg.append('g')
		    .attr('class', 'y axis')
		    .call(this.yAxis);
	  }
	  if(this.x2AxisVisible){
	  	this.x2Scale = d3.scale.linear()
	    	.domain(this.x2Domain)
	    	.range([0, this.width]);
	  	this.x2Axis = createAxis(this.x2Scale, -this.height, this.x2Orient, this.x2Ticks);
	  	this.x2Axis.tickFormat(this.x2TickFormat);
	  	this.svg.append('g')
	    	.attr('class', 'x2 axis')
		    .attr("transform", "translate(" + "0," + this.height + ")")
	    	.call(this.x2Axis);
	  }
	 	if(this.y2AxisVisible){
	 		this.y2Scale = d3.scale.linear()
	    	.domain(this.y2Domain)
	    	.range([0, this.height]);
	  	this.y2Axis = createAxis(this.y2Scale, -this.width, this.y2Orient, this.y2Ticks);
	  	this.y2Axis.tickFormat(this.y2TickFormat);
	  	this.svg.append('g')
		    .attr('class', 'y2 axis')
		    .attr("transform", "translate(" + this.width + ",0)")
		    .call(this.y2Axis);
	  }

    if(this.xTitle){
      
      if(this.xTickFormat === ""){
        var margin = -10;
      } else {
        var margin = -30;
      }
      this.svg.append("text")
          .attr("x", (this.width) / 2)
          .attr("y", margin)
          .style("text-anchor", "middle")
          .style("font-size", 12)
          .text(this.xTitle);
    }
    if(this.yTitle){

      if(this.yTickFormat === ""){
        var yMargin = -10;
      } else {
        var yMargin = -40;
      }

      this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", yMargin)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .style("font-size", 12)
        .text(this.yTitle);
    }
    if(this.x2Title){
      
      if(this.x2TickFormat === ""){
        var margin = 10;
      } else {
        var margin = 30;
      }
      this.svg.append("text")
          .attr("transform", "translate(" + "0," + this.height + ")")
        .attr("x", (this.width) / 2)
          .attr("y", margin)
          .style("text-anchor", "middle")
          .style("font-size", 12)
          .text(this.x2Title);
    }
    if(this.y2Title){

      if(this.yTickFormat === ""){
        var yMargin = -10;
      } else {
        var yMargin = -40;
      }

      this.svg.append("text")
        .attr("transform", "translate(" + "0," + this.height + ")")
        .attr("y", yMargin)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .style("font-size", 12)
        .text(this.y2Title);
    }
	  return this;
	};

  plot.reDraw = function(xDomain, yDomain, x2Domain, y2Domain){    
    if(xDomain){
      this.xScale.domain(xDomain);
      this.svg.select('.x.axis')
        .transition()
        .duration(this.duration)
        .call(this.xAxis)
        .ease('linear');
    }

    if(yDomain){
      this.yScale.domain(yDomain);
      this.svg.select('.y.axis')
        .transition()
        .duration(this.duration)
        .call(this.yAxis)
        .ease('linear');
    }

    if(x2Domain){
      this.x2Scale.domain(x2Domain);
      this.svg.select('.x2.axis')
        .transition()
        .duration(this.duration)
        .call(this.x2Axis)
        .ease('linear');
    }

    if(y2Domain){
      this.y2Scale.domain(y2Domain);
      this.svg.select('.y2.axis')
        .transition()
        .duration(this.duration)
        .call(this.y2Axis)
        .ease('linear');
    }
  };

	return plot;
}

// Attach seismic creation function to g3
g3.seismic = function(plot, data){
  return new seismic(plot, data);
};

// Constructor
// Only set variables that are set by items passed in, otherwise set using prototype
var seismic = function seismic(plot, data){
	if(!data || !$.isArray(data)){ return 'Param: data is missing, An array required'; }
	if(!plot){ return 'Param: plot is missing, a div to attach the svg is required'; }
  this._data = data;
  this._plot = plot;
  return this;
};

// Set remaining variables
seismic.prototype._max = 1;
seismic.prototype._gain = 1;
seismic.prototype._duration = 5;

// Default Color Scale
if(seismic._colorScale === undefined){
	seismic.prototype._colorScale = function(){
		return d3.scale.linear()
			.domain([-this._max, 0, this._max])
			.range(['#FF0000', '#FFFFFF', '#0000FF']);
	};
}

// Setters
seismic.prototype.colorScale = function(colorScale){
	this._colorScale = colorScale;
	return this;
};

seismic.prototype.duration = function(duration){
	this._duration = duration;
	return this;
};

seismic.prototype.gain = function(gain){
	this._gain = gain;
	return this;
};

seismic.prototype.max = function(max){
	this._max = max;
	return this;
};

// Draw method
seismic.prototype.draw = function(){
	this._canvas = g3.canvas(this._plot, this._data)
		.gain(this._gain)
		.colorScale(this._colorScale)
		.draw();
  return this;
};

seismic.prototype.reDraw = function(data){
	this._canvas.reDraw(data);
};

// Attach horizon creation function to g3
g3.wiggle = function(plot, data){
  return new wiggle(plot, data);
};

// Constructor
// Only set variables that are set by items passed in, otherwise set using prototype
var wiggle = function wiggle(plot, data){
	if(!data || !$.isArray(data)){ return 'Param: data is missing, An array required'; }
	if(!plot){ return 'Param: plot is missing, a div to attach the svg is required'; }
  this._data = data;
  this._plot = plot;
  this._xMin = plot.xDomain[0];
  this._yMin = plot.yDomain[0];
  this._rand = Math.floor((Math.random() * 100) + 100);
  return this;
};

// Set defaults
wiggle.prototype._skip = 0;
wiggle.prototype._gain = 30;
wiggle.prototype._xInt = 1;
wiggle.prototype._yInt = 1;
wiggle.prototype._duration = 5;
wiggle.prototype._sampleRate = 1;
wiggle.prototype._strokeWidth = 0.5;
wiggle.prototype._color = 'black';
wiggle.prototype._fillColor = 'black';
wiggle.prototype._opacity = 0.4;

//var s = wiggle.gain / wiggle.max;

wiggle.prototype.skip = function(skip){
	this._skip = skip;
	return this;
};

wiggle.prototype.gain = function(gain){
	this._gain = gain;
	return this;
};

wiggle.prototype.max = function(max){
	this._max = max;
	return this;
};

wiggle.prototype.xMin = function(xMin){
	this._xMin = xMin;
	return this;
};

wiggle.prototype.yMin = function(yMin){
	this._yMin = yMin;
	return this;
};

wiggle.prototype.xInt = function(xInt){
	this._xInt = xInt;
	return this;
};

wiggle.prototype.yInt = function(yInt){
	this._yInt = yInt;
	return this;
};

wiggle.prototype.fillColor = function(color){
	this._fillColor = color;
	return this;
};

wiggle.prototype.color = function(color){
	this._color = color;
	return this;
};

wiggle.prototype.strokeWidth = function(strokeWidth){
	this._strokeWidth = strokeWidth;
	return this;
};

wiggle.prototype.sampleRate = function(sampleRate){
	this._sampleRate = sampleRate;
	return this;
};

wiggle.prototype.duration = function(duration){
	this._duration = duration;
	return this;
};

wiggle.prototype.opacity = function(opacity){
	this._opacity = opacity;
	return this;
};

wiggle.prototype.lineFunc = function(k){
	var plot = this._plot,
			gain = this._gain,
			xMin = this._xMin,
			sampleRate = this._sampleRate,
			yInt = this._yInt,
			yMin = this._yMin;

	return d3.svg.area()
    .x(function (d) {
      return plot.xScale(d * gain + xMin + k * sampleRate);
    })
    .y(function (d, i){
      return plot.yScale(i * yInt + yMin);
    })
   	.interpolate('basis');
};

wiggle.prototype.areaFunc = function(k, mean){
	var plot = this._plot,
			gain = this._gain,
			xMin = this._xMin,
			sampleRate = this._sampleRate,
			yMin = this._yMin,
			yInt = this._yInt;

	return d3.svg.area()
	  .x(function (d, i) {
	    return plot.xScale(mean * gain + xMin + k * sampleRate);
	  })
	  .y(function (d, i){
	    return plot.yScale(i * yInt + yMin);
	  })
	 	.interpolate('basis');
};

wiggle.prototype.draw = function() {
	for(var k = this._data.length - 1; k >= 0; k--){
    if(this._skip === 0 || k % this._skip === 0){
      var mean = d3.mean(this._data[k]); 

      // Line function
	    var line = this.lineFunc(k);
	    var area = this.areaFunc(k, mean);

      this._plot.svg.datum(this._data[k]);

      this._plot.svg.append('clipPath')
        .attr('id', 'clip-below' + this._rand + k)
        .append('path')
        .attr('d', area.x0(this._plot.width));

      var plot = this._plot,
      		gain = this._gain,
      		xMin = this._xMin,
      		sampleRate = this._sampleRate;

      this._plot.svg.append('path')
        .attr('id', 'area-below' + k)
        .attr('clip-path', 'url(#clip-below' + this._rand + k)
        .attr('fill', this._fillColor)
        .style('opacity', this._opacity)
        .attr('d', area.x0(function (d, i){ 
          return plot.xScale(d * gain + xMin + k * sampleRate);
        }));

      this._plot.svg.append('path')
        .attr('class', 'line' + k)
        .attr('d', line(this._data[k]))
        .attr('stroke', this._color)
        .attr('stroke-width', this._strokeWidth)
        .attr('fill', 'none');
    }
  }
  return this;
};

wiggle.prototype.reDraw = function(data, xDomain, yDomain){

	// Redraw the Axis
	this._plot.xScale.domain(xDomain);
	this._plot.yScale.domain(yDomain);
		
	this._plot.svg.select('.x.axis')
		.transition()
		.duration(this._duration)
		.call(this._plot.xAxis)
		.selectAll("text")  
		.style("text-anchor", "start")
    	.attr("transform", "rotate(-45)" );

	this._plot.svg.select('.y.axis')
		.transition()
		.duration(this._duration)
		.call(this._plot.yAxis);

  for(var k = data.length - 1; k >= 0; k--){
    if(this._skip === 0 || k % this._skip === 0){
			var mean = d3.mean(data[k]); 
      
      this._plot.svg.select("#clip-below" + this._rand + k)
        .remove()

      var line = this.lineFunc(k);
      var area = this.areaFunc(k, mean);

      this._plot.svg.select(".line" + k)
        .transition()
        .duration(this._duration)
        .attr('d', line(data[k]))
        .ease("linear");

      this._plot.svg.datum(data[k]);

      this._plot.svg.append('clipPath')
        .attr('id', 'clip-below' + this._rand + k)
        .append('path')
        .attr('d', area.x0(this._plot.width));
        
      var plot = this._plot,
      		gain = this._gain,
      		xMin = this._xMin,
      		sampleRate = this._sampleRate;

      this._plot.svg.select("#area-below" + k)
        .attr('clip-path', 'url(#clip-below' + this._rand + k)
        .transition()
        .duration(this._duration)
        .attr('d', area.x0(function (d, i){ 
          return plot.xScale(d * gain + xMin + k * sampleRate);
        }))
        .ease('linear');
    	} 
		}
  return this;
};
} (window));
