'use strict';

describe("jqPlotRenderService", function () {

  var renderService;

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    renderService = $injector.get('jqPlotRenderService');
  });

  it('successfully turns a Line into a jqPlot options object',
      function () {
        var graph = new Graph();
        graph.addLine([1, 1], 5);
        renderService.render(graph);
      });

  it('successfully turns a ScatterPlot into a jqPlot options object',
      function () {
        var graph = new Graph();
        graph.addScatterPlot([[1, 1], [2, 2]]);
        renderService.render(graph);
      });

  it('successfully turns a Polygon into a jqPlot options object',
      function () {
        var graph = new Graph();
        graph.addPolygon([[1, 1], [2, 2]]);
        renderService.render(graph);
      });

});
