'use strict';

describe("Graph", function () {

  it('add a line', function () {
    var graph = new Graph();

    graph.addLine([1, 1], 5);

    expect(graph.layers.length).toEqual(1);
    expect(graph.layers[0].type).toEqual('line');
    expect(graph.layers[0].normal).toEqual([1, 1]);
    expect(graph.layers[0].rhs).toEqual(5);
  });

  it('add a scatter plot', function () {
    var graph = new Graph();
    graph.addScatterPlot([[1, 1], [2, 2]]);

    expect(graph.layers.length).toEqual(1);
    expect(graph.layers[0].type).toEqual('scatter');
    expect(graph.layers[0].data).toEqual([[1, 1], [2, 2]]);
  });

  it('add a polygon', function () {
    var graph = new Graph();

    graph.addPolygon([[1, 1], [2, 2]]);

    expect(graph.layers.length).toEqual(1);
    expect(graph.layers[0].type).toEqual('polygon');
    expect(graph.layers[0].data).toEqual([[1, 1], [2, 2]]);
  });

  it('add multiple layers', function () {
    var graph = new Graph();

    graph.addPolygon([[1, 1], [2, 2]]);
    graph.addScatterPlot([[1, 1], [2, 2]]);

    expect(graph.layers.length).toEqual(2);
    expect(graph.layers[0].type).toEqual('polygon');
    expect(graph.layers[1].type).toEqual('scatter');
  });
});

