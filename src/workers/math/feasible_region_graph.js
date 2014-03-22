"use strict";

var FeasibleRegionGraph = Object();

function getBounds(vertices) {
  if (vertices.length > 0) {
    var minX = vertices[0][0];
    var maxX = vertices[0][0];
    var minY = vertices[0][1];
    var maxY = vertices[0][1];
    for (var i = 1; i < vertices.length; i++) {
      minX = Math.min(vertices[i][0], minX);
      maxX = Math.max(vertices[i][0], maxX);
      minY = Math.min(vertices[i][1], minY);
      maxY = Math.max(vertices[i][1], maxY);
    }
  }
  return {minX: minX, maxX: maxX, minY: minY, maxY: maxY};
}

function expandBounds(bounds, expansionFactor, defaultRange) {
  var rangeX = bounds.maxX - bounds.minX;
  var rangeY = bounds.maxY - bounds.minY;
  if (rangeX === 0) {
    rangeX = defaultRange;
  }
  if (rangeY === 0) {
    rangeY = defaultRange;
  }
  return {
    minX: bounds.minX - expansionFactor * rangeX / 2,
    maxX: bounds.maxX + expansionFactor * rangeX / 2,
    minY: bounds.minY - expansionFactor * rangeY / 2,
    maxY: bounds.maxY + expansionFactor * rangeY / 2
  };
}

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
  var vertexBounds = getBounds(vertices);

  // Expand it by 50% and set the result as the viewport
  var viewBounds = expandBounds(vertexBounds, 0.5, 1.0);
  graph.setXRange(viewBounds.minX, viewBounds.maxX);
  graph.setYRange(viewBounds.minY, viewBounds.maxY);

  // Expand it by 1000% and use this as artificial bounds; these virtual bounds are used to symbolize "infinity".
  var worldBounds = expandBounds(vertexBounds, 10.0, 10.0);

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

  if (vertices.length > 1) {
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

  graph.addScatterPlot(vertices);
  
  return graph;
};
