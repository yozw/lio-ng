"use strict";

var Graph = function () {

  var self = this;
  this.layers = layers;

  /** Layer class **/
  var ScatterPlot = function(data) {
    var self = this;
    self.data = data;
    self.zIndex = 0;

    self.serialize = function() {
      return {type: 'scatter', data: self.data, zIndex: self.zIndex};
    };
  };

  this.addScatterPlot = function(data) {
    self.layers.push(new ScatterPlot(data));
  };

  this.serialize = function() {
    var i;
    var object = {};
    object.layers = [];
    for (i = 0; i < self.layers.length; i++) {
      object.layers.push(self.layers[i].serialize());
    }
    return object;
  }

};

