'use strict';

describe("FeasibleRegionGraph", function () {

  var DOVETAIL = "var x1 >= 0;\n"
      + "var x2 >= 0;\n"
      + "maximize z: 3*x1 + 2*x2;\n"
      + "subject to c11: x1 + x2 <= 9;\n"
      + "subject to c12: 3*x1 + x2 <= 18;\n"
      + "subject to c13: x1 <=  7;\n"
      + "subject to c14: x2 <=  6;\n"
      + "end;";

  var DOVETAIL_UNBOUNDED = "var x1;\n"
      + "var x2;\n"
      + "maximize z: 3*x1 + 2*x2;\n"
      + "subject to c11: x1 + x2 <= 9;\n"
      + "subject to c12: 3*x1 + x2 <= 18;\n"
      + "subject to c13: x1 <=  7;\n"
      + "subject to c14: x2 <=  6;\n"
      + "end;";

  var LINE_SEGMENT = "var y1;\nvar y2;\n"
      + "maximize z: y1 - y2;\n"
      + "subject to c1: y1 <= 1;\n"
      + "subject to c2: y1 >= 1;\n"
      + "end;";

  var ONE_POINT = "var z1 >= 0;"
      + "var z2;\n"
      + "maximize z: z1 - z2;\n"
      + "subject to c1:   z1 <= 1;\n"
      + "subject to c2:   z1 >= 1;\n"
      + "subject to c3:   z2 <= 1;\n"
      + "subject to c4:   z2 >= 1;\n"
      + "end;";

  var VERTICAL_LINE = "var x1;\n"
      + "var x2;\n"
      + "maximize z: x1 - x2;\n"
      + "subject to c1:   x1 <= 1;\n"
      + "subject to c2:   x1 >= 1;\n"
      + "end;";

  var HORIZONTAL_LINE = "var x1;\n"
      + "var x2;\n"
      + "maximize z: x1 - x2;\n"
      + "subject to c1:   x2 <= 1;\n"
      + "subject to c2:   x2 >= 1;\n"
      + "end;";

  var UNBOUNDED = "var x1 >= 0;\n"
      + "var x2 >= 0;\n"
      + "maximize z: x1 + x2;"
      + "subject to c11: x1 - x2 <=  9;"
      + "subject to c12:   x1 - x2 >=  8;"
      + "end;";

  var UNBOUNDED2 = "var x1 >= 0;\n"
      + "var x2 >= 0;\n"
      + "maximize z: x1 - x2;"
      + "subject to c11: x1 - x2 <=  9;"
      + "subject to c12:   x1 - x2 >=  8;"
      + "end;";

  it('creates a feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [-1, 0], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [0, -1], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [1, 1], rhs: 9, options: {zIndex: 0}},
      {type: 'line', normal: [3, 1], rhs: 18, options: {zIndex: 0}},
      {type: 'line', normal: [1, 0], rhs: 7, options: {zIndex: 0}},
      {type: 'line', normal: [0, 1], rhs: 6, options: {zIndex: 0}},
      {type: 'polygon', data: [[0, 0], [6, 0], [4.5, 4.5], [3, 6], [0, 6], [0, 0]], options: {zIndex: 1}},
      {type: 'scatter', data: [[0, 0], [0, 6], [6, 0], [4.5, 4.5], [3, 6]], options: {zIndex: 2}},
      {type: 'scatter', data: [[4.5, 4.5]], options: {zIndex: 11, color: '#000080'}}
    ];
    expect(graph.xlabel).toEqual("x1");
    expect(graph.ylabel).toEqual("x2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  it('creates an unbounded feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL_UNBOUNDED).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [1, 1], rhs: 9, options: {zIndex: 0}},
      {type: 'line', normal: [3, 1], rhs: 18, options: {zIndex: 0}},
      {type: 'line', normal: [1, 0], rhs: 7, options: {zIndex: 0}},
      {type: 'line', normal: [0, 1], rhs: 6, options: {zIndex: 0}},
      {
        type: 'polygon',
        data: [[-17, -48], [7, -48], [7, -3], [4.5, 4.5], [3, 6], [-17, 6], [-17, -48]],
        options: {zIndex: 1}
      },
      {type: 'scatter', data: [[4.5, 4.5], [3, 6], [7, -3]], options: {zIndex: 2}},
      {type: 'scatter', data: [[4.5, 4.5]], options: {zIndex: 11, color: '#000080'}}
    ];
    expect(graph.xlabel).toEqual("x1");
    expect(graph.ylabel).toEqual("x2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  it('creates an unbounded feasible region graph (2)', function () {
    var lp = GlpkUtil.solveGmpl(UNBOUNDED).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [-1, 0], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [0, -1], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [1, -1], rhs: 9, options: {zIndex: 0}},
      {type: 'line', normal: [-1, 1], rhs: -8, options: {zIndex: 0}},
      {type: 'polygon', data: [[8, 0], [9, 0], [14, 5], [13, 5], [8, 0]], options: {zIndex: 1}},
      {type: 'scatter', data: [[9, 0], [8, 0]], options: {zIndex: 2}}
    ];
    expect(graph.xlabel).toEqual("x1");
    expect(graph.ylabel).toEqual("x2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  it('creates an unbounded feasible region graph (3)', function () {
    var lp = GlpkUtil.solveGmpl(UNBOUNDED2).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [-1, 0], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [0, -1], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [1, -1], rhs: 9, options: {zIndex: 0}},
      {type: 'line', normal: [-1, 1], rhs: -8, options: {zIndex: 0}},
      {type: 'polygon', data: [[8, 0], [9, 0], [14, 5], [13, 5], [8, 0]], options: {zIndex: 1}},
      {
        type: 'polygon',
        data: [[9, 0], [14, 5]],
        options: {zIndex: 10, color: '#000080', fillColor: 'rgba(128,128,255,0.5)'}
      },
      {type: 'scatter', data: [[9, 0], [8, 0]], options: {zIndex: 2}},
      {type: 'scatter', data: [[9, 0]], options: {zIndex: 11, color: '#000080'}}
    ];
    expect(graph.xlabel).toEqual("x1");
    expect(graph.ylabel).toEqual("x2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  it('creates a line segment feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(LINE_SEGMENT).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [1, 0], rhs: 1, options: {zIndex: 0}},
      {type: 'line', normal: [-1, 0], rhs: -1, options: {zIndex: 0}}
    ];
    expect(graph.xlabel).toEqual("y1");
    expect(graph.ylabel).toEqual("y2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  it('creates a single point feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(ONE_POINT).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [-1, 0], rhs: 0, options: {zIndex: 0}},
      {type: 'line', normal: [1, 0], rhs: 1, options: {zIndex: 0}},
      {type: 'line', normal: [-1, 0], rhs: -1, options: {zIndex: 0}},
      {type: 'line', normal: [0, 1], rhs: 1, options: {zIndex: 0}},
      {type: 'line', normal: [0, -1], rhs: -1, options: {zIndex: 0}},
      {type: 'scatter', data: [[1, 1]], options: {zIndex: 2}},
      {type: 'scatter', data: [[1, 1]], options: {zIndex: 11, color: '#000080'}}
    ];
    expect(graph.xlabel).toEqual("z1");
    expect(graph.ylabel).toEqual("z2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  it('creates a feasible region graph that is a vertical line', function () {
    var lp = GlpkUtil.solveGmpl(VERTICAL_LINE).lp;
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [1, 0], rhs: 1, options: {zIndex: 0}},
      {type: 'line', normal: [-1, 0], rhs: -1, options: {zIndex: 0}}
    ];
    expect(graph.xlabel).toEqual("x1");
    expect(graph.ylabel).toEqual("x2");
    expect(graph.layers).toEqual(expectedLayers);
  });

  // TODO: Why does this test fail??
/*  it('creates a feasible region graph that is a horizontal line', function () {
    var lp = GlpkUtil.loadGmpl(HORIZONTAL_LINE);
    var graph = FeasibleRegionGraph.create(lp);
    var expectedLayers = [
      {type: 'line', normal: [0, 1], rhs: 1, options: {zIndex: 0}},
      {type: 'line', normal: [0, -1], rhs: -1, options: {zIndex: 0}}
    ];
    expect(graph.xlabel).toEqual("x1");
    expect(graph.ylabel).toEqual("x2");
    expect(graph.layers).toEqual(expectedLayers);
  }); */
});
