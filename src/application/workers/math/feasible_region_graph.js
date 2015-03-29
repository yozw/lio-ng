"use strict";

var FeasibleRegionGraph = Object();

FeasibleRegionGraph.create = function (lp) {
  "use strict";
  var graph = new Graph();

  // Obtain all constraints, and add them as lines in the resulting graph
  var constraints = GlpkUtil.getConstraints(lp);
  for (var i = 0; i < constraints.matrix.length; i++) {
    graph.addLine(constraints.matrix[i], constraints.rhs[i]);
  }

  // Calculate all vertices
  var vertices = MathUtil.getVertices(constraints.matrix, constraints.rhs);

  // Get the minimal 2d box containing all vertices
  var vertexBounds;
  var viewBounds;
  if (vertices.length > 0) {
    vertexBounds = MathUtil.getBounds(vertices);
    viewBounds = MathUtil.expandBounds(vertexBounds, 0.5, 1.0);
  } else {
    vertexBounds = {minX: 0, maxX: 0, minY: 0, maxY: 0};
    viewBounds = null;
  }

  // Expand it by 1000% and use this as artificial bounds; these virtual bounds are used to symbolize "infinity".
  var worldBounds = MathUtil.expandBounds(vertexBounds, 10.0, 10.0);

  // Add artificial constraints; this aids displaying an unbounded feasible region
  constraints.matrix.push([1, 0]);
  constraints.matrix.push([-1, 0]);
  constraints.matrix.push([0, 1]);
  constraints.matrix.push([0, -1]);
  constraints.rhs.push(worldBounds.maxX);
  constraints.rhs.push(-worldBounds.minX);
  constraints.rhs.push(worldBounds.maxY);
  constraints.rhs.push(-worldBounds.minY);

  // Calculate the vertices of this artificially constrained problem
  vertices = MathUtil.getVertices(constraints.matrix, constraints.rhs);

  if (viewBounds === null) {
    // TODO: Sort out what to do here exactly
    // If one of the coordinates goes off to infinity: shrink by a small factor
    // Otherwise, expand by either a factor or a constant
    viewBounds = MathUtil.expandBounds(MathUtil.getBounds(vertices), 0, 1);
  }

  if (vertices.length === 0) {
    // TODO: decide what to do if the feasible region is empty
  } else if (vertices.length === 2) {
    graph.addPolygon(vertices);
  } else if (vertices.length > 2) {
    var hull = new ConvexHull();
    hull.compute(vertices);
    var indices = hull.getIndices();
    var data = [];
    for (i = 0; i < indices.length; i++) {
      var index = indices[i];
      data.push(vertices[index]);
    }
    if (data.length > 1) {
      data.push(data[0]);
    }
    graph.addPolygon(data);
  }

  graph.setTitle("Feasible region");
  graph.setXlabel("x1");
  graph.setYlabel("x2");
  graph.addScatterPlot(vertices);

  graph.setXRange(viewBounds.minX, viewBounds.maxX);
  graph.setYRange(viewBounds.minY, viewBounds.maxY);

  return graph;
};
