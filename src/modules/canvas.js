
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