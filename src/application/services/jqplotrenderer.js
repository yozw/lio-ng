app.service('jqPlotRenderService', function () {
  "use strict";

   var defaultOptions = {
     title: '',
     width: '400px',
     height: '400px',
     axes: {
       xaxis: {min: 0, max: 1, label: ''},
       yaxis: {min: 0, max: 1, label: ''}
     },
     sortData: false,
     highlighter: {
       show: true,
       sizeAdjust: 6,
       useAxesFormatters: false,
       tooltipFormatString: "%.4f"
     },
     cursor: {
       show: true,
       zoom: true,
       tooltipLocation: 'sw'
     },
     grid: {
       renderer: $.jqplot.CustomCanvasGridRenderer,
       borderColor: '#404040',
       shadow: false,
       drawBorder: true
     }
  };
     
  var defaultSeriesOptions = {
    polygon: {
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
    scatter: {
      showMarker: true,
      showLine: false,
      color: "#80A0FF"
    },
    plot: {
      showMarker: false,
      showLine: true,
      lineWidth: 2,
      color: "#428bca"
    },
    line: {
      showMarker: false,
      showLine: true,
      lineWidth: 1,
      color: "#808080"
    },
    "section-label": {
      showLine: false,
      showMarker: false,
      pointLabels: {
        show: true,
        location: 'e'
      }
    }
  };
  
  function getSortedLayers(layers) {
    var i = 0;
    
    function toTriple(layer) {
      return {index: i++, zIndex: layer.options.zIndex, layer: layer};
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

  function getSeriesData(layer, graph) {
    if (layer.type === "line") {
      return MathUtil.getLineEndpoints(
          layer.normal,
          layer.rhs,
          graph.xrange.min,
          graph.xrange.max,
          graph.yrange.min,
          graph.yrange.max);
    } else if (layer.type === "section-label") {
      return [
        [layer.x, (graph.yrange.min + graph.yrange.max) / 2, layer.label]
      ];
    } else {
      return layer.data;
    }
  }
  
  function getSeriesOptions(layer) {
    // Make a deep copy of the default options
    var options = jQuery.extend(true, {}, defaultSeriesOptions[layer.type]);
    if (layer.options !== undefined) {
      options = jQuery.extend(true, options, layer.options);
    }
    return options;
  }

  return {
    render: function (graph) {
      var layers = getSortedLayers(graph.layers);
      var seriesData = [];
      var seriesOptions = [];

      var xSpacing = MathUtil.niceSpacing(graph.xrange.min, graph.xrange.max, 5);
      var ySpacing = MathUtil.niceSpacing(graph.yrange.min, graph.yrange.max, 7);
      graph.xrange.min = xSpacing.min;
      graph.xrange.max = xSpacing.max;
      graph.yrange.min = ySpacing.min;
      graph.yrange.max = ySpacing.max;


      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var data = getSeriesData(layer, graph);
        var options = getSeriesOptions(layers[i]);

        // Bug in jqPlot: a polygon with two points might be filled incorrectly.
        if ((layer.type === "polygon") && (layer.data.length <= 2)) {
          options.fill = false;
        }
        seriesData.push(data);
        seriesOptions.push(options);
      }

      var jqPlot = {};
      jqPlot.data = seriesData;
      jqPlot.options = jQuery.extend(true, {}, defaultOptions);

      jqPlot.options.title = graph.title;
      jqPlot.options.axes.xaxis.label = graph.xlabel;
      jqPlot.options.axes.yaxis.label = graph.ylabel;

      jqPlot.options.axes.xaxis.min = graph.xrange.min;
      jqPlot.options.axes.xaxis.max = graph.xrange.max;
      jqPlot.options.axes.xaxis.tickInterval = xSpacing.stepSize;

      jqPlot.options.axes.yaxis.min = graph.yrange.min;
      jqPlot.options.axes.yaxis.max = graph.yrange.max;
      jqPlot.options.axes.yaxis.tickInterval = ySpacing.stepSize;

      jqPlot.options.series = seriesOptions;

      return jqPlot;
    }
  };
});
