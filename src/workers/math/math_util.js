"use strict";

var MathUtil = Object();

/**
 * Solves the two-dimensional system of equations Ax = b, where A is a 2 x 2 matrix, and b and x are 2-vector.
 * @param A
 * @param b
 * @returns {Array}
 */
MathUtil.solve2x2 = function(A, b) {
  var det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (det == 0) {
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
MathUtil.zeroes = function(m) {
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
MathUtil.multiplyVector = function(vector, factor) {
  var newVector = [];
  for (var i = 0; i < vector.length; i++) {
    newVector.push(vector[i] * factor);
  }
  return newVector;
};

