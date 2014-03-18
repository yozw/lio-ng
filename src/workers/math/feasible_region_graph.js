function getObjectiveVector(lp) {
  "use strict";
  var vector = [];
  for (var j = 1; j <= glp_get_num_cols(lp); j++) {
    vector.push(glp_get_obj_coef(lp, j));
  }
  return vector;
}

function zeroes(m) {
  var vector = [];
  for (var j = 0; j < m; j++) {
    vector.push(0);
  }
  return vector;
}

function multiplyVector(vector, factor) {
  var newVector = [];
  for (var i = 0; i < vector.length; i++) {
    newVector.push(vector[i] * factor);
  }
  return newVector;
}

function getRow(lp, i) {
  var m = glp_get_num_cols(lp);
  var row = zeroes(m);
  var ind = [];
  var val = [];
  var length = glp_get_mat_row(lp, i, ind, val);
  for (var k = 1; k <= length; k++) {
    row[ind[k] - 1] = val[k];
  }
  return row;
}

function getConstraints(lp) {
  "use strict";
  var matrix = [];
  var rhs = [];
  var n = glp_get_num_rows(lp);

  for (var i = 1; i <= n; i++) {
    var row = getRow(lp, i)
    var lb = glp_get_row_lb(lp, i);
    var ub = glp_get_row_ub(lp, i);
    if (lb != -Number.MAX_VALUE) {
      matrix.push(multiplyVector(row, -1));
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
