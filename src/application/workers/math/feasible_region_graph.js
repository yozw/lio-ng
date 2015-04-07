"use strict";

var FeasibleRegionGraph = Object();

FeasibleRegionGraph._addPolygon = function(graph, points, options) {
  // Add a polygon for the feasible region
  if (points.length === 2) {
    graph.addPolygon(points, options);
  } else if (points.length > 2) {
    var hull = new ConvexHull();
    hull.compute(points);
    var indices = hull.getIndices();
    var data = [];
    for (var i = 0; i < indices.length; i++) {
      var index = indices[i];
      data.push(points[index]);
    }
    if (data.length > 1) {
      data.push(data[0]);
    }
    graph.addPolygon(data, options);
  }
};

FeasibleRegionGraph._drawFeasibleRegion = function(graph, lp) {
  // Obtain all constraints, and add them as lines in the resulting graph
  var constraints = GlpkUtil.getConstraints(lp);
  for (var i = 0; i < constraints.matrix.length; i++) {
    graph.addLine(constraints.matrix[i], constraints.rhs[i]);
  }

  // Calculate all feasible and infeasible basic solutions
  var basicSolutions = MathUtil.getBasicSolutions(constraints.matrix, constraints.rhs);

  if (basicSolutions.feasible.length === 0) {
    // The feasible region is empty

    if (basicSolutions.infeasible.length === 0) {
      // The feasible region is empty and there are no basic solutions at all
      return {minX: -1, maxX: 1, minY: -1, maxY: 1};
    }

    // The feasible region is empty but there are infeasible basic solutions.
    // Return a box containing all infeasible basic solutions
    graph.addScatterPlot(basicSolutions.infeasible);
    return MathUtil.getBounds(basicSolutions.infeasible);
  }

  // The feasible region is nonempty.
  // Get the minimal 2d box containing all vertices
  var vertexBounds = MathUtil.getBounds(basicSolutions.feasible);

  // Expand the box by 1000% and use this as artificial bounds; these virtual bounds
  // are used to symbolize "infinity".
  var artificialBounds = MathUtil.expandBounds(vertexBounds, 10.0, 10.0);

  // Add artificial constraints; this helps displaying an unbounded feasible region
  constraints.matrix.push([1, 0]);
  constraints.matrix.push([-1, 0]);
  constraints.matrix.push([0, 1]);
  constraints.matrix.push([0, -1]);
  constraints.rhs.push(artificialBounds.maxX);
  constraints.rhs.push(-artificialBounds.minX);
  constraints.rhs.push(artificialBounds.maxY);
  constraints.rhs.push(-artificialBounds.minY);

  // Calculate the vertices of this artificially constrained problem
  var artificialVertices = MathUtil.getBasicSolutions(constraints.matrix, constraints.rhs).feasible;
  var objectiveVector = GlpkUtil.getMaximizingObjectiveVector(lp);
  var optArtificialVertices = MathUtil.getOptimalPoints(artificialVertices, objectiveVector);
  var optVertices = MathUtil.getOptimalPoints(basicSolutions.feasible, objectiveVector);

  FeasibleRegionGraph._addPolygon(graph, artificialVertices, {zIndex: 1});
  FeasibleRegionGraph._addPolygon(graph, optArtificialVertices.points, {
    zIndex: 10,
    color: "#000080",
    fillColor: "rgba(128,128,255,0.5)"
  });

  // Add all feasible basic solutions as points
  graph.addScatterPlot(basicSolutions.feasible, {zIndex: 2});

  // Add all optimal points as darker points
  if (MathUtil.almostEqual(optVertices.objectiveValue, optArtificialVertices.objectiveValue)) {
    graph.addScatterPlot(optVertices.points, {zIndex: 11, color: "#000080"});
  }

  return vertexBounds;
};

FeasibleRegionGraph.create = function (lp) {
  "use strict";
  if (glp_get_num_cols(lp) !== 2) {
    throw "FeasibleRegionGraph is only possible for two-dimensional models";
  }

  var graph = new Graph();
  var viewBounds = FeasibleRegionGraph._drawFeasibleRegion(graph, lp);

  // Make the view port a bit larger
  viewBounds = MathUtil.expandBounds(viewBounds, 0.5, 1.0);

  graph.setTitle("Feasible region");
  graph.setXlabel(glp_get_col_name(lp, 1));
  graph.setYlabel(glp_get_col_name(lp, 2));

  graph.setXRange(viewBounds.minX, viewBounds.maxX);
  graph.setYRange(viewBounds.minY, viewBounds.maxY);

  return graph;
};
