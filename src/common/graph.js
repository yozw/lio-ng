"use strict";

// TODO: implement serialization/deserialization
var Graph = function () {

  var self = this;
  this.layers = [];

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
  
  this.addLine = function (normal, rhs) {
    self.layers.push({
      type: 'line',
      normal: normal,
      rhs: rhs,
      zIndex: 0
    });
  };

  this.serialize = function () {
    var i;
    var object = {};
    object.layers = [];
    for (i = 0; i < self.layers.length; i++) {
      object.layers.push(self.layers[i]);
    }
    return object;
  };

};
