"use strict";

function getConstraints(lp) {
  "use strict";
  var matrix = [];
  var rhs = [];
  var n = glp_get_num_rows(lp);

  for (var i = 1; i <= n; i++) {
    var row = GlpkUtil.getRow(lp, i)
    var lb = glp_get_row_lb(lp, i);
    var ub = glp_get_row_ub(lp, i);
    if (lb != -Number.MAX_VALUE) {
      matrix.push(MathUtil.multiplyVector(row, -1));
      rhs.push(-lb);
    }
    if (ub != Number.MAX_VALUE) {
      matrix.push(row);
      rhs.push(ub);
    }
  }
  console.log(matrix);
  return {matrix: matrix, rhs: rhs};
}

function getFeasibleRegionGraph(lp) {
  "use strict";
  getConstraints(lp);

  var o = Object();
  o.serialize = function() {
    return "";
  };

  return o;
}
