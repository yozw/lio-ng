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
    self.layers.push(new Graph.PolygonPlot(data));
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

  // TODO: move this to an angular directive
  this.toJqPlot = function () {
    var jqPlot = {};
    jqPlot.data = [];
    jqPlot.options = {
      sortData: false,
      highlighter: {
        show: true,
        sizeAdjust: 6
      },
      cursor: {
        show: true,
        zoom: true,
        tooltipLocation: 'sw'
      },
      series: [
        {
          showMarker: false,
          markerOptions: {size: 0, shadow: false},
          color: "#80A0FF",
          fill: true,
          fillColor: "rgba(128,128,255,0.2)",
          fillAndStroke: true,
          shadow: false}
      ]};

    for (var i = 0; i < self.layers.length; i++) {
      jqPlot.data.push(self.layers[i].data);
    }
    return jqPlot;
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

Graph.PolygonPlot = function (data) {
  var self = this;
  self.data = data;
  self.zIndex = 0;

  self.serialize = function () {
    return {type: 'polygon', data: self.data, zIndex: self.zIndex};
  };
};

