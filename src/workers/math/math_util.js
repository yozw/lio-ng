"use strict";

var MathUtil = Object();

/**
 * Solves the two-dimensional system of equations Ax = b, where A is a 2 x 2 matrix, and b and x are 2-vector.
 * @param A
 * @param b
 * @returns {Array}
 */
MathUtil.solve2x2 = function (A, b) {
  var det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (det === 0) {
    return null;
  }
  return [
    (A[1][1] * b[0] - A[0][1] * b[1]) / det,
    (A[0][0] * b[1] - A[1][0] * b[0]) / det
  ];
};

/**
 * Creates a zero-vector.
 * @param m
 * @returns {Array}
 */
MathUtil.zeroes = function (m) {
  var vector = [];
  for (var j = 0; j < m; j++) {
    vector.push(0);
  }
  return vector;
};

/**
 * Multiplies a vector by a scalar.
 * @param vector
 * @param factor
 * @returns {Array}
 */
MathUtil.multiplyVector = function (vector, factor) {
  var newVector = [];
  for (var i = 0; i < vector.length; i++) {
    newVector.push(vector[i] * factor);
  }
  return newVector;
};

/**
 * Determines whether a number is finite.
 * @returns {boolean} true if the argument is a number and it is finite.
 */
MathUtil.isFinite = function (number) {
  if (typeof number !== "number") {
    return false;
  }
  if (isNaN(number)) {
    return false;
  }
  return (number > -Number.MAX_VALUE) && (number < Number.MAX_VALUE);
};

MathUtil.getVertices = function (matrix, rhs) {
  var vertices = [];
  for (var i = 0; i < matrix.length; i++) {
    for (var j = i + 1; j < matrix.length; j++) {
      // Solve 2 x 2 system corresponding to constraint i and j
      var A = [matrix[i], matrix[j]];
      var b = [rhs[i], rhs[j]];
      var point = MathUtil.solve2x2(A, b);

      // If the two constraints are linearly dependent, there is nothing to do
      if (point === null) {
        continue;
      }

      // Check if the calculated basic solution is feasible
      var isFeasible = true;
      for (var k = 0; k < matrix.length; k++) {
        var slack = rhs[k] - matrix[k][0] * point[0] - matrix[k][1] * point[1];
        if (slack < -1e-8) {
          isFeasible = false;
          break;
        }
      }
      if (isFeasible) {
        vertices.push(point);
      }
    }
  }
  return vertices;
};


