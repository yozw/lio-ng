app.service('jqPlotRenderService', function () {
  "use strict";

   var defaultOptions = {
     title: 'Feasible region',
     axes: {
       xaxis: {min: -1, max: 10, label: 'x1'},
       yaxis: {min: -1, max: 10, label: 'x2'},
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
  
  function getLineData(normal, rhs) {
    var minX = -10, maxX = 10, minY = -10, maxY = 10;
    var a = normal[0], b = normal[1], c = rhs;
    
    var x1, y1, x2, y2;
    
    // solve equation ax + by = c, staying inside the bounds 
    // set by minX, maxX, minY, maxY
    if (b === 0) {
      return [ [c / a, minY], [c / a, maxY] ];
    } else if (a === 0) {
      return [ [minX, c / b], [maxX, c / b] ];
    } 
    
    x1 = minX;
    x2 = maxX;
    y1 = (c - a * x1) / b;
    y2 = (c - a * x2) / b;
    if (y1 > maxY) {
      y1 = maxY;
      x1 = (c - b * y1) / a;
    } else if (y1 < minY) {
      y1 = minY;
      x1 = (c - b * y1) / a;
    }
    
    if (y2 > maxY) {
      y2 = maxY;
      x2 = (c - b * y2) / a;
    } else if (y2 < minY) {
      y2 = minY;
      x2 = (c - b * y2) / a;
    }
    return [ [x1, y1], [x2, y2] ];
  }
     
  function getSeriesData(layer) {
    console.log(JSON.stringify(layer));
    if (layer.type === "line") {
      return getLineData(layer.normal, layer.rhs);
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
      jqPlot.options.series = seriesOptions;
      
      console.log(JSON.stringify(jqPlot));
      return jqPlot;
    }
  };
});

