"use strict";

var Graph = function () {

  var self = this;
  this.title = "";
  this.xlabel = "x";
  this.ylabel = "y";
  this.layers = [];
  this.xrange = {min: 0, max: 10};
  this.yrange = {min: 0, max: 10};

  this.setXRange = function(minX, maxX) {
    self.xrange = {min: minX, max: maxX};
  };

  this.setYRange = function(minY, maxY) {
    self.yrange =  {min: minY, max: maxY};
  };

  this.addScatterPlot = function (data, options) {
    var layer = {
      type: 'scatter',
      data: data,
      options: extend({zIndex: 0}, options)
    };
    self.layers.push(layer);
  };

  this.addPolygon = function (data, options) {
    var layer = {
      type: 'polygon',
      data: data,
      options: extend({zIndex: 0}, options)
    };
    self.layers.push(layer);
  };

  this.addLinePlot = function (data, options) {
    var layer = {
      type: 'plot',
      data: data,
      options: extend({zIndex: 0}, options)
    };
    self.layers.push(layer);
  };

  this.addLine = function (normal, rhs, options) {
    var layer = {
      type: 'line',
      normal: normal,
      rhs: rhs,
      options: extend({zIndex: 0}, options)
    };
    self.layers.push(layer);
  };

  this.setXlabel = function (label) {
    self.xlabel = label;
  };

  this.setYlabel = function (label) {
    self.ylabel = label;
  };

  this.setTitle = function (title) {
    self.title = title;
  };

  this.serialize = function () {
    var i;
    var object = {};
    object.xlabel = self.xlabel;
    object.ylabel = self.ylabel;
    object.title = self.title;
    object.xrange = self.xrange;
    object.yrange = self.yrange;
    object.layers = [];
    for (i = 0; i < self.layers.length; i++) {
      object.layers.push(self.layers[i]);
    }
    return object;
  };

};
