"use strict";

var FeasibleRegionGraph = Object();

FeasibleRegionGraph.create = function (lp) {
  "use strict";
  var graph = new Graph();

  var constraints = GlpkUtil.getConstraints(lp);
  for (var i = 0; i < constraints.matrix.length; i++) {
    graph.addLine(constraints.matrix[i], constraints.rhs[i]);
  }
    
  var vertices = MathUtil.getVertices(constraints.matrix, constraints.rhs);

  if (vertices.length > 1) {
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

  graph.addScatterPlot(vertices);
  
  console.log(JSON.stringify(graph.serialize()));

  return graph;
};
