app.service('jqPlotRenderService', function () {
  "use strict";

   var defaultOptions = {
     title: '',
     axes: {
       xaxis: {min: 0, max: 1, label: ''},
       yaxis: {min: 0, max: 1, label: ''}
     },
     sortData: false,
     highlighter: {
       show: true,
       sizeAdjust: 6
     },
     cursor: {
       show: true,
       zoom: true,
       tooltipLocation: 'sw'
     }
  };
     
  var defaultSeriesOptions = {
    "polygon": {
      showMarker: false,
      markerOptions: {
        size: 0, 
        shadow: false
      },
      color: "#80A0FF",
      fill: true,
      fillColor: "rgba(128,128,255,0.2)",
      fillAndStroke: true,
      shadow: false 
    },
    "scatter": {
      showMarker: true,
      showLine: false,
      color: "#80A0FF"
    },
    "plot": {
      showMarker: false,
      showLine: true,
      lineWidth: 1,
      color: "#808080"
    },
    "line": {
      showMarker: false,
      showLine: true,
      lineWidth: 1,
      color: "#808080"
    }
  };
  
  function getSortedLayers(layers) {
    var i = 0;
    
    function toTriple(layer) {
      return {index: i++, zIndex: layer.zIndex, layer: layer};
    }
    
    function tripleComparator(item1, item2) {
      if (item1.zIndex !== item2.zIndex) {
        return item1.zIndex - item2.zIndex;
      } else {
        return item1.index - item2.index;
      }
    }
    
    function getLayer(item) {
      return item.layer;
    }
    
    return layers.map(toTriple).sort(tripleComparator).map(getLayer);
  }

  function getSeriesData(layer) {
    if (layer.type === "line") {
      return MathUtil.getLineEndpoints(layer.normal, layer.rhs, -10, 10, -10, 10);
    } else {
      return layer.data;
    }
  }
  
  function getSeriesOptions(layer) {
    return defaultSeriesOptions[layer.type];
  }

  return {
    render: function (graph) {
      var layers = getSortedLayers(graph.layers);
      var seriesData = [];
      var seriesOptions = [];

      for (var i = 0; i < layers.length; i++) {
        seriesData.push(getSeriesData(layers[i]));
        seriesOptions.push(getSeriesOptions(layers[i]));
      }

      var jqPlot = {};
      jqPlot.data = seriesData;
      jqPlot.options = jQuery.extend(true, {}, defaultOptions);

      jqPlot.options.title = graph.title;
      jqPlot.options.axes.xaxis.label = graph.xlabel;
      jqPlot.options.axes.yaxis.label = graph.ylabel;
      jqPlot.options.axes.xaxis.min = graph.xrange.min;
      jqPlot.options.axes.xaxis.max = graph.xrange.max;
      jqPlot.options.axes.yaxis.min = graph.yrange.min;
      jqPlot.options.axes.yaxis.max = graph.yrange.max;

      jqPlot.options.series = seriesOptions;
      return jqPlot;
    }
  };
});

