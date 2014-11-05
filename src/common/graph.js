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

  this.addScatterPlot = function (data) {
    self.layers.push({
      type: 'scatter',
      data: data,
      zIndex: 0
    });
  };

  this.addPolygon = function (data) {
    self.layers.push({
      type: 'polygon',
      data: data,
      zIndex: 0
    });
  };

  this.addLinePlot = function (data) {
    self.layers.push({
      type: 'plot',
      data: data,
      zIndex: 0
    });
  };

  this.addLine = function (normal, rhs) {
    self.layers.push({
      type: 'line',
      normal: normal,
      rhs: rhs,
      zIndex: 0
    });
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
