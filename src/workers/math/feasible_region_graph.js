"use strict";

var FeasibleRegionGraph = Object();

FeasibleRegionGraph.create = function (lp) {
  "use strict";
  var graph = new Graph();

  var constraints = GlpkUtil.getConstraints(lp);
  var vertices = MathUtil.getVertices(constraints.matrix, constraints.rhs);

  // graph.addScatterPlot(vertices);

  if (vertices.length > 0) {
    var hull = new ConvexHull();
    hull.compute(vertices);
    var indices = hull.getIndices();
    var data = [];
    for (var i = 0; i < indices.length; i++) {
      var index = indices[i];
      data.push(vertices[index]);
    }
    if (data.length > 1) {
      data.push(data[0]);
    }
    graph.addPolygon(data);
  }

  return graph;
};
