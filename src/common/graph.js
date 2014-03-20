"use strict";

// TODO: implement serialization/deserialization
// TODO: Write unit tests
var Graph = function () {

  var self = this;
  this.layers = [];

  this.addScatterPlot = function (data) {
    self.layers.push(new Graph.ScatterPlot(data));
  };

  this.addPolygon = function (data) {
    self.layers.push(new Graph.Polygon(data));
  };
  
  this.addLine = function (normal, rhs) {
    self.layers.push(new Graph.Line(normal, rhs));    
  };

  this.serialize = function () {
    var i;
    var object = {};
    object.layers = [];
    for (i = 0; i < self.layers.length; i++) {
      object.layers.push(self.layers[i].serialize());
    }
    return object;
  };

};

Graph.ScatterPlot = function (data) {
  var self = this;
  self.data = data;
  self.zIndex = 0;

  self.serialize = function () {
    return {type: 'scatter', data: self.data, zIndex: self.zIndex};
  };
};

Graph.Polygon = function (data) {
  var self = this;
  self.data = data;
  self.zIndex = 0;

  self.serialize = function () {
    return {type: 'polygon', data: self.data, zIndex: self.zIndex};
  };
};

Graph.Line = function (normal, rhs) {
  var self = this;
  self.normal = normal;
  self.rhs = rhs;
  self.zIndex = 0;

  self.serialize = function () {
    return {type: 'line', normal: self.normal, rhs: self.rhs, zIndex: self.zIndex};
  };
};

